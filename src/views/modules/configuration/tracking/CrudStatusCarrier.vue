<template>
  <div>
    <filter-swapper v-if="!loading" :trigger="selectedRows.length === 0" id="status_carrier_swapper" :buttons="buttons" :controlHeightButtons="controlHeight">
      <template #slot1>
        <form-render :key="keyFormRender" class="mb-2" :fields="fields" :buttonSend="buttonSend" :form.sync="formFilter" @send="filterList"
        containerButtonsClass="col-sm-12 col-md-3 col-lg-6 mt-2">
          <template #buttons>
            <b-button variant="outline-light" v-b-tooltip.hover title="Limpiar filtros" class="ml-2" @click="cleanFilter"><feather-icon icon="RefreshCwIcon"/></b-button>
          </template>
        </form-render>
      </template>
    </filter-swapper>
    <table-render :key="keyTableRender" v-if="!loading" id="table_status_carrier" :rows="rows" :schema="schema" :actions="actions" showCheckboxes="true" :selectedRows.sync="selectedRows" :loading="pagination.loading" stickyHeader="true"/>
    <pagination v-if="!loading" :pagination="pagination" :noDigits="!!pagination.noDigits" :showSize="true" />

    <b-skeleton height="40px" width="100%" class="mt-2 mb-2 spacing-label-field" v-show="loading" />
    <div class="table-render-skeleton" v-show="loading">
      <b-skeleton-table :rows="pagination.limit || 10" :columns="schema.length || 10" :table-props="{}" />
    </div>
    <modal-status-carrier ref="modalStatusCarrier" :status.sync="statusCarrier" @send="saveStatusCarrier" :carriers="[...carriers]"></modal-status-carrier>
  </div>
</template>
<script>
import ModalStatusCarrier from './ModalStatusCarrier.vue'
import TrackingService from './tracking.service'

export default {
  name: 'crud-status-carrier',
  components: { ModalStatusCarrier },
  props: ['carriers'],
  data() {
    return {
      buttons: [],
      controlHeight: { class: 'row mb-2 spacing-label-field' },
      selectedRows: [],
      schema: [],
      actions: [],
      rows: [],
      pagination: { page: 1, limit: 20, total: 100, loading: false },
      modalName: 'modalStatusCarrier',
      statusCarrier: {},
      buttonSend: { icon: 'SearchIcon', color: 'warning', title: 'Filtrar' },
      fields: [],
      formFilter: {},
      payloadFilter: {},
      loading: true,
      keyTableRender: 0,
      keyFormRender: 0,
      trackingService: new TrackingService(this)
    }
  },
  watch: {
    'pagination.page' () {
      this.getAllCarrierStatuses()
    },
    'pagination.limit' () {
      this.getAllCarrierStatuses()
    },
    carriers() {
      this.fields[1].options = this.carriers
      this.keyFormRender++
    }
  },
  mounted() {
    this.setInitialData()
    this.buttons = [{ name: 'delete', text: 'Eliminar', color: 'danger', icon: 'TrashIcon', action: this.confirmMultipleStatusCarrier }]
  },
  methods: {
    setInitialData () {
      this.schema = [
        { label: 'Id', sortable: true, key: 'id' },
        { label: 'Carrier', sortable: true, key: 'carrier_name' },
        { label: 'Código', sortable: true, key: 'code' },
        { label: 'Acciones', key: 'actions', class: ['text-center'] }
      ]
      this.actions = [
        { action: id => this.openStatusCarrier(id), icon: 'Edit2Icon', color: 'primary', text: 'Editar', needPermission: 'edit'},
        { action: id => this.confirmStatusCarrier(id), icon: 'TrashIcon', color: 'danger', text: 'Eliminar', needPermission: 'delete'}
      ]
      this.fields = [
        { fieldType: 'FieldInput', name: 'code', label: 'Código' },
        { fieldType: 'FieldSelect', name: 'carrier', label: 'Carrier' }
      ]
      this.getAllCarrierStatuses()
    },
    filterList (form) {
      this.payloadFilter = {}
      if (form.carrier && form.carrier.code) this.payloadFilter.carrier = form.carrier.code
      if (!!form.code) this.payloadFilter.code = form.code
      if (this.pagination.page !== 1) this.pagination.page = 1
      else this.getAllCarrierStatuses()
    },
    cleanFilter () {
      this.formFilter = {}
      this.keyFormRender++
      this.filterList(this.formFilter)
    },
    openStatusCarrier (_id) {
      this.statusCarrier = this.rows.filter(({ id }) => id === _id)[0]
      this.$bvModal.show('modalStatusCarrier')
    },
    saveStatusCarrier (data) {
      const service = !!data.id ? 'updateCarrierStatus' : 'saveCarrierStatus'
      const params = !!data.id ? { id: data.id } : null
      this.trackingService
        .callService(service, data.form, params)
        .then(response => {
          this.$bvModal.hide('modalStatusCarrier')
          this.statusCarrier = {}
          this.getAllCarrierStatuses()
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-guardar', {code: err}))
          this.$refs.modalStatusCarrier.loading = false
          // this.statusCarrier = data.original
        })
    },
    getAllCarrierStatuses () {
      this.pagination.loading = true
      this.selectedRows = []
      const queryParams = {
        page: this.pagination.page,
        limit: this.pagination.limit,
        ...this.payloadFilter
      }
      this.trackingService
        .callService('getAllCarrierStatuses', queryParams)
        .then(response => {
          this.setDataStatusCarrier(response)
        })
        .catch(err => {
          console.error(err)
        })
        .finally(end => {
          this.pagination.loading = false
          this.loading = false
        })
    },
    setDataStatusCarrier (data) {
      this.rows = []
      this.pagination.total = data.total_registers
      this.rows = data.data
    },
    confirmStatusCarrier (_id) {
      this.$yesno(this.$t('msg-pregunta-eliminar-elemento'), () => this.deleteCarrierStatus(_id))
    },
    deleteCarrierStatus (id) {
      this.pagination.loading = true
      this.trackingService
        .callService('deleteCarrierStatus', null, { id })
        .then(response => {
          if (this.rows.length === 1 && this.pagination.page > 1) this.pagination.page--
          this.getAllCarrierStatuses()
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-eliminar-elemento'))
        })
    },
    confirmMultipleStatusCarrier () {
      this.$yesno(this.$t('msg-pregunta-eliminar-seleccionados'), this.deleteMultipleCarrierStatus)
    },
    deleteMultipleCarrierStatus () {
      this.pagination.loading = true
      const services = this.selectedRows.map(id => ({ name: 'deleteCarrierStatus', params: { id } }))
      this.trackingService
        .callMultipleServices(services)
        .then(response => {
          if (this.rows.length === this.selectedRows.length && this.pagination.page > 1) this.pagination.page--
          this.getAllCarrierStatuses()
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-eliminar-seleccionados'))
        })
    }
  }
}
</script>
<style lang="scss"></style>
