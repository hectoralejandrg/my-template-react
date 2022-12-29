<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">

      <b-card class="mb-0">
        <b-link class="brand-logo">
          <img src="@/assets/images/logo/enviame.svg" alt="login" class="mx-auto" width="200">
        </b-link>

        <b-card-title class="mb-1">
          {{$t('¿Olvidaste tu contraseña?')}} 🔒
        </b-card-title>
        <b-card-text class="mb-2">
          {{$t('Ingresa tu e-mail y te enviaremos instrucciones para recuperarla')}}
        </b-card-text>

        <validation-observer ref="recoveryForm">
          <b-form class="auth-forgot-password-form mt-2" @submit.prevent="validationForm">
            <b-form-group label="E-mail" label-for="forgot-password-email">
              <validation-provider #default="{ errors }" name="Email" rules="required|email">
                <b-form-input id="forgot-password-email" v-model="userEmail" :state="errors.length > 0 ? false:null" name="forgot-password-email" placeholder="usuario@empresa.com"/>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
            <div id="recaptcha" class="mt-1 text-center"></div>

            <b-button variant="warning" class="mt-2" block type="submit">
              {{$t('Envíar enlace de recuperación')}}
            </b-button>
          </b-form>
        </validation-observer>

        <b-card-text class="text-center mt-2">
          <b-link :to="{name:'auth-login'}" class="lnk lnk-warning">
            <feather-icon icon="ChevronLeftIcon" /> {{$t('Volver al login')}}
          </b-link>
        </b-card-text>
      </b-card>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import {
  BCard, BLink, BCardText, BCardTitle, BFormGroup, BFormInput, BForm, BButton
} from 'bootstrap-vue'
import { required, email } from '@validations'
import LoginService from './login.service'
import { environment } from '@/environments/environment'

// eslint-disable-next-line no-undef
const googleRecaptcha = grecaptcha.enterprise

export default {
  components: {
    BCard,
    BLink,
    BCardText,
    BCardTitle,
    BFormGroup,
    BFormInput,
    BButton,
    BForm,
    ValidationProvider,
    ValidationObserver
  },
  data() {
    return {
      userEmail: '',
      loading: false,
      // validation
      required,
      attempt: 0,
      tokenRecaptcha: 'norendered',
      widget: null,
      email,
      loginService: new LoginService(this)
    }
  },
  mounted () {
    this.showRecaptcha('recaptcha', this.attempt, 0)
  },
  methods: {
    sendEmail () {
      this.$toast({
        component: ToastificationContent,
        position: 'top-right',
        props: {
          title: this.$t('Recuperar contraseña'),
          icon: 'KeyIcon',
          variant: 'warning',
          text: this.$t('toast-successfull-password-recovery-description')
        }
      })
      this.userEmail = ''
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
    validationForm() {
      this.$refs.recoveryForm.validate().then(success => {
        if (success) {
          this.attempt++
          if (this.tokenRecaptcha === 'norendered') {
            this.loading = true
            this.recoveryPass()
          } else if (this.tokenRecaptcha === 'notoken') {
            this.$alert(this.$t('Debe marcar la casilla "No soy un robot"'))
          } else {
            this.loading = true
            this.loginService.callService('validateRecaptcha', null, { response: this.tokenRecaptcha, expectedAction: 'recovery-password' })
              .then(resp => {
                if (resp.tokenProperties?.valid) {
                  this.recoveryPass()
                } else {
                  this.showRecaptcha('recaptcha', this.attempt, 0)
                  this.$alert(this.$t('msg-sus-activity-recovery', {code: resp.reasons[0] || 'INVALID_REASON'}))
                  this.loading = false
                }
              })
              .catch(err => {
                this.showRecaptcha('recaptcha', this.attempt, 0)
                this.loading = false
                console.error(err)
              })
          }
        }
      })
    },
    recoveryPass () {
      this.$root.$data.auth.sendPasswordResetEmail(this.userEmail)
        .then((resp) => {
          this.sendEmail()
        })
        .catch((error) => {
          const errorCode = error.code
          const errorMessage = error.message
          console.error(error)
          this.sendEmail()
        })
        .finally(_ => {
          this.showRecaptcha('recaptcha', this.attempt, 0)
        })
    }
  }
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
