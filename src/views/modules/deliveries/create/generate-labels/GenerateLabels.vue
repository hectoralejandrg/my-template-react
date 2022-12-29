<template>
  <div class="ticket-list">
      <!-- menu superior -->
    <filter-swapper v-show="!loading.first" :trigger="selectedRows.length === 0" id="labels" :buttons="buttons" :controlHeightButtons="controlHeight">
      <template #slot1>
        <form-render :key="keyFormRender" class="mb-2" :form.sync="form" :fields="fields" @send="filterList" :buttonSend="buttonSend" containerButtonsClass="col-sm-12 col-md-8 col-lg-3 container-button mt-2">
          <template v-slot:buttons>
            <b-dropdown class="ml-2" v-b-tooltip.hover :title="$t('Más opciones')" v-ripple.400="'rgba(113, 102, 240, 0.15)'" variant="light">
              <template #button-content><feather-icon icon="SettingsIcon"/></template>
              <b-dropdown-item @click="cleanForm">{{$t('Limpiar filtros')}}</b-dropdown-item>
              <b-dropdown-item @click="openModal">{{$t('Búsqueda avanzada')}}</b-dropdown-item>
            </b-dropdown>
          </template>
        </form-render>
      </template>
    </filter-swapper>
    <!-- Tabla -->
    <div v-show="!loading.first">
      <table-render id="table-labels" :schema="schema" :rows="rows" :actions="actions"  showCheckboxes="true" :selectedRows.sync="selectedRows" :loading="loading.labels">
        <template #customer="scope">
          <a v-b-tooltip.hover.html="$generateTooltipPerson(scope.rowdata.destination.contact)" class="lnk lnk-primary" >{{scope.rowdata.destination.contact.name}}</a>
        </template>
      </table-render>
      <pagination :pagination="pagination" :noDigits="false" :showSize="true"/>
    </div>
    <!-- loading -->
    <b-skeleton type="input" v-if="loading.first" class="mb-1 mt-1" />
    <div class="table-render-skeleton" v-if="loading.first">
      <b-skeleton-table :rows="pagination.limit || 10" :columns="schema.length || 10" :table-props="{}" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DeliveryService from '../delivery.service'

