<template>
  <div class="deliveries-list">
    <b-card>
      <filter-swapper v-show="!loading.first" :trigger="selectedRows.length === 0" :buttons="[...buttons]" :controlHeightButtons="controlHeight">
        <template #slot1>
          <form-render :key="keyFormRender" :form.sync="form" :fields="fields" @send="filterList" :buttonSend="buttonSend" ref="formFilter"
            containerButtonsClass="col-sm-12 col-md-7 col-lg-2 container-button mt-2" class="mb-2">
            <template v-slot:buttons>
              <b-dropdown class="ml-2" v-b-tooltip.hover :title="$t('Más opciones')" v-ripple.400="'rgba(113, 102, 240, 0.15)'" variant="light"> 
                <template #button-content><feather-icon icon="SettingsIcon"/></template>
                <b-dropdown-item @click="cleanForm">{{$t('Limpiar filtros')}}</b-dropdown-item>
                <b-dropdown-item v-b-modal.modalExtendedFilter>{{$t('Búsqueda avanzada')}}</b-dropdown-item>
              </b-dropdown>
            </template>
          </form-render>
        </template>
      </filter-swapper>
      <div v-show="!loading.first">
        <table-render id="table-deliveries" :schema="schema" :rows="rows" :actions="actions" :showCheckboxes="true" :selectedRows.sync="selectedRows" :loading="loading.deliveries">
          <template #customer="scope">
            <a v-b-tooltip.hover.html="$generateTooltipPerson(scope.rowdata.destination.contact)" class="lnk lnk-primary" >{{scope.rowdata.destination.contact.name}}</a>
          </template>
        </table-render>
        <pagination :pagination="pagination" :noDigits="false" :showSize="true"/>
      </div>
      <b-skeleton type="input" v-if="loading.first" class="mb-2 mt-2 spacing-label-field"/>
      <div class="table-render-skeleton" v-if="loading.first">
        <b-skeleton-table
          :rows="pagination.limit || 10"
          :columns="schema.length || 10"
          :table-props="{ }"/>
      </div>
    </b-card>
    <modal-extended-filter :form.sync="form" @result="collectFullFilter"></modal-extended-filter>
    <modal-new-ticket :delivery.sync="currentDelivery"/>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import ModalExtendedFilter from '../ModalExtendedFilter'
import ModalNewTicket from './ModalNewTicket'
import ticket_status from '@/const-data/tickets/ticket_status'
import delivery_status from '@/const-data/tickets/delivery_status'
import DeliveriesListService from './deliveriesList.service.js'

