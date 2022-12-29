<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">

      <!-- Brand logo-->
      <b-link class="brand-logo">
        <img src="@/assets/images/logo/enviame.svg" alt="login" class="mx-auto" width="200">
      </b-link>
      <!-- /Brand logo-->

      <!-- Left Text-->
      <b-col
        lg="8"
        class="d-none d-lg-flex align-items-center p-5"
      >
        <div class="w-100 d-lg-flex align-items-center justify-content-center px-5">
          <b-img
            fluid
            :src="imgUrl"
            alt="Register V2"
          />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Register-->
      <b-col
        lg="4"
        class="d-flex align-items-center auth-bg px-2 p-lg-5"
      >
        <b-col
          sm="8"
          md="6"
          lg="12"
          class="px-xl-2 mx-auto"
        >

          <!-- form -->
          <validation-observer
            ref="registerForm"
            #default="{invalid}"
          >
            <b-form
              class="auth-register-form mt-2"
              @submit.prevent="register"
            >

              <!-- name -->
              <b-form-group
                class="mb-1"
                :label="$t('Nombre')"
                label-for="register-name"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Name"
                  vid="name"
                  rules="required"
                >
                  <b-form-input
                    id="register-name"
                    v-model="userName"
                    :disabled="loading"
                    name="register-name"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Jhon"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- lastname -->
              <b-form-group
                class="mb-1"
                :label="$t('Apellido')"
                label-for="register-lastname"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Apellido"
                  vid="lastname"
                  rules="required"
                >
                  <b-form-input
                    :disabled="loading"
                    id="register-lastname"
                    v-model="userLastname"
                    name="register-lastname"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Doe"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- email -->
              <b-form-group
                class="mb-1"
                :label="$t('Email')"
                label-for="register-email"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Email"
                  vid="email"
                  rules="required|email"
                >
                  <b-form-input
                    :disabled="loading"
                    id="register-email"
                    v-model="userEmail"
                    name="register-email"
                    :state="errors.length > 0 ? false:null"
                    placeholder="john@example.com"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- password -->
              <b-form-group
                class="mb-1"
                label-for="register-password"
                :label="$t('Contraseña')"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Password"
                  vid="password"
                  rules="required"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid':null"
                  >
                    <b-form-input
                      id="register-password"
                      v-model="password"
                      :disabled="loading"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      :state="errors.length > 0 ? false:null"
                      name="register-password"
                      placeholder="············"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        :icon="passwordToggleIcon"
                        class="cursor-pointer"
                        @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                class="mb-1">
                <b-form-checkbox
                  id="register-privacy-policy"
                  v-model="status"
                  name="checkbox-1"
                >
                  {{$t('Acepto')}}
                  <b-link class="lnk lnk-warning">{{$t('los terminos y condiciones')}}</b-link>
                </b-form-checkbox>
              </b-form-group>

              <b-button
                variant="warning"
                block
                type="submit"
                :disabled="invalid || !status || loading"
              >
              <feather-icon v-if="loading" icon="LoaderIcon" class="spinner"/>
                {{$t('Registrarse')}}
              </b-button>
            </b-form>
          </validation-observer>

          <p class="text-center mt-2">
            <span>{{$t('¿Ya ha ingresado antes a la nueva plataforma?')}}</span>
            <b-link :to="{name:'auth-login'}" class="lnk lnk-warning"> {{$t('Accede al sitio')}}</b-link>
          </p>

        </b-col>
      </b-col>
    <!-- /Register-->
    </b-row>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'

import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BRow, BCol, BLink, BButton, BForm, BFormCheckbox, BFormGroup, BFormInput, BInputGroup, BInputGroupAppend, BImg, BCardTitle, BCardText
} from 'bootstrap-vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'
import store from '@/store/index'
import useJwt from '@/auth/jwt/useJwt'
import LoginService from './login.service'
import { environment } from '@/environments/environment'

// eslint-disable-next-line no-undef
const googleRecaptcha = grecaptcha.enterprise

export default {
  components: {
    BRow,
    BImg,
    BCol,
    BLink,
    BButton,
    BForm,
    BFormCheckbox,
    BFormGroup,
    BFormInput,
    BInputGroup,
    BInputGroupAppend,
    // validations
    ValidationProvider,
    ValidationObserver
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      status: '',
      userName: '',
      userLastname: '',
      userEmail: '',
      password: '',
      loading: false,
      newUser: {},
      attempt: 0,
      tokenRecaptcha: 'norendered',
      widget: null,
      sideImg: require('@/assets/images/pages/register-v2.svg'),
      // validation
      required,
      email,
      loginService: new LoginService(this)
    }
  },
  watch: {
    userAlerts (curr) {
      this.loading = false
      if (curr.status === 'ok') {
        this.$recaptchaInstance.hideBadge()
      }
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/register-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
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
    createAccount (token) {
      const user = {
        email: this.userEmail,
        role: 'admin',
        roles: ['user', 'admin'],
        name: this.userName,
        lastname: this.userLastname,
        fullName: `${this.userName} ${this.userLastname}`,
        created: (new Date()).getTime(),
        status: true
      }
      this.$root.$data.accountsCollection.doc(this.newUser.uid).set(user)
        .then(resp => {
          this.$store.dispatch('fetchUserData', {id:  this.newUser.uid, token, from: 'signup'})
        })
        .catch(err => {
          console.error(err)
          this.loading = false
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title:'Error',
              icon: 'WarningIcon',
              variant: 'danger',
              text: err.message
            }
          })
        })
    },
    saveAccount () {
      this.$root.$data.auth.createUserWithEmailAndPassword(this.userEmail, this.password)
        .then((userCredential) => {
          this.newUser = userCredential.user
          return this.newUser.getIdToken()
        })
        .then((token) => {
          // useJwt.setRefreshToken(token)
          this.createAccount(token)
        })
        .catch((error) => {
          const errorCode = error.code
          const errorMessage = error.message
          this.loading = false
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title:'Error',
              icon: 'WarningIcon',
              variant: 'danger',
              text: 'No fue posible registrar su cuenta'
            }
          })
        })
    },
    register() {
      this.$refs.registerForm.validate().then(success => {
        if (success) {
          this.attempt++
          if (this.tokenRecaptcha === 'norendered') {
            this.loading = true
            this.saveAccount()
          } else if (this.tokenRecaptcha === 'notoken') {
            this.$alert(this.$t('Debe marcar la casilla "No soy un robot"'))
          } else {
            this.loading = true
            // this.$recaptcha('loginForm').then((token) => {
            // this.tokenRecaptcha = token
            const params = { response: this.tokenRecaptcha, expectedAction: 'signup' }
            this.loginService.callService('validateRecaptcha', params, params)
              .then(resp => {
                if (resp.tokenProperties?.valid) {
                  this.saveAccount()
                } else {
                  this.showRecaptcha('recaptcha', this.attempt, 0)
                  this.$alert(this.$t('msg-sus-activity-signup', {code: resp.reasons[0] || 'INVALID_REASON'}))
                  this.loading = false
                }
              })
              .catch(err => {
                this.showRecaptcha('recaptcha', this.attempt, 0)
                this.loading = false
                console.error(err)
              })
          }
        } else {
          this.showRecaptcha('recaptcha', this.attempt, 0)
        }
      })
    }
  }
}
/* eslint-disable global-require */
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
