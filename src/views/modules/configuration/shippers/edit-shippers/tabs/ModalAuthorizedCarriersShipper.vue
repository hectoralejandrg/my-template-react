<template>
<b-modal
    id="modalAuthorizedCarrierShipper"
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
        :key="formRenderAuthorizedCarrierShipper"
        :form.sync="form"
        @send="onAccept"
        ref="formRenderAuthorizedCarrierShipper"
        containerButtonsClass="col-sm-12 col-md-3 container-button"
      >
      </form-render>
</b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
export default {

  name: 'modal-authorized-carriers-shipper',
  props: ['formTab'],
  data() {
    return {
      form: {},
      editing: false,
      fields: [],
      formRenderAuthorizedCarrierShipper: 0
    }
  },
  computed: {
    ...mapGetters({
      carriers: 'getCarriers',
      serviceCarriers: 'getServiceCarriers'
    })
  },
  watch: {
    formTab() {
      this.editing = !!this.formTab.id
      this.form = { 
        ...this.formTab,
        carrier_id : { id : this.formTab.carrier.id, text : this.formTab.carrier.name},
        service_name :this.formTab.services.map(service => ({id: service.id, text : service.name}))
      }
      console.log(this.form)
    },
    editing() {
      if (!this.editing) {
        this.form = {}
      }
    },
    carriers() {
      const carriersIndex = this.fields.findIndex(el => el.name === 'carrier_id')
      this.fields[carriersIndex].options = this.carriers.rows.map(el => ({id : el.id, text : el.name}))
      this.formRenderAuthorizedCarrierShipper++
    },
    serviceCarriers() {
      const serviceCarriersIndex = this.fields.findIndex(el => el.name === 'service_name')
      this.fields[serviceCarriersIndex].options = this.serviceCarriers.rows.map(el => ({id : el.id, text : el.name}))
      this.formRenderAuthorizedCarrierShipper++
    }
  },
  mounted() {
    this.setInitialData()
  },
  methods: {
    setInitialData() {
      this.fields = [
        { fieldType: 'FieldSelect', name: 'carrier_id', label: 'Autorizar Carrier', containerClass: 'col-sm-12 container-info col-md-6', validation: 'required' },
        { fieldType: 'FieldSelect', name: 'service_name', label: 'Habilidar Servicios', containerClass: 'col-sm-12 container-info col-md-6', validation: 'required', multiple: true }
      ]
    },
    onAccept(form) {
      const {carrier_id,  service_name, ...rest} = form
      const newData = { carrier_id : carrier_id.id, shipper_id : this.$route.params.id * 1}
      if (this.editing) {
        this.updateAuthorizedCarriers(newData, service_name)
      } else {
        this.saveAuthorizedCarriers(newData, service_name)
      }
    },
    ok(e) {
      e.preventDefault()
      this.$refs.formRenderAuthorizedCarrierShipper.checkForm()
    },
    updateAuthorizedCarriers(data) {
      const queryParams = { ...data}
      this.$store.dispatch('fetchService', { name: 'updateAuthorizedCarriersOrganization', queryParams, params: { id: this.form.id }, onSuccess: this.successUpdateAuthorizedCarriers })
    },
    successUpdateAuthorizedCarriers() {
      this.$store.dispatch('fetchService', { name: 'getAuthorizedCarriersOrganizations' })
      this.$bvModal.hide('modalAuthorizedCarrier')
      this.$success(this.$t('msg-exito-actualizar'))
    },
    saveAuthorizedCarriers(data, service_name) {
      const queryParams = { ...data }

      const newData = { 
        carrier_service_id : service_name.map(value => value.id),
        carrier_shipper_id : this.$route.params.id * 1
      }

      this.$store.dispatch('fetchService', { name: 'createAuthorizedCarriersShipper', queryParams, onSuccess: this.successSaveAuthorizedCarriers(newData) })
    },

    successSaveAuthorizedCarriers(queryParams) {
      this.$store.dispatch('fetchService', { name: 'createAuthorizedCarriersShipperServices', queryParams, onSuccess: this.successSaveAuthorizedCarriersServices })
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
