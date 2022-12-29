<template>
  <div>
    <div class="mt-2" >
      <form-render class="mb-2" :fields="fields" :key="keyFormRender" :form.sync="formFilter" :buttonSend="buttonSend" @send="filterList" ref="formRender"
      containerButtonsClass="col-sm-12 col-md-7 col-lg-3 container-button mt-2">
        <template #buttons>
          <b-button variant="outline-light" v-b-tooltip.hover :title="$t('Limpiar filtros')" class="ml-2" @click="cleanFilter"><feather-icon icon="RefreshCwIcon"/></b-button>  
        </template>
      </form-render>
      <p>Para retiros dentro del mismo día, se debe realizar antes del <b><a class="lnk lnk-warning" @click="() => openModalScheduleCarrier()"> horario de corte </a></b> de cada carrier *</p>  
    </div>
    <div class="mt-2 mb-2">
      <table-render v-show="!loading" :key="keyTableRender" id="pickups" :rows="rows" :schema="schema" :actions="actions" :loading="pagination.loading">
        <template #status="scope">
          <b-badge :variant="`light-${scope.rowdata.class_status}`" pill>{{scope.rowdata.status}}</b-badge>
        </template>
      </table-render>
    </div>
    <!-- Proximamente TABLA DE RETIROS SUGERIDOS -->
    <pagination :pagination="pagination" :noDigits="true"/>
    <modal-pickups :carriers.sync="carriers" :pickup.sync="currentPickup" :getPickups="getPickups"></modal-pickups>
    <modal-schedule-carriers></modal-schedule-carriers>
    <modal-evaluate-pickup ref="modalEvaluatePickup" :currentPickup.sync="currentPickup" @send="saveEvaluatePickup"></modal-evaluate-pickup>
  </div>
</template>

<script>
import DeliveryService from '../delivery.service'
import CreatePickupsService from './createPickups.service'
import ModalPickups from './create/ModalPickups.vue'
import ModalScheduleCarriers from './create/ModalScheduleCarriers.vue'
import ModalEvaluatePickup from './create/ModalEvaluatePickup.vue'

