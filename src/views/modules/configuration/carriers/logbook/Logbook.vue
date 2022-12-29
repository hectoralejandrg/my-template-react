<template>
  <div>
    <filter-swapper v-show="!loading.first" :trigger="selectedRows.length === 0" id="logbook" :buttons="buttons" :controlHeightButtons="controlHeight">
      <template #slot1>
        <form-render :key="keyFormRender" class="mb-2" :form.sync="form" :fields="fields" @send="filterList" :buttonSend="buttonSend" containerButtonsClass="col-sm-12 col-md-8 col-lg-3 container-button mt-2">
          <template #buttons>
            <b-button variant="outline-light" v-b-tooltip.hover :title="$t('Limpiar filtros')" class="ml-2" @click="cleanFilter"><feather-icon icon="RefreshCwIcon"/></b-button>  
          </template>
        </form-render>
      </template>
    </filter-swapper>
    <div v-show="!loading.first">
      <table-render id="table-logbook" :schema="schema" :rows="rows" :actions="actions"  showCheckboxes="true" :selectedRows.sync="selectedRows" :loading="loading.logbook">
      </table-render>
      <pagination :pagination="pagination" :noDigits="false" :showSize="true"/>
    </div>
    <b-skeleton type="input" v-if="loading.first" class="mb-1 mt-1" />
    <div class="table-render-skeleton" v-if="loading.first">
      <b-skeleton-table :rows="pagination.limit || 10" :columns="schema.length || 10" :table-props="{}" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'logbook',
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
      logbook: [],
      filters: {},
      pagination: {
        page: 1,
        total: 40,
        limit: 10
      },
      keyFormRender: 0,
      loading: {
        first: false,
        logbook: false
      },
      myInput: null,
      selectedRows: [],
      showingActions: false
    }
  },
  mounted () {
    this.setInitialData()
    
  },
  methods: {
    setInitialData () {
      this.schema = [
        {label: 'Fecha', sortable: true, key: 'date'},
        {label: 'Descripción', sortable: true, key: 'description'},
        {label: 'Usuario', sortable: true, key: 'user'},
        {label: 'Acciones', key: 'actions', class: ['text-center']}
      ]
      this.fields = [
        {fieldType: 'FieldDatepicker', name: 'date_range', label: 'Seleccionar el rango de fechas', range: true, containerClass: 'col-sm-12 col-md-3'},
        {fieldType: 'FieldInput', name: 'description', label: 'Descripción', containerClass: 'col-sm-12 col-md-3'}
      ]
      this.buttons = [
        { name: 'delete', text: 'Eliminar', color: 'danger',  icon: 'TrashIcon', action: this.confirmDeleteMultipleUser}
      ]
      this.actions = [
        {action: id => this.openUpdateModal(id), icon: 'Edit2Icon', color:'success', text: 'Editar'},
        {action: id => this.confirmDeleteLogbook(id), icon: 'TrashIcon', color: 'danger', text: 'Eliminar'}
      ]
      this.getLogbook()
    },
    filterList (data) {
      this.filters = {}
      Object.keys(data).map(key => {
        this.filters[key] = data[key].id || data[key]
      })
      if (this.pagination.page !== 1) this.pagination.page = 1
      else this.getLogbook()
    },
    cleanFilter () {
      this.filters = {}
      this.keyFormRender++
      this.filterList(this.filters)
    },
    getLogbook () {
      this.rows = [
        {id: 1, date: '18-03-2021 11:08', description: 'Cambio de estado F̶a̶c̶t̶i̶b̶i̶l̶i̶d̶a̶d̶ ̶T̶é̶c̶n̶i̶c̶a̶ Integración', user: 'SYS'},
        {id: 2, date: '09-03-2021 14:00', description: 'Reunión con cliente', user: 'MO'}
      ]
    },
    openUpdateModal () {},
    confirmDeleteLogbook () {}
  }
}
</script>

<style lang='scss'>
  
.logbook-button {
  top: -3.5rem !important;
  right: 0rem !important;
  position: absolute !important;
  z-index: 9;
}
</style>