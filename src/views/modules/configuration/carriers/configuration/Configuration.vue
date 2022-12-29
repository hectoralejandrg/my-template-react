<template>
  <div>
    <div class="mt-2">
      <form-render
        class="mb-2"
        :fields="fields"
        :key="formRenderConfiguration"
        :form.sync="form"
        @send="updateOrSaveCarrierConfiguration"
        :buttonSend="buttonSend"
        ref="formRenderConfiguration"
        :disableAll="loanding.request"
        containerButtonsClass="col-sm-12 pt-2"
      >
        <template #space />
        <template #authInput>
          <div v-show="authShow" class="container-info">
            <label title="Usuario" class="label-form"
              ><span>Usuario</span></label
            >
            <field-input
              class="container-info"
              :value.sync="auth_header_username"
              name="auth_header_username"
              placeholder="Usuario"
            />
            <label title="Clave" class="label-form"><span>Clave</span></label>
            <field-input
              class="container-info"
              :value.sync="auth_header_password"
              name="auth_header_password"
              placeholder="Clave"
              required="true"
            />
          </div>
        </template>
        <template #useWh>
          <div v-show="whShow">
            <label title="WebHook" class="label-form"
              ><span>Api Key</span></label
            >
            <field-input
              class="container-info"
              :value.sync="wh_api_key"
              name="wh_api_key"
              placeholder="WebHook api key"
              required="true"
            />
            <label title="Bucket" class="label-form"><span>Clave</span></label>
            <field-input
              class="container-info"
              :value.sync="wh_bucket_name"
              name="wh_bucket_name"
              placeholder="Bucket"
              required="true"
            />
          </div>
        </template>
      </form-render>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'configuration',
  data() {
    return {
      form: {},
      authShow: false,
      fields: [],
      whShow: false,
      auth_header_password: '',
      auth_header_username: '',
      wh_api_key: '',
      wh_bucket_name: '',
      loanding: { request: true},
      formRenderConfiguration: 0,
      webhookCheck: [{ id: 1, text: 'Utiliza Webhook' }],
      buttonSend: { color: 'warning', icon: 'SaveIcon', text: 'Guardar' },
      authOption: [{ id: 1, text: 'oauth2' }, { id: 2, text: 'credentials' }],
      carrier_id : this.$route.params.id
    }
  },
  computed: {
    ...mapGetters({
      carrierConfigurations: 'getCarrierConfigurations'
    })
  },
  mounted() {
    this.setInitialData()
  },
  watch: {
    carrierConfigurations() {
      this.setCarrierConfigurations()
    }
  },
  methods: {
    setInitialData() {
      this.fields = [
        { fieldType: 'FieldSelect', name: 'authentication_type', label: 'Tipo de autenticacion', containerClass: 'col-sm-12 container-info col-md-3', options: this.authOption, change: this.changeAuthOption },
        { name: 'authInput', useSlot: true },
        { name: 'space', useSlot: true, containerClass: 'col-sm-12 container-info pt-1 border-top mt-1' },
        { fieldType: 'FieldCheckbox', multiple: true, name: 'use_wh', label: 'El carrier utilizará Webhook', containerClass: 'col-sm-12 container-info col-md-3', options: [{ id: 1, text: 'Utiliza Webhook' }], change: this.changeWebhookCheck },
        { name: 'useWh', useSlot: true },
        { name: 'space', useSlot: true, containerClass: 'col-sm-12 container-info pt-1 border-top mt-1' },
        { fieldType: 'FieldInput', name: 'db_name', label: 'Base de datos', containerClass: 'col-sm-12 container-info col-md-3', validation: 'required'},
        { fieldType: 'FieldInput', name: 'db_prefix_dev', label: 'Prefijo entorno desarrollo', containerClass: 'col-sm-12 container-info col-md-3', validation: 'required' },
        { fieldType: 'FieldInput', name: 'db_prefix_prd', label: 'Prefijo entorno productivo', containerClass: 'col-sm-12 container-info col-md-3', validation: 'required' },
        { name: 'space', useSlot: true, containerClass: 'col-sm-12 container-info pt-1 border-top mt-1' },
        { fieldType: 'FieldInput', name: 'bucket_prefix_dev', label: 'Prefijo bucket desarrollo', containerClass: 'col-sm-12 container-info col-md-3', validation: 'required' },
        { fieldType: 'FieldInput', name: 'bucket_prefix_prd', label: 'Prefijo bucket productivo', containerClass: 'col-sm-12 container-info col-md-3', validation: 'required'},
        { fieldType: 'FieldInput', name: 'bucket_gcs_carrier_deliveries', label: 'Bucket envío', containerClass: 'col-sm-12 container-info col-md-3', validation: 'required' },
        { fieldType: 'FieldInput', name: 'bucket_gcs_carrier_documents', label: 'Bucket documentos', containerClass: 'col-sm-12 container-info col-md-3', validation: 'required' },
        { fieldType: 'FieldInput', name: 'bucket_gcs_carrier_errors', label: 'Bucket errores', containerClass: 'col-sm-12 container-info col-md-3', validation: 'required' }
      ]

      this.getCarrierConfiguration()
    },
    getCarrierConfiguration() {
      this.loanding.request = false
      this.form = {}
      this.$store.dispatch('fetchService', { name: 'getCarrierConfigurations', queryParams: { carrier_id: this.carrier_id} })
    },
    setCarrierConfigurations() {
      this.form = {
        ...this.carrierConfigurations[0],
        use_wh: this.carrierConfigurations[0].use_wh ? [{ id: 1, text: 'Utiliza Webhook' }] : []
      }
      this.auth_header_username = this.form.auth_header_username
      this.auth_header_password = this.form.auth_header_password
      this.wh_bucket_name = this.form.wh_bucket_name
      this.wh_api_key = this.form.wh_api_key

      this.changeWebhookCheck(null, this.form.use_wh)
      this.changeAuthOption(this.form.authentication_type, null)
      this.loanding.request = false
    },
    updateConfiguration(data) {
      const queryParams = { ...data }
      console.log(queryParams)
      this.$store.dispatch('fetchService', { name: 'updateCarrierConfigurations', queryParams, params: { configuration_id: this.form.id }, onSuccess: this.successUpdateConfigurations })
    },
    successUpdateConfigurations() {
      this.$store.dispatch('fetchService', { name: 'getCarrierConfigurations' })
      this.buttonSend.icon = 'SaveIcon'
      this.buttonSend.iconClass = ''
      this.buttonSend.disabled = false
      this.$success(this.$t('msg-exito-actualizar'))
    },
    saveConfiguration(data) {
      const queryParams = { ...data }
      this.$store.dispatch('fetchService', { name: 'createCarrierConfigurations', queryParams, onSuccess: this.successSaveConfiguration })
    },
    successSaveConfiguration() {
      this.$store.dispatch('fetchService', { name: 'getCarrierConfigurations' })
      this.buttonSend.icon = 'SaveIcon'
      this.buttonSend.iconClass = ''
      this.buttonSend.disabled = true
      this.$success(this.$t('msg-exito-guardar'))
    },
    changeAuthOption(name, value) {
      if (name === 'oauth2' || value.id === 1) {
        this.authShow = true
      } else {
        this.authShow = false
      }
    },
    changeWebhookCheck(name, value) {
      if (value.length > 0) { this.whShow = true } else { this.whShow = false }
    },
    sendForm(e) {
      e.preventDefault()
      this.$refs.formRenderConfiguration.checkForm()
    },
    updateOrSaveCarrierConfiguration(data) {
      this.buttonSend.icon = 'LoaderIcon'
      this.buttonSend.iconClass = 'SaveIcon'
      this.buttonSend.disabled = true
      const { authentication_type, use_wh, ...rest } = data
      const newData = {
        ...rest,
        carrier_id: this.carrier_id,
        authentication_type: authentication_type.text,
        use_wh: (use_wh.length > 0) ? !false : false
      }

      if (this.authShow) {
        newData.auth_header_username = this.auth_header_username
        newData.auth_header_password = this.auth_header_password
      }

      if (this.whShow) {
        newData.wh_api_key = this.wh_api_key
        newData.wh_bucket_name = this.wh_bucket_name
      }
      if (this.form.id) {
        this.updateConfiguration(newData)
      } else { this.saveConfiguration(newData) }
    }
  }
}
</script>

<style>
</style>
