<template>
  <b-card>
    <form-render :form.sync="form" :fields="fields" @send="updatePassword" ref="formRenderPassword" :buttonSend="buttonSend" containerButtonsClass="col-sm-12 mt-1">
    <template #security>
      <ul>
          <li :class="statusPwd.length ? 'text-success' : ''">
              {{ $t('Longitud de al menos 10 caracteres') }} <i v-if="statusPwd.length" class="fa fa-check-circle" aria-hidden="true"></i>
          </li>
          <li :class="statusPwd.capitalLetter ? 'text-success' : ''">
              {{ $t('Debe contener al menos una letra mayúscula') }} <i v-if="statusPwd.capitalLetter" class="fa fa-check-circle" aria-hidden="true"></i>
          </li>
          <li :class="statusPwd.lowerCase ? 'text-success' : ''">
              {{ $t('Debe contener al menos una letra minúscula') }} <i v-if="statusPwd.lowerCase" class="fa fa-check-circle" aria-hidden="true"></i>
          </li>
          <li :class="statusPwd.number ? 'text-success' : ''">
              {{ $t('Debe contener al menos un número') }} <i v-if="statusPwd.number" class="fa fa-check-circle" aria-hidden="true"></i>
          </li>
          <li :class="statusPwd.specialCharacter ? 'text-success' : ''">
              {{ $t('Debe contener al menos un caracter especial (!@#$%^&*)') }} <i v-if="statusPwd.specialCharacter" class="fa fa-check-circle" aria-hidden="true"></i>
          </li>
          <li :class="statusPwd.samePasswords ? 'text-success' : ''">
              {{ $t('Las contraseñas deben ser idénticas en ambos campos') }} <i v-if="statusPwd.samePasswords" class="fa fa-check-circle" aria-hidden="true"></i>
          </li>
      </ul>
    </template>
    <template #containerRecaptcha>
      <div id="recaptcha" class="mt-1 text-center"></div>
    </template>
      <template #buttons>
        <b-button variant="outline-light" class="ml-2" @click="resetForm"><feather-icon icon="RefreshCwIcon"/> {{ $t('Limpiar formulario') }}</b-button>  
      </template>
      <template #space>
      </template>
    </form-render>
  </b-card>
</template>

<script>
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import LoginService from '../login.service'
import { environment } from '@/environments/environment'

// eslint-disable-next-line no-undef
const googleRecaptcha = grecaptcha.enterprise


