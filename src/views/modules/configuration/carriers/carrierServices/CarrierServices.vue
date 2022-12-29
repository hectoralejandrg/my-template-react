<template>
  <div>
    <div v-show="!loading.first">
      <table-render
        id="table-services"
        :schema="schema"
        :rows="rows"
        :actions="actions"
        :loading="loading.services"
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
  name: 'carrier-services',
  props: ['formTab', 'openModal'],
  data() {
    return {
      form: {},
      buttons: [],
      controlHeight: { class: 'row mb-2 spacing-label-field' },
      dialogOpenExtendedFilter: false,
      fields: [],
      buttonSend: { title: 'Buscar', icon: 'SearchIcon', color: 'warning' },
      schema: [],
      rows: [],
      actions: [],
      services: [],
      filters: {},
      pagination: {
        page: 1,
        total: 40,
        limit: 10
      },
      keyFormRender: 0,
      loading: {
        first: false,
        services: false
      },
      myInput: null,
      selectedRows: [],
      showingActions: false,
      carrier_id : this.$route.params.id
    }
  },
  computed: {
    ...mapGetters({
      serviceCarriers: 'getServiceCarriers',
      carrier: 'getCarrier'
    })
  },
  mounted() {
    this.setInitialData()

  },
  watch: {
    serviceCarriers() {
      this.setServiceRows()
    },
    carrier() {
      this.$store.dispatch('fetchService', { name: 'getServicesCarrier', queryParams: { carrier_id: this.carrier_id } })
    }
  },
  methods: {
    setInitialData() {
      this.schema = [
        { label: 'Nombre del Servicio', sortable: true, key: 'name' },
        { label: 'Codigo del Servicio', sortable: true, key: 'code' },
        { label: 'Servicio por defecto', key: 'isDefault', class: ['text-center'] },
        { label: 'Acciones', key: 'actions', class: ['text-center'] }
      ]
      this.buttons = [
        { name: 'delete', text: 'Eliminar', color: 'danger', icon: 'TrashIcon', action: this.confirmDeleteMultipleUser }
      ]
      this.actions = [
        { action: id => this.openUpdateModal(id), icon: 'Edit2Icon', color: 'success', text: 'Editar' },
        { action: id => this.confirmDeleteService(id), icon: 'TrashIcon', color: 'danger', text: 'Eliminar' }
      ]
      this.getServices()
    },
    getServices() {
      this.selectedRows = []
      this.loading.services = true
      this.loading.first = true
      this.$store.dispatch('fetchService', { name: 'getServiceType' })
      this.$store.dispatch('fetchService', { name: 'getServicesCarrier', queryParams: { carrier_id: this.carrier_id } })
    },
    setServiceRows() {
      const serviceCurrentCarrier = this.serviceCarriers.rows.map(serviceCurrent => {
        const isDefault = `<i class='fa fa-${serviceCurrent.is_default ? 'check-circle text-success' : 'times-circle text-danger'}'></i>`
        return { ...serviceCurrent, carrier_name: this.carrier.name, carrier_code: this.carrier.code, isDefault }
      })
      this.rows = serviceCurrentCarrier
      this.selectedRows = []
      this.loading.first = false
      this.loading.services = false

    },
    openUpdateModal(_id) {
      this.openModal(this.rows.filter(({ id }) => id === _id)[0])
    },
    confirmDeleteService(_id) {
      this.$yesno(this.$t('msg-pregunta-eliminar-seleccionados'), () => this.deleteService(_id))
    },
    deleteService(id) {
      this.$store.dispatch('fetchService', { name: 'deleteServiceCarrier', params: { carrier_service_id: id }, onSuccess: this.successDeleteService })
    },
    successDeleteService() {
      this.getServices()
      this.$success(this.$t('msg-exito-eliminar-elemento'))
    },
    confirmDeleteMultipleCarriers() {
      this.$yesno(this.$t('msg-pregunta-eliminar-seleccionados'), this.deleteMultipleService)
    },
    deleteMultipleService() {
      const services = this.selectedRows.map(id => ({ name: 'deleteServiceCarrier', params: { carrier_service_id: id } }))
      this.$store.dispatch('fetchMultipleServices', { services, showPackSuccess: true, onSuccess: this.successDeleteMultipleServices })
    },
    successDeleteMultipleServices() {
      this.getServices()
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
