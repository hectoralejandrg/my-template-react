<template>
  <div class="rule-list">
    <b-card>
      <div class="row">
        <div class="col-sm-12 mb-2">
          <b-button class="float-right" variant="warning" @click="openModalNew"><feather-icon icon="PlusIcon"/> Crear notificación</b-button>
        </div>
        <div class="col-sm-12">
          <table-render v-show="!loading" id="notifs" :show-checkboxes="false" :actions="actions" :schema="schema" :rows="rows" :loading="loading"/>
          <div class="table-render-skeleton" v-show="loading">
            <b-skeleton-table
              :rows="10"
              :columns="schema.length || 10"
              :table-props="{ }"/>
          </div>
        </div>
      </div>
    </b-card>

    <modal-notification :data.sync="dialogData"></modal-notification>

  </div>
</template>
<script>
import ModalNotification from './ModalNotification'

export default {
  components: {ModalNotification},
  props: ['user', 'data'],
  data () {
    return {
      actions: [],
      dialogOpen: false,
      dialogData: {},
      notifications: [],
      schema: [],
      rows: [],
      keyTableRender: 0,
      loading: true
    }
  },
  methods: {
    stripHTML (html) {
      const tmp = document.createElement('DIV')
      tmp.innerHTML = html
      return tmp.textContent || tmp.innerText || ''
    },
    confirmDelete (id) {
      this.$yesno(this.$t('msg-pregunta-eliminar-elemento'), _ => this.deleteNotification(id))
    },
    deleteNotification (id) {
      this.$root.$data.notificationsCollection.doc(id).delete().catch(e => {
        this.$alert(this.$t('msg-problema-eliminar-elemento'))
      })
    },
    openModalNew () {
      this.dialogData = {}
      this.$bvModal.show('modalNewNotification')
    },
    openModal (_id) {
      this.dialogData = this.rows.filter(({id}) => id === _id)[0]
      if (this.dialogData.created < 1628718179810) {
        this.$alert(this.$t('msg-error-notif'))
      } else {
        this.$bvModal.show('modalNewNotification')
      }
    },
    parseRows (rows) {
      // procesar filas para procesar campos que requieren lógica
      this.rows = []
      for (const rawRow of rows) {
        const row = rawRow.data()
        const id = rawRow.id
        this.rows.push({
          id,
          title: row.title,
          cleanContent: `${this.stripHTML(row.content.replace(/></g, '> <')).substring(0, 200)}...`,
          content: row.content,
          created: row.created,
          // active: row.active,
          views: row.views
        })
      }
      this.loading = false
      this.keyTableRender++
    },
    getData () {
      this.$root.$data.notificationsCollection
        .onSnapshot(resp => this.parseRows(resp.docs))
    }
  },
  mounted () {
    this.getData()
    this.actions = [
      // {action: id => this.enableNotification(id), switchOwnId:'active', dualState: {on: 'Habilitada', off: 'Deshabilitada', iconOn: 'PowerIcon', iconOff: 'PowerIcon'}},
      {action: this.openModal, icon: 'Edit2Icon', color: 'success', text: 'Editar'},
      {action: this.confirmDelete, icon: 'TrashIcon', color:'danger', text: 'Eliminar'}
    ]

    this.schema = [
      {label: 'Título', sortable: true, key: 'title', style: {width: '20%'}},
      {label: 'Contenido', sortable: true, key: 'cleanContent', style: {width: '60%'}},
      {label: 'Vistas', sortable: true, key: 'views', style: {width: '10%'}},
      {label: 'Acciones', key: 'actions', style: {width: '10%'}, class: ['text-center']}
    ]
  }
}
</script>


<style lang="scss">
//.con-vs-dialog .vs-dialog.full {
//  max-width: 1000px;
//}
</style>
