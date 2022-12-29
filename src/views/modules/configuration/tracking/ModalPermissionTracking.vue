<template>
  <b-modal id="modalPermissionTracking" :title="title" modal-class="dialog-800" ok-variant="warning" 
    hide-footer no-close-on-esc no-close-on-backdrop @close="close">
    <form-render :form.sync="form" :fields="fields" @send="addUsersPermissions" :buttonSend="buttonSend" containerButtonsClass="col-sm-4 mt-2" ref="formRenderPermissionTracking" :key="keyFormRender"> <!--  v-show="!loading" -->
      <!-- <template #buttons>
          <b-button variant="outline-light" @click="() => selectRole('', formRole.role)"><feather-icon icon="RefreshCwIcon"/> {{$t('Reestablecer permisos')}}</b-button>
      </template> -->
    </form-render>
    <table-render :rows="rows" :schema="schema" :actions="actions">
      <template v-for="currentSlot in permissionsType" #[currentSlot]="scope" >
          <div v-if="!scope.rowdata[currentSlot]" :key="currentSlot">
            <b-form-checkbox
              class="custom-control-success"
              :checked="scope.rowdata.permissions[currentSlot]"
              @change="updatePermissions( scope.rowdata.permissions[currentSlot], currentSlot, scope.rowdata)"
              switch
            >
              <span class="switch-icon-left">
                <feather-icon icon="CheckIcon" />
              </span>
              <span class="switch-icon-right">
                <feather-icon icon="XIcon" />
              </span>
            </b-form-checkbox>
          </div>
      </template>
    </table-render>
  </b-modal>
</template>
<script>
export default {
  name: 'modal-permission-tracking',
  props: ['listUsers'],
  data () {
    return {
      form: {},
      fields: [],
      editing: false,
      loading: true,
      schema: [],
      rows: [],
      actions: [],
      permissionsType: ['add', 'edit', 'delete'],
      buttonSend: { color: 'warning', icon: 'PlusIcon', text: 'Agregar' },
      keyFormRender: 0
    }
  },
  computed: {
    title () {
      return `${this.$t('Permisos')} - ${this.$t(`menu-${this.$route.name}`)}`
    }
  },
  watch: {
    listUsers () { 
      this.rows = this.listUsers
      console.log(this.rows)
    }
  },
  mounted () {
    console.log(this.$route)
    this.fields = [
      {fieldType: 'FieldInput', name: 'email', type: 'email', label: 'Correo', containerClass: 'col-sm-8 container-info', validation: 'required|email' }
    ]
    this.schema = [
      {label: 'Correo', sortable: true, key: 'email'},
      {label: 'Crear', sortable: true, useSlot: true, key: 'add', class: ['text-center']},
      {label: 'Editar', sortable: true, useSlot: true, key: 'edit', class: ['text-center']},
      {label: 'Eliminar', sortable: true, useSlot: true, key: 'delete', class: ['text-center']},
      {label: 'Acciones', key: 'actions', class: ['text-center']}
    ]
    this.actions = [
      { action: id => this.confirmRemoveMail(id), icon: 'TrashIcon', color: 'danger', text: 'Eliminar' }
    ]

  },
  methods: {
    ok (e) {
      e.preventDefault()
      this.$refs.formRenderPermissionTracking.checkForm()
    },
    close () {
      this.form = {}
    },

    addUsersPermissions (data) {
      const permissions = { 
        add: false,
        delete: false,
        edit: false
      }
      this.$root.$data.db.collection('specialPermissions').doc('tracking').collection('users').doc(this.form.email).set(permissions)
        .then(resp => {
          // this.$bvModal.hide('modalPermissionTracking')
          // this.$success(this.$t('Correo agregado a permisos correctamente'))
          this.form = {}
          this.keyFormRender++
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-guardar', {code: err}))
        })
    },

    updatePermissions(value, permission,  user) {
      let newValue = false
      if (value === true) {
        newValue = false
      } else {
        newValue = true
      }
      const update = { [`${permission}`]: newValue}
      this.$root.$data.db.collection('specialPermissions').doc('tracking').collection('users').doc(user.id).update(update)
        .then(resp => {
          console.log('Cambio exitoso')
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-guardar', {code: err}))
        })
    },

    confirmRemoveMail (id) {
      this.$yesno(this.$t('msg-pregunta-eliminar-elemento'), _ => this.removeMailPermission(id))
    },

    removeMailPermission(id) {
      this.$root.$data.db.collection('specialPermissions').doc('tracking').collection('users').doc(id).delete()
        .then(resp => {
          // this.$success(this.$t('Correo eliminado correctamente'))
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-guardar', {code: err}))
        })
    }
  }
}

</script>
<style lang="scss" scoped>

</style>