export default {
  props: ['form', 'openModal', 'cleanForm', 'statusId', 'advancedFilters', 'getDeliveries'],
  data () {
    return {
      buttons: [],
      controlHeight: { class: 'row mb-2 spacing-label-field' },
      dialogOpenExtendedFilter: false,
      fields: [
        // { fieldType: 'FieldDatepicker', label: 'Seleccionar el rango de fechas', name: 'date_range', range: true, containerClass: 'col-sm-12 col-md-3' },
        { fieldType: 'FieldInput', label: 'N° de envío', name: 'order_imported_id', containerClass: 'col-sm-12 col-md-3' },
        { fieldType: 'FieldInput', label: 'Orden de flete', name: 'order_tracking_number', containerClass: 'col-sm-12 col-md-3' }
      ],
      buttonSend: { title: 'Buscar', icon: 'SearchIcon', color: 'warning' },
      schema: [],
      rows: [],
      actions: [],
      labels: [],
      filters: {},
      pagination: {
        page: 1,
        total: 40,
        limit: 10
      },
      keyFormRender: 0,
      loading: {
        first: true,
        labels: false
      },
      myInput: null,
      selectedRows: [],
      showingActions: false,
      deliveryService: new DeliveryService(this)
    }
  },
  computed: {
    ...mapGetters({
      generalLoading: 'getLoading',
      deliveries: 'getDeliveries'
    }),
    permissionList() {
      return this.$store.getters.getRelevantEntities
    }
  },
  mounted () {
    this.schema = [
      {label: 'ID', key: 'id', sortable: true},
      {label: 'Empresa', key: 'shipper_name', sortable: true},
      {label: 'Estado', key: 'status_name', sortable: true, class: ['text-center']},
      {label: 'N° de envío', key: 'imported_id', sortable: true},
      {label: 'Orden de flete', key: 'tracking_number', sortable: true},
      {label: 'Cliente', key: 'customer', sortable: true, useSlot: true},
      {label: 'Place_level3', key: 'replace', sortable: true},
      {label: 'Carrier', key: 'carrier_name', sortable: true, wrap: true},
      {label: 'Fecha creación', key: 'created_at', sortable: true, wrap: true},
      {label: 'Acciones', key: 'actions', class: 'text-center', style: { width: '10%'}}
    ]
    this.addPlacesLevelHeaders()
    this.actions = [
      { action: id => this.toEditDelivery(id), icon: 'FileTextIcon', color: 'info', text: 'Detalle del envío' },
      { action: id => this.confirmDeleteDelivery(id), icon: 'TrashIcon', color: 'danger', text: 'Eliminar envío' }
    ]
    this.buttons = [
      { name: 'delete', text: 'Eliminar', color: 'danger',  icon: 'TrashIcon', action: this.confirmMultipleDeliveries},
      { name: 'generate_labels', text: 'Generar etiquetas', color: 'warning', containerClass: 'ml-1',  icon: 'TagIcon', action: this.confirmGenerateLabels}
    ]
    if (['admin', 'superadmin'].includes(this.$session.get('cas_user').role)) { // this.$ability.can('GET', 'shippers.deliveries')
      this.fields = [{ fieldType: 'FieldSelect',  label: 'Shipper', name: 'shipper', containerClass: 'col-sm-12 col-md-3' }].concat(this.fields)
    }
    this.getDeliveriesByStatusId()
  },
  watch: {
    deliveries () {
      this.rows = [...this.deliveries.rows]
      this.pagination.total = this.deliveries.total
      this.loading.first = false
      this.$bvModal.hide('modalExtendedFilter')
    },
    'advancedFilters': {
      handler (curr, prev) {
        this.filterList(curr)
      },
      deep: true
    },
    'generalLoading': {
      handler () {
        this.loading.labels = !!this.generalLoading.getDeliveries
      },
      deep: true
    },
    'loading': {
      handler () {
        const prevTotal = this.loading.total
        this.loading.total = !Object.keys(this.loading).filter(key => key !== 'total').every(key => !this.loading[key])
        // Que la actualización del componente solo se fuerce cuando esté todo cargado
        if (prevTotal !== this.loading.total) this.keyFormRender++
      },
      deep: true
    },
    'selectedRows' () {
      let boolDelete = true
      let boolGenerateLabel = true
      this.selectedRows.map(currentRow => {
        const resp = this.rows.find(el => el.order.id === currentRow)
        const indexDelete = this.buttons.findIndex(el => el.name === 'delete')
        const indexGenerateLabel = this.buttons.findIndex(el => el.name === 'generate_labels')
        boolDelete = boolDelete && resp.booleanDelete
        boolGenerateLabel = boolGenerateLabel && resp.booleanGenerateLabel
        this.buttons[indexDelete] = {
          ...this.buttons[indexDelete], disabled: !boolDelete, alert: !boolDelete ? 'msg-delete-problem-status' : null
        }
        this.buttons[indexGenerateLabel] = {
          ...this.buttons[indexGenerateLabel], disabled: !boolGenerateLabel, alert: !boolGenerateLabel ? 'msg-generate-label-problem-status' : null
        }
      })
    },
    'pagination.page' () {
      this.getDeliveriesByStatusId()
    },
    'pagination.limit' () {
      this.getDeliveriesByStatusId()
    }
  },
  methods: {
    toEditDelivery (id) {
      const shipper_id = this.rows.filter(el => el.id === id)[0].shipper.id
      this.$router.push({name: 'deliveries-details', params: {id, shipper_id, breadcrumb: { id, shipper_id}}})
    },
    confirmGenerateLabels () {
      this.$yesno(this.$t('Presione "sí" para generar las etiquetas de los envíos seleccionados.'), this.generateLabels)
    },
    generateLabels() {
      this.pagination.labels = true
      const services = this.selectedRows.map(id => {
        const delivery = this.rows.filter(el => el.id === id)[0]
        return { name: 'dispatchDelivery', params: { shipper_id: delivery.shipper.id, delivery_id: id } }
      })
      this.$store.dispatch('fetchMultipleServices', {services, byName: false, onSuccess: this.getDeliveriesByStatusId, showPackSuccess: true, packMsg: 'generar-etiquetas'})
    },
    addPlacesLevelHeaders () {
      const index = this.schema.findIndex(el => el.key === 'replace')
      const newHeaders = []
      const requiredLevels = this.$session.get('cas_user').country.required_levels
      requiredLevels.map(rl => {
        newHeaders.push({label: `Place_level${rl}`, key: `level${rl}`, sortable: true})
      })
      this.schema.splice(index, 1, ...newHeaders)
    },
    filterList (data) {
      this.filters = {}
      Object.keys(data).map(key => {
        switch (key) {
        case 'show_deleted':
          if (data[key] && data[key].length && [0].id === 1) this.filters[key] = true
          break
        default:
          this.filters[key] = data[key].id || data[key]
          break
        }
      })
      if (this.pagination.page !== 1) this.pagination.page = 1
      else this.getDeliveriesByStatusId()
    },
    onChangeTextArea (fieldName, value) {
      const array = value.split(';')
      const lastItem = array.pop().trim()
      array.push(lastItem)
    },
    getDeliveriesByStatusId () {
      this.loading.labels = true
      const queryParams = {
        ...this.filters,
        paginate_by: this.pagination.limit,
        page: this.pagination.page,
        order_status_id: this.statusId
      }
      this.selectedRows = []
      this.getDeliveries(queryParams)
    },
    confirmDeleteDelivery (id) {
      const shipper_id = this.rows.filter(el => el.id === id)[0].shipper.id
      this.$yesno(this.$t('msg-pregunta-eliminar-elemento'), () => this.deleteDelivery(shipper_id, id))
    },
    deleteDelivery (shipper_id, id) {
      this.loading.labels = true
      this.$store.dispatch('fetchService', { name: 'deleteDelivery', params: { id, shipper_id }, onSuccess: this.getDeliveriesByStatusId})
      //   })
    },
    confirmMultipleDeliveries () {
      this.$yesno(this.$t('msg-pregunta-eliminar-seleccionados'), () => this.deleteMultipleDeliveries())
    },
    deleteMultipleDeliveries () {
      this.loading.labels = true
      const services = this.selectedRows.map(id => ({ name: 'deleteDelivery', params: { id, shipper_id: this.rows.filter(el => el.id === id)[0].shipper.id } }))
      this.$store.dispatch('fetchMultipleServices', {services, byName: false, onSuccess: this.getDeliveriesByStatusId, showPackSuccess: true})
    }
  }
}
</script>

<style></style>
