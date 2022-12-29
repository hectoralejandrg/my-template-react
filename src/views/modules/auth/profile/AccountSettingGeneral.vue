<template>
  <b-card>

    <!-- media -->
    <b-media no-body>
      <b-media-aside class="container-avatar">
        <span class="overimage" v-show="loading.uploading"><feather-icon icon="LoaderIcon" size="3x" class="spinner "/></span>
        <b-link>
          <b-avatar ref="previewEl" rounded :src="avatar" size="80"
            variant="light-primary"
            @img-error="($event) => onErrorImage($event)"/>
        </b-link>
        <!--/ avatar -->
      </b-media-aside>
      <b-media-body class="mt-75 ml-75">
        <!-- upload button -->
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="warning"
          size="sm"
          :disabled="loading.uploading"
          class="mb-75 mr-75"
          @click="$refs.refInputEl.$el.click()"
        >
          {{$t('Subir')}}
        </b-button>
        <b-form-file
          ref="refInputEl"
          v-model="profileFile"
          accept=".jpg, .png, .gif, jpeg"
          :hidden="true"
          plain
          @input="inputImageRenderer"
        />
        <!--/ upload button -->

        <!--
        <b-button
          v-ripple.400="'rgba(186, 191, 199, 0.15)'"
          variant="outline-secondary"
          size="sm"
          class="mb-75 mr-75"
        >
          Reiniciar
        </b-button>
        reset -->
        <b-card-text>{{$t('restrictions-avatar')}}</b-card-text>
      </b-media-body>
    </b-media>
    <!--/ media -->
    <form-render class="mt-2" :form.sync="form" :fields="fields" @send="updateProfile" ref="formRenderPassword" :buttonSend="buttonSend" containerButtonsClass="col-sm-12 mt-1">
      <template #buttons>
        <b-button variant="outline-light" class="ml-2" @click="resetForm"><feather-icon icon="RefreshCwIcon"/> {{$t('Limpiar formulario')}}</b-button>  
      </template>
      <template #space>
      </template>
    </form-render>
  </b-card>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  BFormFile, BButton, BForm, BFormGroup, BFormInput, BRow, BCol, BAlert, BCard, BCardText, BMedia, BMediaAside, BMediaBody, BLink
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { useInputImageRenderer } from '@core/comp-functions/forms/form-utils'
import { ref } from '@vue/composition-api'
import { getTimeZones } from '@vvo/tzdb'
import { DateTime } from 'luxon'

