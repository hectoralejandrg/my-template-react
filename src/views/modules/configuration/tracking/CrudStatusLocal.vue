<template>
  <div>
    <filter-swapper v-show="!loading" :trigger="selectedRows.length === 0" id="status_local_swapper" :buttons="buttons" :controlHeightButtons="controlHeight">
      <template #slot1>
        <form-render :key="keyFormRender" :fields="fields" class="mb-2" :buttonSend="buttonSend" :form.sync="formFilter" @send="filterList"
          containerButtonsClass="col-sm-12 col-md-3 mt-2 container-button">
          <template #buttons>
            <b-button variant="outline-light" v-b-tooltip.hover title="Limpiar filtros" class="ml-2" @click="cleanFilter"><feather-icon icon="RefreshCwIcon"/></b-button>
          </template>
        </form-render>
      </template>
    </filter-swapper>
    <table-render v-show="!loading" id="table_status_local" :rows.sync="rows" :schema="schema" :actions="actions" showCheckboxes="true"
      :selectedRows.sync="selectedRows" :loading="pagination.loading" stickyHeader="true">
      <template v-for="currentSlot in booleanList" #[currentSlot]="scope">
        <feather-icon v-if="scope.rowdata[currentSlot]" :key="currentSlot" icon="CheckCircleIcon" class="text-success"/>
        <div v-if="!scope.rowdata[currentSlot]" :key="currentSlot" style="vertical-align: middle; color: #c2c2c2;"> - </div>
        <!-- <feather-icon v-if="!scope.rowdata[currentSlot]" :key="currentSlot" icon="XCircleIcon" /> -->
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
    <modal-status-local ref="modalStatusLocal" :status.sync="statusLocal" @send="saveStatusLocal"></modal-status-local>
  </div>