export default {
  components: {
  },
  data() {
    return {
      buttonSend: { color: 'warning', icon: 'SaveIcon', text: 'Actualizar' },
      form: {},
      fields: [],
      attempt: 0,
      tokenRecaptcha: 'norendered',
      widget: null,
      statusPwd:{
        length: false,
        specialCharacter: false,
        capitalLetter: false,
        lowerCase: false,
        samePasswords: false,
        number: false
      },
      loginService: new LoginService(this)
    }
  },
  mounted () {
    this.fields = [
      { fieldType: 'FieldInput', type: 'password', label: 'Contraseña actual', name: 'current_password', range: true, optionGroup: { class: 'input-group-merge'}, containerClass: 'col-sm-12 col-md-6 container-info' },
      { name: 'space', useSlot: true, containerClass: 'col-sm-12 col-md-6 container-info' },
      { fieldType: 'FieldInput', type: 'password', label: 'Nueva contraseña', name: 'new_password', optionGroup: { class: 'input-group-merge'}, change: this.onChangeNewPass, containerClass: 'col-sm-12 col-md-6 container-info' },
      { fieldType: 'FieldInput', type: 'password', label: 'Repita nueva contraseña', placeholder: 'Ingrese nueva contraseña', name: 'new_password2', change: this.onChangeNewPass, optionGroup: { class: 'input-group-merge'}, containerClass: 'col-sm-12 col-md-6 container-info' },
      { name: 'security', useSlot: true, containerClass: 'col-sm-12'},
      { name: 'containerRecaptcha', useSlot: true}
    ]
    
    setTimeout(() => this.showRecaptcha('recaptcha', this.attempt, 0), 200)
    // this.$root.$data.auth.currentUser.reauthenticateWithCredential()
  },
  methods: {
    onChangeNewPass () {
      const lengthRegex = new RegExp('.{8,}')
      const specialCharacterRegex = new RegExp('[!@#$%^&*]')
      const capitalLetterRegex = new RegExp('[A-Z]')
      const lowerCaseregex = new RegExp('[a-z]')
      const numberRegex = new RegExp('[0-9]')

      this.statusPwd = {
        ...this.statusPwd,
        length: lengthRegex.test(!!this.form.new_password ? this.form.new_password.trim() : ''),
        specialCharacter: specialCharacterRegex.test(this.form.new_password),
        capitalLetter: capitalLetterRegex.test(this.form.new_password),
        lowerCase: !!this.form.new_password ? lowerCaseregex.test(this.form.new_password) : false,
        number: numberRegex.test(this.form.new_password),
        samePasswords: !!this.form.new_password && this.form.new_password2 === this.form.new_password
      }
    },
    resetForm () {
      this.form = {}
    },
    verifyCallback (token) {
      this.enableButton = true
      this.tokenRecaptcha = token
    },
    showRecaptcha (element, attempt, maxAttempt) {
      if (attempt >= maxAttempt) {
        this.enableButton = false
        if (this.tokenRecaptcha === 'norendered') {
          this.widget = googleRecaptcha.render(element, {
            'sitekey' : environment.recaptchaKey,
            'callback' : (token) => this.verifyCallback(token)
          })
        } else if (!this.widegt) googleRecaptcha.reset(this.widget)
        this.tokenRecaptcha = 'notoken'
      }
    },
    async updatePassword () {
      const user = this.$root.$data.auth.currentUser
      if (this.validateForm()) return 0
      this.attempt++
      if (this.tokenRecaptcha === 'norendered') {
        this.loading = true
        this.authentication()
      } else if (this.tokenRecaptcha === 'notoken') {
        this.$alert(this.$t('Debe marcar la casilla "No soy un robot"'))
      } else {
        this.buttonSend.icon = 'LoaderIcon'
        this.buttonSend.iconClass = 'spinner'
        this.buttonSend.disabled = true
        const credential = this.$root.$data.fb.auth.EmailAuthProvider.credential(this.$session.get('cas_user').email, this.form.current_password)
        await user.reauthenticateWithCredential(credential)
        user.updatePassword(this.form.new_password)
          .then((resp) => {
            this.$toast({
              component: ToastificationContent,
              position: 'top-right',
              props: {
                title: this.$t('¡Éxito!'),
                icon: 'CheckCircleIcon',
                variant: 'success',
                text: this.$t('Su contraseña ha sido actualizada')
              }
            })
          })
          .catch((error) => {
            console.error(error)
          })
          .finally(end => {
            this.showRecaptcha('recaptcha', this.attempt, 0)
            this.buttonSend.icon = 'LoaderIcon'
            this.buttonSend.iconClass = 'spinner'
            this.buttonSend.disabled = true
          })
      }
    },
    validateForm () {
      let message = ''
      const strongRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})')
      console.log(!this.statusPwd.specialCharacter || !this.statusPwd.capitalLetter || !this.statusPwd.lowerCase || !this.statusPwd.number || !this.statusPwd.samePasswords)
      if (!this.statusPwd.specialCharacter || !this.statusPwd.capitalLetter || !this.statusPwd.lowerCase || !this.statusPwd.number || !this.statusPwd.samePasswords) {
        message = this.$t('La contraseña no cumple con todos los requisitos')
        this.$toast({
          component: ToastificationContent,
          position: 'top-right',
          props: {
            title: this.$t('toast-change-password-error'),
            icon: 'WarningIcon',
            variant: 'danger',
            text: message
          }
        })
        this.showRecaptcha('recaptcha', this.attempt, 0)
      }
      return message !== ''
    }
  }
}
</script>
