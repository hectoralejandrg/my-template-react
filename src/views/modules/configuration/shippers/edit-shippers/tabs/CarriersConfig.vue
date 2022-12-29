<template>
  <div>
    <table-render :schema="schema"></table-render>
  </div>
</template>

<script>
export default {
  name: 'carriers-config',

  data() {
    return {
      schema: []
    }
  },

  mounted() {
    this.schema = [
      { label: 'Carrier', sortable: true, key: 'carrier' },
      { label: 'Codigo', sortable: true, key: 'code' },
      { label: 'Servicios', sortable: true, key: 'carrier_services' },
      { label: 'Integracion', sortable: true, key: 'integracion' },
      { label: 'Acciones', key: 'actions', class: ['text-center'] }
    ]
    this.actions = [
      { action: id => console.log(id), icon: 'TrashIcon', color: 'danger', text: 'Eliminar' }
    ]
  }
}


</script>