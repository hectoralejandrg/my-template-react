<template>
  <div>
    <form-render class="mb-2 mb-2" :fields="fields" :key="`form_${keyFormRender}`" :form.sync="formFilter" :buttonSend="buttonSend" @send="filterList"
      containerButtonsClass="col-sm-12 col-md-3 container-button mt-2">
      <template #buttons>
        <b-button variant="outline-light" v-b-tooltip.hover :title="$t('Limpiar filtros')" class="ml-2" @click="cleanFilter"><feather-icon icon="RefreshCwIcon"/></b-button>  
      </template>
    </form-render>
    <table-render :key="`table_${keyTableRender}`" id="manifest" :rows="rows" :schema="schema">
      <template #documents>
        <div>{{$t('Manifesto y etiquetas')}}</div>
      </template>
      <template #status>
        <div>{{$t('Manifesto activo')}}</div>
      </template>
    </table-render>
    <pagination :pagination="pagination" :noDigits="true"/>
  </div>
</template>

<script>
import DeliveryService from '../delivery.service'

export default {
  name: 'filter-manifest',
  props: ['carriers'],

  data () {
    return {
      fields: [],
      formFilter: {},
      payloadFilter: {},
      buttonSend: { icon: 'SearchIcon', color: 'warning', title: 'Filtrar' },
      schema: [],
      documents: [],
      status: [],
      rows: [],
      keyTableRender: 0,
      keyFormRender: 0,
      pagination: {
        page: 1, 
        total: 40,
        limit: 10
      },
      deliveryService: new DeliveryService(this)
    }
  },

  mounted () {
    this.setInicialData()
  },

  watch: {
    carriers () {
      this.fields[3].options = this.carriers
      this.keyFormRender++
    }
  },

  methods: {
    setInicialData () {
      this.fields = [
        { fieldType: 'FieldInput', name: 'manifestNumber', label: 'N° de manifiesto', containerClass: 'col-sm-12 col-md-2' },
        { fieldType: 'FieldDatepicker', label: 'Fecha de búsqueda', name: 'find_date', range: true, clearable: true},
        { fieldType: 'FieldSelect', name: 'company_name', label: 'Empresa', containerClass: 'col-sm-12 col-md-2' },
        { fieldType: 'FieldSelect', name: 'carrier', label: 'Carrier', containerClass: 'col-sm-12 col-md-2'}
      ]
      this.schema = [
        {label: 'Manifesto', sortable: true, key: 'manifestNumber'},
        {label: 'Empresa', sortable: true, key: 'shipper_name'},
        {label: 'Carrier', sortable: true, key: 'carrier'},
        {label: 'E-mail', sortable: true, key: 'email'},
        {label: 'Envíos', sortable: true, key: 'deliveryNumber'},
        {label: 'Fecha', sortable: true, key: 'delivery_date'},
        {label: 'Documentos', sortable: true, key: 'documents', useSlot: true},
        {label: 'Estado', sortable: true, key: 'status', useSlot: true}
      ]
      this.rows = [
        { manifestNumber: 123, 
          company_name: 'The Printery Shop', 
          carrier: 'CORREOSCHILE', 
          email: 'theprinteryshop@admin.com', 
          deliveryNumber: 2, 
          delivery_date:'01-01-2020'
        }
      ]
      this.getShippers()
    },

    filterList (form) {
      
      this.payloadFilter = {}
      if (!!form.company_name) this.payloadFilter.company_name = form.company_name
      if (!!form.manifestNumber) this.payloadFilter.manifestNumber = form.manifestNumber
      if (!!form.find_date) this.payloadFilter.find_date = form.find_date
      if (!!form.carrier) this.payloadFilter.carrier = form.carrier
      // this.pagination.page = 1
      // this.getAllUsers()
    },
    cleanFilter () {
      this.formFilter = {}
      this.keyFormRender++
      this.filterList(this.formFilter)
    },

    
    getShippers (value) {
      this.deliveryService.callService('getShippers', {paginate_by: 9999, page: 1 })
        .then(resp => {
          this.fields[3].options = resp.data.map(el => ({...el, text: `${el.id} - ${el.name1}`}))
          this.keyFormRender++
        })
    }
  }
}
</script>

<style></style>
