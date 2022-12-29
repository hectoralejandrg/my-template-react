<template>
  <div>
    <filter-swapper v-show="!loading" :trigger="selectedRows.length === 0" id="translation_swapper" :buttons="buttons" :controlHeightButtons="controlHeight">
      <template #slot1>
        <form-render :key="keyFormRender" class="mb-2" :fields="fields" :buttonSend="buttonSend" :form.sync="formFilter" @send="filterList"
          containerButtonsClass="col-sm-12 col-md-3 mt-2 container-button">
          <template #buttons>
            <b-button variant="outline-light" v-b-tooltip.hover title="Limpiar filtros" class="ml-2" @click="cleanFilter"><feather-icon icon="RefreshCwIcon"/></b-button>  
          </template>
        </form-render>
      </template>
    </filter-swapper>
    <table-render v-show="!loading" id="table_translation" :rows="rows" :schema="schema" :actions="actions" showCheckboxes="true"
      :selectedRows.sync="selectedRows" :loading="pagination.loading" stickyHeader="true">
      <template v-for="currentSlot in booleanList" #[currentSlot]="scope">
        <feather-icon v-if="scope.rowdata[currentSlot]" :key="currentSlot" icon="CheckCircleIcon" class="text-success"/>
        <feather-icon v-if="!scope.rowdata[currentSlot]" :key="currentSlot" icon="XCircleIcon" class="text-danger"/>
      </template>
      </table-render>
    <pagination v-show="!loading" :pagination="pagination" :noDigits="!!pagination.noDigits" :showSize="true"/>
    
    <b-skeleton height="40px" width="100%" class="mt-2 mb-2 spacing-label-field" v-show="loading"/>
    <div class="table-render-skeleton" v-show="loading">
      <b-skeleton-table
        :rows="pagination.limit || 10"
        :columns="schema.length || 10"
        :table-props="{ }"/>
    </div>
    <modal-translation ref="modalTranslation" :status.sync="currentTranslation" @send="saveTranslation" :carriers="[...carriers]"></modal-translation>
  </div>
</template>
<script>
import ModalTranslation from './ModalTranslation.vue'
import TrackingService from './tracking.service'

