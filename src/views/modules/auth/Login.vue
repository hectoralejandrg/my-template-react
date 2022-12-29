<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">
      <b-card class="mb-0">
        <b-link class="d-flex justify-content-center mb-2">
          <img src="@/assets/images/logo/logo_horizontal.svg" alt="login" class="" width="300">
        </b-link>

        <b-card-title class="mb-1">
          {{ $t('Bienvenido a Enviatrack!') }} 👋
        </b-card-title>
        <b-card-text class="mb-2">
          {{$t('Inicie sesión en su cuenta y comience la aventura')}}
        </b-card-text>

        <!-- form -->
        <validation-observer
          ref="loginForm"
          #default="{invalid}"
        >
          <b-form class="auth-login-form mt-1" @submit.prevent="login">

            <!-- email -->
            <b-form-group label-for="email" :label="$t('Email')">
              <validation-provider #default="{ errors }" name="Email" rules="required|email">
                <b-form-input
                  id="email"
                  v-model="userEmail"
                  :disabled="loading"
                  name="login-email"
                  :state="errors.length > 0 ? false:null"
                  placeholder="john@example.com"
                  autofocus
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- password -->
            <b-form-group class="mt-1">
              <div class="d-flex justify-content-between">
                <label for="password">{{$t('Contraseña')}}</label>
                <b-link :to="{name:'recovery'}" class="lnk lnk-warning">
                  <small>{{$t('¿Olvidaste tu contraseña?')}}</small>
                </b-link>
              </div>
              <validation-provider #default="{ errors }" name="Password" rules="required">
                <b-input-group class="input-group-merge" :class="errors.length > 0 ? 'is-invalid':null">
                  <b-form-input
                    id="password"
                    :disabled="loading"
                    v-model="password"
                    :type="passwordFieldType"
                    class="form-control-merge"
                    :state="errors.length > 0 ? false:null"
                    name="login-password"
                    :placeholder="$t('Contraseña')"
                  />

                  <b-input-group-append is-text>
                    <feather-icon class="cursor-pointer" :icon="passwordToggleIcon" @click="togglePasswordVisibility"/>
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- checkbox -->
            <b-form-group class="mt-1">
              <b-form-checkbox id="remember-me" v-model="status" name="checkbox-1" :disabled="loading">
                {{$t('Recuérdame')}}
              </b-form-checkbox>
            </b-form-group>

            <!-- submit button -->
            
            <div id="recaptcha" class="mt-1 text-center"></div>
            <b-button class="mt-1" variant="warning" block :disabled="invalid || loading">
              <feather-icon v-if="loading" icon="LoaderIcon" class="spinner"/>
              {{$t('Iniciar sesión')}}
            </b-button>
          </b-form>
        </validation-observer>
        <!-- <b-card-text class="text-center mt-1">
          <span>{{$t('¿Aun no has ingresado a la nueva plataforma?')}} </span>
          <b-link class="lnk lnk-warning" :to="{name:'signup'}">{{$t('Crea tu cuenta')}}</b-link>
        </b-card-text> -->
      </b-card>
      <!-- /Login v1 -->
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
// import { VueReCaptcha } from 'vue-recaptcha-v3'

import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BButton, BForm, BFormInput, BFormGroup, BCard, BLink, BCardTitle, BCardText, BInputGroup, BInputGroupAppend, BFormCheckbox
} from 'bootstrap-vue'
import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'
import useJwt from '@/auth/jwt/useJwt'
import LoginService from './login.service'
import { mapGetters } from 'vuex'
import { environment } from '@/environments/environment'

// eslint-disable-next-line no-undef
const googleRecaptcha = grecaptcha.enterprise

export default {
  components: {
    // BSV
    BButton,
    BForm,
    BFormInput,
    BFormGroup,
    BCard,
    BCardTitle,
    BLink,
    BCardText,
    BInputGroup,
    BInputGroupAppend,
    BFormCheckbox,
    ValidationProvider,
    ValidationObserver
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      status: '',
      password: '',
      userEmail: '',
      // validation rules
      required,
      email,
      datos: null,
      loading: false,
      loggedUser: {},
      attempt: 0,
      tokenRecaptcha: 'norendered',
      widget: null,
      loginService: new LoginService(this)
    }
  },
  mounted () {
    // console.log(googleRecaptcha)
    // this.$recaptchaInstance.showBadge()
  },
  watch: {
    userAlerts (curr) {
      this.loading = false
      if (curr.status === 'ok') {
        // this.$recaptchaInstance.hideBadge()
      }
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    ...mapGetters({
      userAlerts: 'getUserAlerts'
    })
  },
  methods: {
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
    async login() {
      this.$refs.loginForm.validate().then(success => {
        if (success) {
          this.attempt++
          if (this.tokenRecaptcha === 'norendered') {
            this.loading = true
            this.authentication()
          } else if (this.tokenRecaptcha === 'notoken') {
            this.$alert(this.$t('Debe marcar la casilla "No soy un robot"'))
          } else {
            this.loading = true
            // this.$recaptcha('loginForm').then((token) => {
            // this.tokenRecaptcha = token
            const params = { response: this.tokenRecaptcha, expectedAction: 'login' }
            this.loginService.callService('validateRecaptcha', params, params)
              .then(resp => {
                if (resp.tokenProperties?.valid) {
                  this.authentication()
                } else {
                  this.showRecaptcha('recaptcha', this.attempt, 0)
                  this.$alert(this.$t('msg-sus-activity-login', {code: resp.reasons[0] || 'INVALID_REASON'}))
                  this.loading = false
                }
              })
              .catch(err => {
                this.showRecaptcha('recaptcha', this.attempt, 0)
                this.loading = false
                console.error(err)
              })
            // })
          }
        } else {
          this.showRecaptcha('recaptcha', this.attempt, 0)
        }
      })
    },
    authentication () {
      this.$root.$data.auth
        .signInWithEmailAndPassword(this.userEmail, this.password)
        .then((data) => {
          this.$root.$data.auth.setPersistence(this.$root.$data.fb.auth.Auth.Persistence.LOCAL)
          this.loggedUser = data.user
          return data.user.getIdToken()
        })
        .then((token) => {
          this.$store.dispatch('fetchUserData', {id: this.loggedUser.uid, token, from: 'login', remember: this.status})
        })
        .catch((err) => {
          this.showRecaptcha('recaptcha', this.attempt, 0)
          this.loading = false
          console.error(err)
          let message = err.message
          if (['auth/wrong-password', 'auth/user-not-found'].includes(err.code)) {
            message = 'Correo o contraseña incorrectos'
          }
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title:'Error',
              icon: 'WarningIcon',
              variant: 'danger',
              text: message
            }
          })
        })
    }
  }
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
