<template>
<b-modal
    id="modalAuthorizedCarrier"
    :title="$t(`${editing ? 'Editar' : 'Nuevo'} Carrier Autorizado`)"
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
        class="mb-2"
        :fields="fields"
        :key="formRenderAuthorizedCarrier"
        :form.sync="form"
        @send="onAccept"
        ref="formRenderAuthorizedCarrier"
        containerButtonsClass="col-sm-12 col-md-3 container-button"
      >
        <template #space />
      </form-render>
</b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
export default {

  name: 'edit-authorization-organizations',
  props: ['formTab'],
  data() {
    return {
      form: {},
      editing: false,
      fields: [],
      formRenderAuthorizedCarrier: 0
    }
  },
  computed: {
    ...mapGetters({
      carriers: 'getCarriers',
      serviceCarriers: 'getServiceCarriers',
      contractType : 'getContractType'
    })
  },
  watch: {
    formTab() {
      this.editing = !!this.formTab.id
      this.form = {
        ...this.formTab,
        carrier_id : { id : this.formTab.carrier.id, text : this.formTab.carrier.name},
        service_name :this.formTab.services.map(service => ({id: service.id, text : service.name})),
        contract_type_id : {id : this.formTab.contract_type.id, text : this.formTab.contract_type.name}
      }
    },
    editing() {
      if (!this.editing) {
        this.form = {}
      }
    },
    carriers() {
      const carriersIndex = this.fields.findIndex(el => el.name === 'carrier_id')
      this.fields[carriersIndex].options = this.carriers.rows.map(el => ({id : el.id, text : el.name}))
      this.formRenderAuthorizedCarrier++
    },
    serviceCarriers() {
      const serviceCarriersIndex = this.fields.findIndex(el => el.name === 'service_name')
      this.fields[serviceCarriersIndex].options = this.serviceCarriers.rows.map(el => ({id : el.id, text : el.name}))
      this.formRenderAuthorizedCarrier++
    },
    contractType() {
      const contractTypeIndex = this.fields.findIndex(el => el.name === 'contract_type_id')
      this.fields[contractTypeIndex].options = this.contractType
      this.formRenderAuthorizedCarrier++
    }

  },
  mounted() {
    this.setInitialData()
  },
  methods: {
    setInitialData() {
      this.fields = [
        { fieldType: 'FieldSelect', name: 'carrier_id', label: 'Autorizar Carrier', containerClass: 'col-sm-12 container-info col-md-6', validation: 'required' },
        { fieldType: 'FieldSelect', name: 'service_name', label: 'Habilidar Servicios', containerClass: 'col-sm-12 container-info col-md-6', validation: 'required', multiple: true },
        { fieldType: 'FieldSelect', name: 'contract_type_id', label: 'Tipo de contrato', containerClass: 'col-sm-12 container-info col-md-6', validation: 'required' }
      ]
    },
    onAccept(form) {
      const {carrier_id, contract_type_id, service_name, ...rest} = form
      const newData = {
        carrier_id: carrier_id.id,
        contract_type_id:
        contract_type_id.id,
        organization_id: this.$route.params.id * 1
      }
      if (this.editing) {
        this.updateAuthorizedCarriers(newData, service_name)
      } else {
        this.saveAuthorizedCarriers(newData, service_name)
      }
    },
    ok(e) {
      e.preventDefault()
      this.$refs.formRenderAuthorizedCarrier.checkForm()
    },
    updateAuthorizedCarriers(data) {
      const queryParams = { ...data}
      const params = { id: this.form.id }
      this.$store.dispatch('fetchService', { name: 'updateAuthorizedCarriersOrganization', queryParams, params, onSuccess: this.successUpdateAuthorizedCarriers })
    },
    successUpdateAuthorizedCarriers() {
      this.$store.dispatch('fetchService', { name: 'getAuthorizedCarriersOrganizations' })
      this.$bvModal.hide('modalAuthorizedCarrier')
      this.$success(this.$t('msg-exito-actualizar'))
    },
    saveAuthorizedCarriers(data, service_name) {
      const queryParams = { ...data }
      const newData = {
        carrier_service_id: service_name.map(value => value.id),
        carrier_organization_id: this.$route.params.id * 1
      }
      this.$store.dispatch('fetchService', { name: 'createAuthorizedCarriersOrganization', queryParams, onSuccess: this.successSaveAuthorizedCarriers(newData) })
    },
    successSaveAuthorizedCarriers(queryParams) {
      this.$store.dispatch('fetchService', { name: 'createAuthorizedCarriersOrganizationServices', queryParams, onSuccess: this.successSaveAuthorizedCarriersServices })
    },
    successSaveAuthorizedCarriersServices() {
      this.$store.dispatch('fetchService', { name: 'getAuthorizedCarriersOrganizations' })
      this.$bvModal.hide('modalAuthorizedCarrier')
      this.$success(this.$t('msg-exito-guardar')) }
  }
}
</script>

<style>
</style>