export default {
  components: {
    BButton,
    BFormFile,
    BCard,
    BCardText,
    BMedia,
    BMediaAside,
    BMediaBody,
    BLink
  },
  directives: {
    Ripple
  },
  data() {
    return {
      avatar: null,
      profileFile: null,
      buttonSend: { icon: 'SaveIcon', text: 'Guardar cambios', color: 'warning'},
      form: {},
      fields: [
        { name: 'skeleton1', useSkeleton: true, containerClass: 'col-sm-12 col-md-6 container-info' },
        { name: 'skeleton2', useSkeleton: true, containerClass: 'col-sm-12 col-md-6 container-info hidden' },
        { name: 'skeleton3', useSkeleton: true, containerClass: 'col-sm-12 col-md-6 container-info' },
        { name: 'skeleton4', useSkeleton: true, containerClass: 'col-sm-12 col-md-6 container-info' },
        { name: 'skeleton5', useSkeleton: true, containerClass: 'col-sm-12 col-md-6 container-info' },
        { name: 'skeleton6', useSkeleton: true, containerClass: 'col-sm-12 col-md-6 container-info' }
      ],
      optionsTimezone: getTimeZones().map(el => ({...el, id: el.name, text: el.currentTimeFormat})),
      defaultTimezone: DateTime.local().setZone('system').zoneName,
      optionsTypeFormats: [
        { id: 'dd-mm-yyyy', text: 'Día-Mes-Año' },
        { id: 'mm-dd-yyyy', text: 'Mes-Día-Año' },
        { id: 'yyyy-mm-dd', text: 'Año-Mes-Día' },
        { id: 'yyyy-dd-mm', text: 'Año-Día-Mes' }
      ],
      defaultTypeFormat: 'dd-mm-yyyy',
      loading: {
        form: true,
        image: true,
        uploading: false
      }
    }
  },
  computed: {
    ...mapGetters({
      userData: 'getUserData'
    })
  },
  watch: {
    profileFile () {
      if (this.profileFile) {
        if (this.profileFile.size <= 1000000) {
          this.uploadToStorage()
        } else {
          this.avatar = this.form.avatar
          this.$alert(this.$t('oversize-image-avatar'))
        }
      }
    },
    userData () {
      if (this.userData?.id) this.setInitialData()
    },
    form: {
      handler (curr, prev) {
        this.buttonSend = { icon: 'SaveIcon', text: 'Guardar cambios', color: 'warning'}
      },
      deep: true
    }
  },
  mounted () {
    if (this.userData?.id) this.setInitialData()

  },
  methods: {
    setInitialData () {
      this.setDataProfile()
    
      // const currentTimezone = user.timezone ? user.timezone : this.defaultTimezone
      // const currentTypeFormat = user.date_format ? user.date_format : this.defaultTypeFormat
      this.fields = [
        { fieldType: 'FieldInput', type: 'email', label: 'E-mail', name: 'email', containerClass: 'col-sm-6 container-info', disabled: true, validation: 'email' },
        { name: 'space', useSlot: true, containerClass: 'col-sm-12 col-md-6 container-info' },
        { fieldType: 'FieldInput', type: 'text', label: 'Nombre', name: 'first_name', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required', clearable: false },
        { fieldType: 'FieldInput', type: 'text', label: 'Apellido', name: 'last_name', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required', clearable: false },
        { fieldType: 'FieldSelect', name: 'date_format', label: 'Formato fecha', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required', options: this.optionsTypeFormats, clearable: false},
        { fieldType: 'FieldSelect', name: 'timezone', label: 'Zona horaria', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required', options: this.optionsTimezone, clearable: false}
      ]
      this.buttonSend = { icon: 'SaveIcon', text: 'Guardar cambios', color: 'warning'}
    },
    async updateProfile (data) {
      this.buttonSend.icon = 'LoaderIcon'
      this.buttonSend.iconClass = 'spinner'
      this.buttonSend.disabled = true
      const payload = {
        first_name: data.first_name,
        last_name: data.last_name,
        timezone: data.timezone?.id || '',
        date_format: data.date_format?.id || '',
        fullName: `${data.first_name} ${data.last_name}`
      }
      try {
        const resp = await this.$root.$data.accountsCollection.doc(this.$session.get('cas_user').id).update({...payload})
        this.$store.dispatch('fetchItemUserData', { element: 'first_name', value: payload.first_name })
        this.$store.dispatch('fetchItemUserData', { element: 'last_name', value: payload.last_name })
        this.$store.dispatch('fetchItemUserData', { element: 'timezone', value: payload.timezone })
        this.$store.dispatch('fetchItemUserData', { element: 'date_format', value: payload.date_format })
        this.$store.dispatch('fetchItemUserData', { element: 'fullName', value: payload.fullName })
        this.buttonSend = { icon: 'CheckCircleIcon', text: 'Perfil actualizado', color: 'success', disabled: true}
      } catch (e) { 
        console.error(e)
        this.$alert(this.$t('msg-problema-cargar-datos', {code: e}))
        this.buttonSend = { icon: 'SaveIcon', text: 'Guardar cambios', color: 'warning'}
      }
    },
    setDataProfile () {
      this.form = {...this.userData}
      this.form.timezone = this.userData.timezone ? this.optionsTimezone.filter(el => el.id === this.userData.timezone)[0] : null
      this.form.date_format = this.userData.date_format ? this.optionsTypeFormats.filter(el => el.id === this.userData.date_format)[0] : null
      this.avatar = this.form.avatar
      this.loading.form = false
    },
    resetForm() {
      this.form = {}
      this.setDataProfile()
    },
    uploadToStorage () {
      this.loading.uploading = true
      const storageRef = this.$root.$data.fb.storage().ref(this.$session.get('cas_user').id).put(this.profileFile)
      storageRef.on('state_changed', snapshot => {
        this.uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      }, error => {
        this.loading.uploading = false
      },
      () => { 
        this.uploadValue = 100
        storageRef.snapshot.ref.getDownloadURL().then((url) => {
          this.avatar = url
          this.updatePictureUser(this.$session.get('cas_user').id, url)
        })
      })
    },
    updatePictureUser (id, url) {
      this.loading.uploading = true
      this.$root.$data.accountsCollection.doc(id).update({avatar: url})
        .then(resp => {
          this.$store.dispatch('fetchItemUserData', { element: 'avatar', value: url})
          this.loading.uploading = false
        })
    }
  },
  setup() {
    const refInputEl = ref(null)
    const previewEl = ref(null)

    const { inputImageRenderer } = useInputImageRenderer(refInputEl, previewEl)

    return {
      refInputEl,
      previewEl,
      inputImageRenderer
    }
  }
}
</script>
<style lang="scss">
.overimage{
  position: absolute;
  z-index: 1;
  left: 40px;
  top: 40px;
}
.container-avatar{
  width: 80px;
}
</style>