export default {
  name: 'crud-status-carrier',
  components: { ModalTranslation },
  props: ['carriers'],
  data () {
    return {
      buttons: [],
      controlHeight: { class: 'row mb-2 spacing-label-field' },
      selectedRows: [],
      schema: [],
      actions: [],
      rows: [],
      pagination: { page: 1, limit: 20, total: 100, loading: false },
      modalName: 'modalTranslation',
      currentTranslation: {},
      buttonSend: {icon: 'SearchIcon', color: 'warning', title: 'Filtrar'},
      fields: [],
      formFilter: {},
      payloadFilter: {},
      loading: true,
      optionsRelation: [{id: 'all', text: 'Todos'}, {id: 'no-relation', text: 'Sin traducción'}, {id: 'relation', text: 'Con traducción'}],
      keyFormRender: 0,
      trackingService: new TrackingService(this),
      booleanList: ['delivery_type']
    }
  },
  watch: {
    'pagination.page' () {
      this.getAllTranslations()
    },
    'pagination.limit' () {
      this.getAllTranslations()
    },
    carriers () {
      this.fields[2].options = this.carriers
      this.keyFormRender++
    }
  },
  mounted () {
    this.buttons = [
      { name: 'delete', text: 'Eliminar', color: 'danger',  icon: 'TrashIcon', action: this.confirmMultipleTranslation}
    ]
    this.setInitialData()
    this.getAllTranslations()
    this.getAllDeliveryStatusesByEnviame()
  },
  methods: {
    setInitialData () {
      this.schema = [
        {label: 'Id', sortable: true, key: 'id'},
        {label: 'Carrier', sortable: true, key: 'carrier_name'},
        {label: 'Estado carrier', sortable: true, key: 'delivery_carrier_status_code'},
        {label: 'Estado Envíame', sortable: true, key: 'delivery_status_name'},
        {label: 'Observación', sortable: true, key: 'observations'},
        {label: 'Tipo devolución', sortable: true, useSlot: true, key: 'delivery_type', class: ['text-center']},
        {label: 'Condición', sortable: true, key: 'condition'},
        {label: 'Acciones', key: 'actions', class: ['text-center']}
      ]
      this.actions = [
        {action: id => this.openTranslation(id), icon: 'Edit2Icon', color: 'primary', text: 'Editar', needPermission: 'edit'},
        {action: id => this.confirmTranslation(id), icon: 'TrashIcon', color:'danger', text: 'Eliminar', needPermission: 'delete'}
      ]

      this.fields = [
        {fieldType: 'FieldSelect', name: 'status_translation', label: 'Estado traducción', containerClass: 'col-sm-12 col-md-2', options: this.optionsRelation, clearable: false},
        {fieldType: 'FieldSelect', name: 'status_enviame', label: 'Estado de envíame', containerClass: 'col-sm-12 col-md-2'},
        {fieldType: 'FieldSelect', name: 'carrier', label: 'Carrier', containerClass: 'col-sm-12 col-md-2', change: this.getAllCarrierStatusesByCarrier},
        {fieldType: 'FieldSelect', name: 'status_carrier', label: 'Estado carrier', containerClass: 'col-sm-12 col-md-2', dependency: 'carrier'}
      ]
      this.formFilter.status_translation = this.optionsRelation.filter(opt => opt.id === 'all')[0]
      this.keyFormRender++
    },
    filterList (form) {
      this.payloadFilter = {}
      if (form.carrier && form.carrier.code) this.payloadFilter.carrier = form.carrier.code
      if (form.status_translation.id !== 'all') this.payloadFilter.translated = form.status_translation.id === 'relation'
      if (form.status_carrier && form.status_carrier.code) {
        this.payloadFilter.status = form.status_carrier.id
        this.payloadFilter.carrier_status_id = form.status_carrier.id
      }
      // if (this.pagination.page !== 1) this.pagination.page = 1
      // else this.getAllTranslations()
      if (form.status_enviame)  this.payloadFilter.delivery_status_id = form.status_enviame.id
      this.pagination.page = 1
      this.getAllTranslations()
    },
    cleanFilter () {
      this.formFilter = {}
      this.formFilter.status_translation = this.optionsRelation.filter(opt => opt.id === 'all')[0]
      this.keyFormRender++
      this.filterList(this.formFilter)
    },
    openTranslation (_id) {
      this.currentTranslation = this.rows.filter(({id}) => id === _id)[0]
      this.$bvModal.show('modalTranslation')
    },
    saveTranslation (data) {
      const service = !!data.id ? 'updateTranslation' : 'saveTranslation'
      const params = !!data.id ? { id: data.id } : null
      this.trackingService.callService(service, data.form, params)
        .then(response => {
          this.$bvModal.hide('modalTranslation')
          this.currentTranslation = {}
          this.getAllTranslations()
        })
        .catch(err => {
          this.$alert(this.$t('msg-problema-cargar-datos', {code: err}))
          console.error(err)
          this.$refs.modalTranslation.loading = false
        })
    },
    getAllCarrierStatusesByCarrier (name, value) {
      // this.setLoading('status_carrier', true)
      this.fields[3].options = []
      this.formFilter.status_carrier = null
      if (value && value.code) {
        this.trackingService.callService('getAllCarrierStatuses', {carrier: value.code, limit: 9999})
          .then(response => {
            if (response.data && response.data.length > 0) {
              this.fields[3].options = response.data.map(status => ({...status, text: status.code || JSON.stringify(status.customization) || '[Sin código]'}))
            } else {
              // this.$alert('El carrier seleccionado no tiene estados asociados')
            }
            this.keyFormRender++
          })
          .catch(err => {
            this.$alert(this.$t('msg-problema-cargar-datos', {code: err}))
          })
          .finally(end => {
            // this.setLoading('status_carrier', false)
          })
      } else {
        this.formFilter.status_carrier = null
      }
    },
    getAllDeliveryStatusesByEnviame () {
      this.fields[1].options = []
      this.formFilter.status_enviame = null
      // const queryParams = {
      //   page: 1,
      //   limit: 99999,
      //   ...this.payloadFilter
      // }
      this.trackingService.callService('getAllDeliveryStatuses')
        .then(response => {
          if (response.data && response.data.length > 0) {
            this.fields[1].options = response.data.map(status => ({...status, text: status.name || '[Sin código]'}))
          }
          this.keyFormRender++
        })
        .catch(err => {
          this.$alert('Ocurrió un problema al cargar los estados de enviame seleccionado.')
        })
    },
    getAllTranslations () {
      this.pagination.loading = true
      this.selectedRows = []
      const queryParams = {
        page: this.pagination.page,
        limit: this.pagination.limit,
        ...this.payloadFilter
      }
      this.trackingService.callService('getAllTranslations', queryParams)
        .then(response => {
          this.setDataTranslation(response)
        })
        .catch(err => {
          this.$alert(this.$t('msg-problema-cargar-datos', {code: err}))
          console.error(err)
        })
        .finally(end => {
          this.pagination.loading = false
          this.loading = false
        })
    },
    setDataTranslation (data) {
      this.rows = []
      this.pagination.total = data.total_registers
      this.rows = data.data.map(el => {
        return {
          ...el,
          condition: el.json_aditional ? `${el.json_aditional.one || ''} ${el.json_aditional.operator.symbol} ${el.json_aditional.two || ''}` : ''
        }
      })
    },
    confirmTranslation (_id) {
      this.$yesno(this.$t('msg-pregunta-eliminar-elemento'), () => this.deleteTranslation(_id))
    },
    deleteTranslation (id) {
      this.pagination.loading = true
      this.trackingService.callService('deleteTranslation', null, {id})
        .then(response => {
          if (this.rows.length === 1 && this.pagination.page > 1) this.pagination.page--
          this.getAllTranslations()
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-eliminar-elemento'))
        })
    },
    confirmMultipleTranslation () {
      this.$yesno(this.$t('msg-pregunta-eliminar-seleccionados'), this.deleteMultipleTranslation)
    },
    deleteMultipleTranslation () {
      this.pagination.loading = true
      const services = this.selectedRows.map(id => ({name: 'deleteTranslation', params: {id}}))
      this.trackingService.callMultipleServices(services)
        .then(response => {
          if (this.rows.length === this.selectedRows.length && this.pagination.page > 1) this.pagination.page--
          this.getAllTranslations()
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-eliminar-seleccionados'))
        })
    }
  }
}
</script>
<style lang='scss'>
  
</style>