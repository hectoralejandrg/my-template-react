<template>
  <b-modal
    id="modalCarrierRequest"
    :title="$t(`${editing ? 'Editar' : 'Nueva'} solicitud`)"
    :ok-title="$t('Guardar')"
    ok-variant="warning"
    modal-class="dialog-900"
    ok-only
    no-close-on-esc
    no-close-on-backdrop
    centered
    @ok="ok"
  >
    <form-render
      :fields.sync="fields"
      :form.sync="request"
      @send="onAccept"
      ref="formRenderRequest"
      containerButtonsClass="col-sm-12 col-lg-4 container-button"
    >
      <template #space />
    </form-render>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'modal-carrier-request',
  props: ['formTab'],
  data() {
    return {
      request: {},
      editing: false,
      fields: [],
      optionsMethod: [{id :'post', text: 'Post'}, {id:'put', text:'Put'}, {id:'delete', text:'Delete'}, {id:'get', text: 'Get'}],
      optionsTypeRequest: [{id:'Auntenticacion', text: 'Auntenticacion'}, {id: 'cdl', text: 'CDL'}, {id: 'ddl', text: 'DDL'}, {id:'rdl', text:'RDL'}]
    }
  },
  computed: {
    ...mapGetters({
      serviceCarriers: 'getServiceCarriers',
      carrier: 'getCarrier'
    })
  },
  watch: {
    formTab() {
      this.request = {
        ...this.formTab,
        use_data_definition: this.formTab.use_data_definition ? [{ id: 1, text: 'Marcar uso de definicion de datos' }] : [],
        carrier_id: this.carrier.carrier_name
      }
      const currentService = this.serviceCarriers.rows.find(value => value.id === this.formTab.carrier_service_id)
      this.request.carrier_service_id = {
        id: currentService.id,
        text: currentService.name
      }
      this.editing = !!this.formTab.id

      const index = this.fields.findIndex(el => el.name === 'carrier_service_id')
      const serviceOpt = this.serviceCarriers.rows.map(value => ({ id: value.id, text: value.name }))
      if (index !== -1) this.fields[index].options = serviceOpt
      const indexMethod = this.fields.findIndex(el => el.name === 'method')
      if (indexMethod !== -1) this.fields[indexMethod].options = this.optionsMethod
      const indexRequest = this.fields.findIndex(el => el.name === 'type_request')
      if (indexRequest !== -1) this.fields[indexRequest].options = this.optionsTypeRequest
    },
    editing() {
      if (!this.editing) this.request = {}
    }
  },
  mounted() {
    this.setInitialData()
  },
  methods: {
    setInitialData() {
      this.fields = [
        { fieldType: 'FieldSelect', name: 'carrier_service_id', label: 'Servicio por carrier', containerClass: 'col-sm-12 container-info col-md-6' },
        { fieldType: 'FieldSelect', name: 'type_request', label: 'Tipo de solicitud', containerClass: 'col-sm-12 container-info col-md-6' },
        { name: 'space', useSlot: true, containerClass: 'col-sm-12 container-info pt-1 border-top mt-1' },
        { fieldType: 'FieldInput', name: 'url', label: 'Url', containerClass: 'col-md-6 container-info col-sm-12', validation: 'required'},
        { fieldType: 'FieldInput', name: 'url_proxy', label: 'Url del Proxy', containerClass: 'col-md-6 container-info col-sm-12' },
        { fieldType: 'FieldSelect', name: 'method', label: 'Metodo de solicitud', containerClass: 'col-md-6 container-info col-sm-12' },
        { fieldType: 'FieldTextarea', name: 'expiration', label: 'Tiempo de expiracion', containerClass: 'col-md-6 container-info col-sm-12' },
        { fieldType: 'FieldTextarea', name: 'model', label: 'Modelo', containerClass: 'col-md-6 container-info col-sm-12' },
        { fieldType: 'FieldTextarea', name: 'headers', label: 'Cabeceras', containerClass: 'col-md-6 container-info col-sm-12' },
        {
          fieldType: 'FieldCheckbox', multiple: true, name: 'use_data_definition', label: 'Esta solicitud usa definicion de datos', options: [
            { id: 1, text: 'Marcar uso de definicion de datos' }
          ], containerClass: 'col-sm-12 col-md-8 container-info pt-2'
        },
        { fieldType: 'FieldTextarea', name: 'global_replacement', label: 'Remplazos globales', containerClass: 'col-md-6 container-info col-sm-12' },
        { fieldType: 'FieldTextarea', name: 'data_definition', label: 'Definicion de datos', containerClass: 'col-md-6 container-info col-sm-12'},
        { fieldType: 'FieldTextarea', name: 'data_mapping', label: 'Mapeo de datos', containerClass: 'col-md-6 container-info col-sm-12' }
      ]
    },
    onAccept(form) {
      const { carrier_service_id, use_data_definition, type_request, method,  ...rest } = form
      const newForm = {
        carrier_service_id: carrier_service_id.id,
        carrier_id: this.$route.params.id,
        use_data_definition: !!use_data_definition?.length,
        type_request: type_request.id,
        method: method.id, ...rest }
      if (this.editing) {
        this.updateConfigurationRequest(newForm)
      } else {
        this.saveConfigurationsRequest(newForm)
      }
    },
    ok(e) {
      e.preventDefault()
      this.$refs.formRenderRequest.checkForm()
    },
    updateConfigurationRequest(data) {
      const queryParams = { ...data }
      const params = { request_id: this.request.id }
      this.$store.dispatch('fetchService', { name: 'updateCarrierConfigurationsRequest', queryParams, params, onSuccess: this.successUpdateConfigurationsRequest })
    },
    successUpdateConfigurationsRequest() {
      const queryParams = { carrier_id: this.$route.params.id }
      this.$store.dispatch('fetchService', { name: 'getCarrierConfigurationsRequest', queryParams })
      this.$bvModal.hide('modalCarrierRequest')
      this.$success(this.$t('msg-exito-actualizar'))
    },
    saveConfigurationsRequest(data) {
      const queryParams = { ...data }
      console.log(queryParams)
      this.$store.dispatch('fetchService', { name: 'createCarrierConfigurationsRequest', queryParams, onSuccess: this.successSaveConfigurationsRequest })
    },
    successSaveConfigurationsRequest() {
      const queryParams = { carrier_id: this.$route.params.id }
      this.$store.dispatch('fetchService', { name: 'getCarrierConfigurationsRequest', queryParams })
      this.$bvModal.hide('modalCarrierRequest')
      this.$success(this.$t('msg-exito-guardar'))
    }
  }
}
</script>
<style>
</style>
