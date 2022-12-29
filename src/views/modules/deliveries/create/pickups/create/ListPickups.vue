<template>
    <div class="mt-2">
      <table-render :key="keyTableRender" id="listPickups" :rows="rows" :schema="schema">
      <template #documents>
        <div>{{$t('Manifesto y etiquetas')}}</div>
      </template>
      <template #status>
        <div>{{$t('Manifesto activo')}}</div>
      </template>
    </table-render>
    </div>
</template>
<script>
export default {
  name: 'list-pickups',

  data () {
    return {
      schema: [],
      rows: [],
      keyTableRender: 0
    }
  },

  mounted () {
    this.setInitialData()
  },

  methods: {
    setInitialData () {
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
    }
  }

}
</script>