export default {

  components: { ModalPickups, ModalScheduleCarriers, ModalEvaluatePickup },
  name: 'create-pickups',
  props: ['carriers'],

  data () {
    return {
      fields: [],
      formFilter: {},
      payloadFilter: {},
      buttonSend: { icon: 'SearchIcon', color: 'warning', title: 'Filtrar' },
      keyFormRender: 0,
      keyTableRender: 0,
      schema: [],
      actions: [],
      rows: [],
      currentPickup: {},
      optionsPickupsStatus: [
        { id: 1, text: 'Creado', value: 'CREATED'},
        { id: 2, text: 'Agendado', value: 'SCHEDULED'},
        { id: 3, text: 'Efectuado', value: 'DONE'},
        { id: 4, text: 'No efectuado', value: 'FAILED'},
        { id: 5, text: 'Sugerido', value: 'SUGGESTED'}
      ],
      pagination: { page: 1, limit: 10, total: 20, loading: false },
      loading: true,
      deliveryService: new DeliveryService(this),
      createPickupsService: new CreatePickupsService(this)
    }
  },

  watch: {
    'pagination.page' () {
      this.getPickups()

    },
    'pagination.limit' () {
      this.getPickups()
    },
    carriers () {
      const index = this.fields.findIndex(field => field.name === 'carrier')
      this.fields[index].options = this.carriers
      this.keyFormRender++
    }
  },

  mounted () {
    this.setInitialData()
  },

  methods: {
    setInitialData () {

      this.fields = [
        { fieldType: 'FieldSelect', name: 'shipper_id', label: 'Empresa', containerClass: 'col-sm-12 container-info col-md-2'},
        { fieldType: 'FieldSelect', name: 'carrier', label: 'Carrier', containerClass: 'col-sm-12 container-info col-md-2'},
        { fieldType: 'FieldDatepicker', label: 'Fecha de búsqueda', name: 'find_date', range: true, clearable: true, propsVCalendar: { 'disabled-dates': { weekdays: [1, 7] } }},
        { fieldType: 'FieldSelect', name: 'status', label: 'Estado de retiro', containerClass: 'col-sm-12 container-info col-md-2', options: this.optionsPickupsStatus}
      ]

      if (!['admin', 'superadmin'].includes(this.$session.get('cas_user').role)) {
        this.fields.splice(0, 1)
        this.keyFormRender++
      }

      this.schema = [
        {label: 'Comercio', sortable: true, key: 'shipper_name'},
        {label: 'Fecha de retiro', sortable: true, key: 'pickup_date'},
        {label: 'Horario de retiro', sortable: true, key: 'range_time'},
        {label: 'Envíos', sortable: true, key: 'quantity'},
        {label: 'Dirección', sortable: true, key: 'address'},
        {label: 'Place_level3', sortable: true, key: 'place'},
        {label: 'Carrier', sortable: true, key: 'carrier'},
        // {label: 'Contacto', sortable: true, key: 'contact'},
        // {label: 'Fono contacto', sortable: true, key: 'phone'},
        {label: 'Estado', sortable: true, key: 'status', useSlot: true},
        {label: 'Acciones', key: 'actions', class: 'text-center', style: { width: '10%'}}
      ]

      this.actions = [
        {action: id => this.openModalEvaluatePickup(id), icon: 'AlertOctagonIcon', color:'warning', text: 'Evaluar retiro', iconClass: 'icon-pulse-warning', dependency: 'evaluate'}
        //  ACCION PARA AGENDAR RETIRO SUGERIDO  {action: id => this.openModalPickups(id), icon: 'Edit2Icon', color:'info', text: 'Editar retiro'}
      ]

      this.getPickups()
      this.getShippers()
    },

    getShippers (value) {
      this.deliveryService.callService('getShippers', {paginate_by: 9999, page: 1 })
        .then(resp => {
          this.fields[0].options = resp.data.map(el => ({...el, text: `${el.id} - ${el.name1}`}))
          this.keyFormRender++
        })
    },

    getPickups () {
      this.pagination.loading = true
      const payload = { limit: this.pagination.limit, page: this.pagination.page, type: 'normal' }
      if (this.formFilter.carrier) payload.carrier = this.formFilter.carrier.code
      if (this.formFilter.status) payload.status = this.formFilter.status.value
      if (this.formFilter.shipper_id) payload.shipper_id = this.formFilter.shipper_id.id
      if (this.formFilter.find_date) {
        payload.pickup_date_from = this.$options.filters.moment(this.formFilter.find_date.start, 'DD-MM-YYYY')
        payload.pickup_date_to = this.$options.filters.moment(this.formFilter.find_date.end, 'DD-MM-YYYY')
      }
      if (this.formFilter.shipper_id) payload.shipper_id = this.formFilter.shipper_id.id
      if (this.$session.get('cas_user').shipper && this.$session.get('cas_user').shipper.id) {
        const service = (['admin', 'superadmin'].includes(this.$session.get('cas_user').role)) ? 'getPickupsAdmin' : 'getPickups'
        const params = {shipper_id: this.$session.get('cas_user').shipper.id}
        this.createPickupsService.callService(service, payload, params)
          .then(resp => {
            this.rows = []
            this.setPickupRows(resp.data)
          })
          .catch(err => {
            console.error(err)
            this.$alert('Ocurrio un problema al cargar los retiros')
          })
          .finally(end => {
            this.pagination.loading = false
            this.loading = false
          })
      } else {
        return this.$alert('Este usuario no tiene compañía asignada')
      }
    },

    saveEvaluatePickup (data) {
      const params = { 
        shipper_id: this.currentPickup.company_id,
        id: this.currentPickup.id
      }
      this.createPickupsService.callService('saveEvaluatePickup', data, params)
        .then(resp => {
          this.currentPickup = {}
          this.$bvModal.hide('modalEvaluatePickup')
          this.getPickups()
        })
        .catch(err => {
          console.error(err)
          this.$alert('Ocurrio un problema al evaluar el retiro')
        })
    },

    setPickupRows (data) {
      this.rows = data.map(el => {
        switch (el.status) {
        case 'retiro agendado':
          return {
            ...el,
            id: el.identifier, 
            class_status: 'light'  
          }
        case 'efectuado':
          return {
            ...el,
            id: el.identifier, 
            class_status: 'success'  
          }
        case 'no efectuado':
          return {
            ...el,
            id: el.identifier, 
            class_status: 'danger'  
          }
        default:
          return {
            ...el,
            id: el.identifier, 
            class_status: 'secondary'  
          }
        }
      })
    },

    filterList () {
      if (this.pagination.page !== 1) this.pagination.page = 1
      else this.getPickups()
    },

    cleanFilter () {
      this.formFilter = {}
      this.keyFormRender++
      this.getPickups()
    },
    
    openModalScheduleCarrier () {
      this.$bvModal.show('modalScheduleCarriers')
    },

    openModalEvaluatePickup (_id) {
      this.currentPickup = this.rows.filter(({id}) => id === _id)[0]
      this.$bvModal.show('modalEvaluatePickup')
    }
  
  }
}
</script>

<style>

</style>
