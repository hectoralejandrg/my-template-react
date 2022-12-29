<template>
  <div>
    <div v-show="!loading.first">
      <table-render
        id="table-request"
        :schema="schema"
        :rows="rows"
        :actions="actions"
        :selectedRows.sync="selectedRows"
        :loading="loading.request"
      >
      </table-render>
    </div>
    <b-skeleton type="input" v-if="loading.first" class="mb-1 mt-1" />
    <div class="table-render-skeleton" v-if="loading.first">
      <b-skeleton-table
        :rows="pagination.limit || 10"
        :columns="schema.length || 10"
        :table-props="{}"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'carrier-request',
  props: ['formTab', 'openModal'],
  data() {
    return {
      form: {},
      buttons: [],
      carrier_id: null,
      controlHeight: { class: 'row mb-2 spacing-label-field' },
      dialogOpenExtendedFilter: false,
      fields: [],
      buttonSend: { title: 'Buscar', icon: 'SearchIcon', color: 'warning' },
      schema: [],
      rows: [],
      actions: [],
      request: [],
      pagination: {
        page: 1,
        total: 40,
        limit: 10
      },
      loading: {
        first: false,
        request: false
      },
      selectedRows: []
    }
  },
  computed: {
    ...mapGetters({
      serviceCarriers: 'getServiceCarriers',
      carrier: 'getCarrier',
      carrierConfigurationsRequest: 'getCarrierConfigurationsRequest'
    })
  },
  watch: {
    carrierConfigurationsRequest() {
      this.setCarrierConfigurationsRequest()
    }
  },

  mounted() {
    this.setInitialData()

  },
  methods: {
    setInitialData() {
      this.schema = [
        { label: 'Carrier', sortable: true, key: 'carrier_name' },
        { label: 'Servicio', sortable: true, key: 'service_name' },
        { label: 'Tipo de solicitud', sortable: true, key: 'type_request' },
        { label: 'Metodo de solicitud', sortable: true, key: 'method' },
        { label: 'Definicion de Datos', key: 'isDefault', class: ['text-center'] },
        { label: 'Acciones', key: 'actions', class: ['text-center'] }
      ]
      this.buttons = [
        { name: 'delete', text: 'Eliminar', color: 'danger', icon: 'TrashIcon', action: this.confirmDeleteMultipleCarrierConfigurationsRequest }
      ]
      this.actions = [
        { action: id => this.openUpdateModal(id), icon: 'Edit2Icon', color: 'success', text: 'Editar' },
        { action: id => this.confirmDeleteCarrierConfigurationsRequest(id), icon: 'TrashIcon', color: 'danger', text: 'Eliminar' }
      ]
      this.carrier_id = this.$route.params.id
      this.getCarrierConfigurationsRequest()
    },
    getCarrierConfigurationsRequest() {
      this.selectedRows = []
      this.$store.dispatch('fetchService', { name: 'getCarrierConfigurationsRequest', queryParams: { carrier_id: this.carrier_id } })
      this.loading.request = true
      this.loading.first = true
    },
    setCarrierConfigurationsRequest() {
      const requestCurrentCarrier = this.carrierConfigurationsRequest.filter(config => config.carrier.id === this.$route.params.id).map(configCurrent => {
        const isDefault = `<i class='fa fa-${configCurrent.use_data_definition ? 'check-circle text-success' : 'times-circle text-danger'}'></i>`
        const serviceCurrent = this.serviceCarriers?.rows.find(value => value.id === configCurrent.carrier_service_id)
        return { ...configCurrent, carrier_name: this.carrier.name, isDefault, service_name: serviceCurrent?.name }
      })
      this.rows = requestCurrentCarrier
      this.selectedRows = []
      this.loading.first = false
      this.loading.request = false

    },
    openUpdateModal(_id) {
      this.openModal(this.rows.filter(({ id }) => id === _id)[0])
    },
    confirmDeleteCarrierConfigurationsRequest(_id) {
      this.$yesno(this.$t('msg-pregunta-eliminar-seleccionados'), () => this.deleteCarrierConfigurationsRequest(_id))
    },
    deleteCarrierConfigurationsRequest(id) {
      this.$store.dispatch('fetchService', { name: 'deleteCarrierConfigurationsRequest', params: { request_id: id }, onSuccess: this.successDeleteCarrierConfigurationsRequest })
    },
    successDeleteCarrierConfigurationsRequest() {
      this.getCarrierConfigurationsRequest()
      this.$success(this.$t('msg-exito-eliminar-elemento'))
    },
    confirmDeleteMultipleCarrierConfigurationsRequest() {
      this.$yesno(this.$t('msg-pregunta-eliminar-seleccionados'), this.deleteMultipleCarrierConfigurationsRequest)
    },
    deleteMultipleCarrierConfigurationsRequest() {
      const services = this.selectedRows.map(id => ({ name: 'deleteCarrierConfigurationsRequest', params: { request_id: id } }))
      this.$store.dispatch('fetchMultipleServices', { services, showPackSuccess: true, onSuccess: this.successDeleteMultipleCarrierConfigurationsRequest })
    },
    successDeleteMultipleCarrierConfigurationsRequest() {
      this.getCarrierConfigurationsRequest()
      this.$success(this.$t('msg-exito-eliminar-multiple'))
    }
  }
}
</script>

<style lang='scss'>
.services-button {
  top: -3.5rem !important;
  right: 0rem !important;
  position: absolute !important;
  z-index: 9;
}
</style>