export default {
  components: {ModalExtendedFilter, ModalNewTicket},
  data () {
    return {
      buttons: [],
      controlHeight: { class: 'row mb-2 spacing-label-field'},
      dialogOpenExtendedFilter: false,
      fields: [
        { fieldType: 'FieldInput', label: 'N° de envío', name: 'order_imported_id', containerClass: 'col-sm-12 col-md-2' },
        { fieldType: 'FieldInput', label: 'Orden de flete', name: 'order_tracking_number', containerClass: 'col-sm-12 col-md-2' }
      ],
      buttonSend: {title: 'Buscar', icon: 'SearchIcon', color: 'warning'},
      schema: [],
      rows: [],
      actions: [],
      tickets: [],
      deliveryStatus: [],
      allSubjects: [],
      form: {},
      filters: {},
      pagination: {
        page: 1,
        total: 40,
        limit: 10
      },
      keyFormRender: 0,
      keyFS: 0,
      loading: {
        initial: true,
        first: true,
        organizations: true,
        carriers: true,
        deliveryStatuses: true,
        deliveryTypes: true,
        deliveries: false
      },
      myInput: null,
      selectedRows: [],
      showingActions: false,
      deliveriesListService: new DeliveriesListService(this),
      currentDelivery: {},
      listCarriers: [],
      listDeliveryTypes: [],
      deleteStatus: true
    }
  },
  computed: {
    ...mapGetters({
      organizations: 'getOrganizationsGlobal',
      generalLoading: 'getLoading',
      shippers: 'getShippersByOrganization',
      deliveries: 'getDeliveries' 
    }),
    permissionList() {
      return this.$store.getters.getRelevantEntities
    }
  },
  mounted () {
    console.log(this.$i18nImport('cl'))
    if (this.permissionList) { //Para cuando se cambia de pantalla
      this.initialLoad('mounted')
    }
  },
  watch: {
    deliveries () {
      this.rows = [...this.deliveries.rows]
      this.pagination.total = this.deliveries.total
      this.loading.first = false
      this.$bvModal.hide('modalExtendedFilter')
    },
    shippers () {
      this.setSelectOptions('shipper_id', { options: this.shippers })
    },
    'generalLoading': {
      handler () {
        this.loading.organizations = !!this.generalLoading.getOrganizationsGlobal
        this.loading.deliveries = !!this.generalLoading.getDeliveries
        this.loading.carriers = !!this.generalLoading.getCarriers
        this.loading.deliveryStatuses = !!this.generalLoading.getDeliveryStatuses
        this.loading.deliveryTypes = !!this.generalLoading.getDeliveryTypes
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

    organizations () { 
      this.setSelectOptions('organization', { options: this.organizations })
    },
    
    permissionList () { //Para cuando se actualiza la pagina y carga antes que la generacion de permisos
      this.initialLoad('watch permissions')
    },
    'pagination.page' () {
      this.getDeliveries()
    },
    'pagination.limit' () {
      this.getDeliveries()
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
    }
  },
  methods: {
    canGenerateLabels (resp) {
      return !resp?.order?.status || ![1, 4].includes(resp.order.status.status_id)
    },
    canDelete (resp) {
      return !resp?.order?.status || ![1, 4, 5, 12].includes(resp.order.status.status_id)
    },
    setSelectOptions (name, { options }) {
      const index = this.fields.findIndex(el => el.name === name)
      if (index !== -1) {
        this.fields[index].options = options
        this.keyFormRender++
      }
      this.form[name] = null
    },
    initialLoad (ori) {
      if (this.loading.initial) {
        this.loading.initial = false
        this.setInitialData(ori)
        this.getDeliveries()
      }
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
    setInitialData (ori) {
      this.buttons = [
        { name: 'delete', text: 'Eliminar', color: 'danger',  icon: 'TrashIcon', action: this.confirmMultipleDeliveries},
        { name: 'generate_labels', text: 'Generar etiquetas', color: 'warning', containerClass: 'ml-1',  icon: 'TagIcon', action: this.confirmGenerateLabels}
      ]
      this.schema = [
        {label: 'Empresa', key: 'shipper_name', sortable: true},
        {label: 'Estado', key: 'status_name', sortable: true, class: ['text-center']},
        {label: 'N° de envío', key: 'imported_id', sortable: true},
        {label: 'Orden de flete', key: 'tracking_number', sortable: true},
        {label: 'Cliente', key: 'customer', sortable: true, useSlot: true},
        {key: 'replace'},
        {label: 'Carrier', key: 'carrier_name', sortable: true, wrap: true},
        {label: 'Fecha creación', key: 'created_at', sortable: true, wrap: true},
        {label: 'Fecha compromiso', key: 'deadline_date', sortable: true, wrap: true},
        {label: 'Acciones', key: 'actions', class: 'text-center', style: { width: '10%'}}
      ]
      this.addPlacesLevelHeaders()
      this.actions = [
        {action: id => this.toEditDelivery(id), icon: 'FileTextIcon', color: 'info', text: 'Detalle del envío'}, // this.$router.push({name: 'deliveries-details', params: {id, breadcrumb: { id }}})
        // {action: id => this.loadDetail(id), icon: 'FileTextIcon', color: 'info', text: 'Detalle del envío'},
        {action: id => this.openModalNewTicket(id), icon: 'FilePlusIcon', color: 'warning', text: 'Abrir ticket', dependency: 'booleanNewTicket'},
        {action: id => this.confirmDeleteDelivery(id), icon: 'TrashIcon', color: 'danger', text: 'Eliminar envío', dependency: 'booleanDelete'}
        // {action: id => console.log('mensaje', id), switchOwnId:'not_readed2', dualState: {on: 'Marcar como leído', off: 'Marcar como no leído', iconOn: 'BookIcon', iconOff: 'BookOpenIcon'}},
        // {action: id => console.log('mensaje', id), icon: 'MessageCircleIcon', color:'warning', text: 'Responder ticket'},
        // {action: id => console.log('mensaje', id), icon: 'TruckIcon', color:'info', text: 'Mensaje rápido al carrier'}
      ]
      // this.buttons = [
      //   { name: 'delete', text: 'Eliminar', color: 'danger',  icon: 'TrashIcon', action: () => this.confirmMultipleStatusCarrier()}
      // ]
      if (['admin', 'superadmin'].includes(this.$session.get('cas_user').role)) {
        this.fields = [{ fieldType: 'FieldSelect',  label: 'Shipper', name: 'shipper_id', dependency: 'organization', containerClass: 'col-sm-12 col-md-2' }].concat(this.fields)
        this.fields = [{ fieldType: 'FieldSelect',  label: 'Organización', name: 'organization', containerClass: 'col-sm-12 col-md-2', change: this.changeOrganization }].concat(this.fields)
      } else {
        this.fields = [{ fieldType: 'FieldSelect',  label: 'Shipper', name: 'shipper_id', containerClass: 'col-sm-12 col-md-3' }].concat(this.fields)
      }
      console.log('claro')
      if (this.organizations && !!this.organizations.length) {
        this.setSelectOptions('organization', { options: this.organizations })
      }
      
    },
    collectFullFilter (fullForm) {
      this.form = fullForm
      console.log(fullForm)
      this.filters = {}
      Object.keys(fullForm).map(key => {
        switch (key) {
        case 'show_deleted':
          if (fullForm[key] && fullForm[key].length && fullForm[key][0].id === 1) this.filters[key] = true
          break
        default:
          this.filters[key] = fullForm[key].id || fullForm[key]
          break
        }
      })
      if (this.pagination.page !== 1) this.pagination.page = 1
      else this.getDeliveries()
    },
    filterList (data) {
      this.filters = {}
      Object.keys(data).map(key => {
        this.filters[key] = data[key].id || data[key]
      })
      if (this.pagination.page !== 1) this.pagination.page = 1
      else this.getDeliveries()
    },
    cleanForm (e) {
      this.form = {}
      this.getDeliveries()
    },
    openModalNewTicket (_id) {
      this.currentDelivery = this.rows.filter(el => el.id === _id)[0]
      this.currentDelivery.order.status.status_code = 'NOT_DELIVERED'
      // this.currentDelivery = {id: 9, order: {status: {date: '2021-09-09 00:00:00', code: 'NOT_DELIVERED'}}}
      this.$bvModal.show('modalNewTicket')
    },
    changeOrganization (name, value) {
      if (!value || !value.id) return null
      this.form.shipper_id = 'Cargando...'
      this.setShippers(value)
    },
    setShippers (value) {
      const queryParams = { paginate_by: 9999, page: 1 }
      const params = { organization_id: value.id }
      const index = this.fields.findIndex(el => el.name === 'shipper_id')
      this.$store.dispatch('fetchService', {name: 'getShippersByOrganization', queryParams, params})
    },
    getDeliveries () {
      this.loading.deliveries = true
      const queryParams = {
        ...this.filters,
        paginate_by: this.pagination.limit,
        page: this.pagination.page
      }
      this.selectedRows = []
      // delete queryParams.shipper
      if (['admin', 'superadmin'].includes(this.$session.get('cas_user').role)) {
        this.$store.dispatch('fetchService', {name: 'getAdminDeliveries', queryParams, id: 'getDeliveries'})

      } else if (this.$session.get('cas_user').role === 'marketplace') {
        if (this.loading.first) {
          this.$store.dispatch('fetchService', {name: 'getShippers', queryParams: { paginate_by: 9999, page: 1  }, id: 'getShippers'}) // getShippersByMarketPlace
        }
        this.$store.dispatch('fetchService', {name: 'getDeliveries', queryParams, params: {shipper_id: this.$session.get('cas_user').shipper.id}}) // getDeliveriesByMarketPlace

      } else if (this.$session.get('cas_user').role === 'company' || this.$session.get('cas_user').role === 'seller' || this.$session.get('cas_user').role === 'pudo') {
        this.$store.dispatch('fetchService', {name: 'getDeliveries', queryParams, params: {shipper_id: this.$session.get('cas_user').shipper.id}})

      } else {
        this.$alert(this.$t('msg-error-permission'))
        return null
      }
    },
    toEditDelivery (id) {
      const shipper_id = this.rows.filter(el => el.id === id)[0].shipper.id
      this.$router.push({name: 'deliveries-details', params: {id, shipper_id, breadcrumb: { id, shipper_id}}})
    },
    confirmGenerateLabels () {
      this.$yesno(this.$t('Presione "sí" para generar las etiquetas de los envíos seleccionados.'), this.generateLabels)
    },
    generateLabels () {
      this.pagination.labels = true
      const services = this.selectedRows.map(id => {
        const delivery = this.rows.filter(el => el.id === id)[0]
        return { name: 'dispatchDelivery', params: { shipper_id: delivery.shipper.id, delivery_id: id } }
      })
      this.$store.dispatch('fetchMultipleServices', {services, byName: false, onSuccess: this.getDeliveries, showPackSuccess: true, packMsg: 'generar-etiquetas'})
    },
    confirmDeleteDelivery (id) {
      const shipper_id = this.rows.filter(el => el.id === id)[0].shipper.id
      this.$yesno(this.$t('msg-pregunta-eliminar-elemento'), () => this.deleteDelivery(shipper_id, id))
    },
    deleteDelivery (shipper_id, id) {
      this.loading.tickets = true
      this.$store.dispatch('fetchService', { name: 'deleteDelivery', params: { id, shipper_id }, onSuccess: this.getDeliveries})
    },
    confirmMultipleDeliveries () {
      this.$yesno(this.$t('msg-pregunta-eliminar-seleccionados'), () => this.deleteMultipleDeliveries())
    },
    deleteMultipleDeliveries () {
      this.loading.tickets = true
      const services = this.selectedRows.map(id => ({ name: 'deleteDelivery', params: { id, shipper_id: this.rows.filter(el => el.id === id)[0].shipper.id } }))
      
      this.$store.dispatch('fetchMultipleServices', {services, byName: false, onSuccess: this.getDeliveries, showPackSuccess: true})
    }
  }
}
</script>

<style>
</style>
