<template>
  <div>
    <div class="mt-2">
      <table-render :rows="statusTrackings" :schema="schema" :key="keyTableRender"></table-render>
    </div>
  </div>
</template>

<script>
export default {
  name: 'history-status',
  props: ['statusTrackings'],

  data() {
    return {
      schema: [],
      rows: [],
      keyTableRender: 0
    }
  },

  mounted() {
    this.setInitialData()
  },

  methods: {
    setInitialData () {
      this.schema = [
        {label: 'Estado', sortable: true, key: 'status'},
        {label: 'Fecha', sortable: true, key: 'format_date'},
        // {label: 'Comentario', sortable: true, key: 'comments'},
        {label: 'Detalle', sortable: true, key: 'info'},
        {label: 'Usuario', sortable: true, key: 'user'}
      ]
    }
  }
}
</script>