</template>
<script>
import ModalStatusLocal from './ModalStatusLocal.vue'
import TrackingService from './tracking.service'
import { mapGetters } from 'vuex'
export default {
  name: 'crud-status-local',
  components: { ModalStatusLocal },
  data () {
    return {
      buttons: [],
      controlHeight: { class: 'row mb-2 spacing-label-field' },
      selectedRows: [],
      schema: [],
      actions: [],
      rows: [],
      pagination: { page: 1, limit: 20, total: 100, loading: false },
      modalName: 'modalStatusLocal',
      statusLocal: {},
      buttonSend: {icon: 'SearchIcon', color: 'warning', title: 'Filtrar'},
      fields: [],
      formFilter: {},
      payloadFilter: {},
      loading: true,
      keyFormRender: 0,
      trackingService: new TrackingService(this),
      booleanList: ['default', 'home', 'pudo', 'in_carrier', 'terminal', 'visible', 'trouble']
    }
  },
  watch: {
    'pagination.page' () {
      this.getAllDeliveryStatuses()
    },
    'pagination.limit' () {
      this.getAllDeliveryStatuses()
    }
  },
  computed: {
    ...mapGetters({
      modularPermissions: 'getModularPermissions'
    })
  },
  mounted () {
    this.buttons = [
      { name: 'delete', text: 'Eliminar', color: 'danger',  icon: 'TrashIcon', action: this.confirmMultipleStatusLocal}
    ]
    this.setInitialData()
    this.getAllDeliveryStatuses()
  },
  methods: {
    setInitialData () {
      this.schema = [
        {label: 'Id', sortable: true, key: 'id'},
        {label: 'Código', sortable: true, key: 'code'},
        {label: 'Acción de flujo', sortable: true, key: 'flow_action'},
        // {label: 'Tipo de flujo', sortable: true, key: 'flow_type'},
        {label: 'Última Milla', sortable: true, key: 'name'},
        {label: 'Devolución', sortable: true, key: 'return_name'},
        {label: 'Observación', sortable: true, key: 'observations'},
        // {label: 'Visible', sortable: true, key: 'visible', class: ['text-center']},
        {label: 'Terminal', sortable: true, useSlot: true, key: 'terminal', class: ['text-center']},
        {label: 'incidencia', sortable: true, useSlot: true, key: 'trouble', class: ['text-center']},
        {label: 'En carrier', sortable: true, useSlot: true, key: 'in_carrier', class: ['text-center']},
        // {label: 'Defecto', sortable: true, useSlot: true, key: 'default', class: ['text-center']},
        {label: 'Domicilio', sortable: true, useSlot: true, key: 'home', class: ['text-center']},
        // {label: 'Pudo', sortable: true, useSlot: true, key: 'pudo', class: ['text-center']},
        {label: 'Acciones', key: 'actions', class: ['text-center']}
      ]

      this.actions = [
        {action: id => this.openStatusLocal(id), icon: 'Edit2Icon', color: 'primary', text: 'Editar', needPermission: 'edit'},
        {action: id => this.confirmStatusLocal(id), icon: 'TrashIcon', color:'danger', text: 'Eliminar', needPermission: 'delete'}
      ]
      
      this.fields = [
        {fieldType: 'FieldInput', name: 'status_name', label: 'Nombre estado', containerClass: 'col-sm-12 col-md-3', validation: 'required'},
        {fieldType: 'FieldSelect', name: 'extra', label: 'Opciones adicionales', multiple: true, validations: 'length:0,4', max: 4,
          containerClass: 'col-sm-12 col-md-4',
          specialVerification: this.verifySelectionOptions,
          // options: [
          //   {id: 'terminal#true', text: 'Terminal', icon: 'CheckCircleIcon', color: 'success'},
          //   {id: 'terminal#false', text: 'No terminal', icon: 'XCircleIcon', color: 'danger'},
          //   {id: 'trouble#true', text: 'Trouble', icon: 'CheckCircleIcon', color: 'success'},
          //   {id: 'trouble#false', text: 'No trouble', icon: 'XCircleIcon', color: 'danger'},
          //   {id: 'in_carrier#true', text: 'In-carrier', icon: 'CheckCircleIcon', color: 'success'},
          //   {id: 'in_carrier#false', text: 'No in-carrier', icon: 'XCircleIcon', color: 'danger'},
          //   {id: 'home#true', text: 'Home', icon: 'CheckCircleIcon', color: 'success'},
          //   {id: 'home#false', text: 'No home', icon: 'XCircleIcon', color: 'danger'}
          // ]
          options: [
            {id: 'terminal#true', text: 'Terminal'},
            {id: 'terminal#false', text: 'No terminal'},
            {id: 'trouble#true', text: 'Trouble'},
            {id: 'trouble#false', text: 'No trouble'},
            {id: 'in_carrier#true', text: 'In-carrier'},
            {id: 'in_carrier#false', text: 'No in-carrier'},
            {id: 'home#true', text: 'Home'},
            {id: 'home#false', text: 'No home'}
          ]
        }
      ]
    },
    verifySelectionOptions (value, msg) {
      if (value && value.length > 0) {
        const duplicates = this.findDuplicates(value.map(({id}) => id.split('#')[0]))
        return value.filter(({id}) => !duplicates.includes(id.split('#')[0]) || id === value[value.length - 1].id)
      }
      return value
    },
    findDuplicates (arr) {
      const filtered = arr.filter((item, index) => arr.indexOf(item) !== index)
      return [...new Set(filtered)]
    },
    filterList (form) {
      this.payloadFilter = {}
      // if (form.carrier && form.carrier.id) this.payloadFilter.carrier_id = form.carrier.id
      if (form.extra && form.extra.length > 0) {
        form.extra.map(el => {
          this.payloadFilter[el.id.split('#')[0]] = el.id.split('#')[1]
        })
      }
      if (!!form.status_name) this.payloadFilter.name = form.status_name
      if (this.pagination.page !== 1) this.pagination.page = 1
      else this.getAllDeliveryStatuses()
    },
    cleanFilter () {
      this.formFilter = {}
      this.keyFormRender++
      this.filterList(this.formFilter)
    },
    openStatusLocal (_id) {
      this.statusLocal = this.rows.filter(({id}) => id === _id)[0]
      this.$bvModal.show('modalStatusLocal')
    },
    saveStatusLocal (data) {
      const service = !!data.id ? 'updateDeliveryStatus' : 'saveDeliveryStatus'
      const params = !!data.id ? { id: data.id } : null
      this.trackingService.callService(service, data.form, params)
        .then(response => {
          this.$bvModal.hide('modalStatusLocal')
          this.statusLocal = {}
          this.getAllDeliveryStatuses()
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-guardar', {code: err}))
          this.$refs.modalStatusLocal.loading = false
        })
    },
    getAllDeliveryStatuses () {
      this.pagination.loading = true
      this.selectedRows = []
      const queryParams = {
        page: this.pagination.page,
        limit: this.pagination.limit,
        ...this.payloadFilter
      }
      this.trackingService.callService('getDeliveryStatuses', queryParams)
        .then(response => {
          this.setDataStatusLocal(response)
        })
        .catch(err => {
          console.error(err)
        })
        .finally(end => {
          this.pagination.loading = false
          this.loading = false
        })
    },
    setDataStatusLocal (data) {
      this.rows = []
      this.pagination.total = data.total_registers
      this.rows = data.data.map(status => {
        Object.keys(status).map(key => {
          if (this.booleanList.includes(key)) {
            status[`${key}_icon`] = `<i class='fa fa-${status[key] ? 'check-circle text-success' : 'times-circle text-danger'}'></i>`
          }
        })
        return status
      })
    },
    confirmStatusLocal (_id) {
      this.$yesno(this.$t('msg-pregunta-eliminar-elemento'), () => this.deleteDeliveryStatus(_id))
    },
    deleteDeliveryStatus (id) {
      this.pagination.loading = true
      this.trackingService.callService('deleteDeliveryStatus', null, {id})
        .then(response => {
          if (this.rows.length === 1 && this.pagination.page > 1) this.pagination.page--
          this.getAllDeliveryStatuses()
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-eliminar-elemento'))
        })
    },
    confirmMultipleStatusLocal () {
      this.$yesno(this.$t('msg-pregunta-eliminar-seleccionados'), this.deleteMultipleDeliveryStatus)
    },
    deleteMultipleDeliveryStatus () {
      this.pagination.loading = true
      const services = this.selectedRows.map(id => ({name: 'deleteDeliveryStatus', params: {id}}))
      this.trackingService.callMultipleServices(services)
        .then(response => {
          if (this.rows.length === this.selectedRows.length && this.pagination.page > 1) this.pagination.page--
          this.getAllDeliveryStatuses()
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
  .no-info {
    vertical-align: middle;
    // padding-left: 50%;
    color: #c2c2c2 !important;
    -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none; /* Non-prefixed version, currently
                                    supported by Chrome, Edge, Opera and Firefox */
  }
</style>