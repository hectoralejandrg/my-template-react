<template>
  <div>
    <filter-swapper v-show="!loading.first" :trigger="selectedRows.length === 0" id="attributes" :buttons="buttons" :controlHeightButtons="controlHeight">
      <template #slot1>
        <form-render :key="keyFormRender" class="mb-2" :form.sync="form" :fields="fields" @send="filterList" :buttonSend="buttonSend" containerButtonsClass="col-sm-12 col-md-8 col-lg-3 container-button mt-2">
          <template #buttons>
            <b-button variant="outline-light" v-b-tooltip.hover :title="$t('Limpiar filtros')" class="ml-2" @click="cleanFilter"><feather-icon icon="RefreshCwIcon"/></b-button>  
          </template>
        </form-render>
      </template>
    </filter-swapper>
    <div v-show="!loading.first">
      <table-render id="table-attributes" :schema="schema" :rows="rows" :actions="actions"  showCheckboxes="true" :selectedRows.sync="selectedRows" :loading="loading.attributes">
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
  name: 'attributes',
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
      attributes: [],
      filters: {},
      pagination: {
        page: 1,
        total: 40,
        limit: 10
      },
      keyFormRender: 0,
      loading: {
        first: false,
        attributes: false
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
        {label: 'Nombre', sortable: true, key: 'name'},
        {label: 'Descripción', sortable: true, key: 'description'},
        {label: 'Atributo por defecto', key: 'default_attribute', class: ['text-center'], style: { width: '15%'}},
        {label: 'Acciones', key: 'actions', class: ['text-center']}
      ]
      this.fields = [
        {fieldType: 'FieldInput', name: 'name', label: 'Nombre del atributo'}
      ]
      this.buttons = [
        { name: 'delete', text: 'Eliminar', color: 'danger',  icon: 'TrashIcon', action: this.confirmDeleteMultipleUser}
      ]
      this.actions = [
        {action: id => this.openUpdateModal(id), icon: 'Edit2Icon', color:'success', text: 'Editar'},
        {action: id => this.confirmDeleteAttribute(id), icon: 'TrashIcon', color: 'danger', text: 'Eliminar'}
      ]
      this.getattributes()
    },
    filterList (data) {
      this.filters = {}
      Object.keys(data).map(key => {
        this.filters[key] = data[key].id || data[key]
      })
      if (this.pagination.page !== 1) this.pagination.page = 1
      else this.getattributes()
    },
    cleanFilter () {
      this.filters = {}
      this.keyFormRender++
      this.filterList(this.filters)
    },
    getattributes () {
      this.rows = [
        {id: 1, name: 'sucursal', description: 'Envío con entrega en sucursal', default_attribute: true}
      ]
    },
    openUpdateModal () {},
    confirmDeleteAttribute () {}
  }
}
</script>

<style lang='scss'>
  
.attributes-button {
  top: -3.5rem !important;
  right: 0rem !important;
  position: absolute !important;
  z-index: 9;
}
</style>