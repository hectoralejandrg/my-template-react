<template>
  <b-modal id="modalModularPermissions" :title="title" :modalClass="modalClass" ok-variant="warning" 
    hide-footer no-close-on-esc no-close-on-backdrop @close="close">
    <form-render :form.sync="form" :fields="fields" @send="addUsersPermissions" :buttonSend="buttonSend" containerButtonsClass="col-sm-4 mt-2"
    ref="formRenderModularPermissions" :key="keyFormRender"> <!--  v-show="!loading" -->
      <!-- <template #buttons>
          <b-button variant="outline-light" @click="() => selectRole('', formRole.role)"><feather-icon icon="RefreshCwIcon"/> {{$t('Reestablecer permisos')}}</b-button>
      </template> -->
    </form-render>
    <table-render id="tableModularPermissions" :rows="rows" :schema="schema" :topSchema="topSchema" :actions="actions">
      <template v-for="currentSlot in totalPermissions" #[currentSlot]="scope" >
          <div v-if="!scope.rowdata[currentSlot]" :key="currentSlot">
            <b-form-checkbox
              class="custom-control-success"
              :checked="scope.rowdata.permissions[currentSlot]"
              @change="updatePermissions(scope.rowdata.permissions[currentSlot], currentSlot, scope.rowdata)"
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
  name: 'modal-modular-permissions',
  props: ['listUsers', 'modularPermissions'],
  data () {
    return {
      form: {},
      fields: [],
      editing: false,
      loading: true,
      schema: [],
      topSchema: [],
      rows: [],
      objRows: { users: [], roles: [], positions: []},
      actions: [],
      totalPermissions: [],
      buttonSend: { color: 'warning', icon: 'PlusIcon', text: 'Agregar' },
      keyFormRender: 0,
      modalClass: 'dialog-800',
      optionsType: [
        { id: 'roles', text: 'Rol' },
        { id: 'positions', text: 'Cargo' },
        { id: 'users', text: 'Email' }
      ],
      optionsRole: [
        { id: 'superadmin', text: 'Superadmin' },
        { id: 'admin', text: 'Admin' },
        { id: 'seller', text: 'Seller' },
        { id: 'Marketplace', text: 'Marketplace' },
        { id: 'mkp_seller', text: 'Seller de Marketplace' }
      ],
      optionsPosition: [
        { id: 'position1', text: 'Cargo 1' },
        { id: 'position2', text: 'Cargo 2' },
        { id: 'position3', text: 'Cargo 3' },
        { id: 'position4', text: 'Cargo 4' }
      ]
    }
  },
  computed: {
    title () {
      return `${this.$t('Permisos')} - ${this.$t(`menu-${this.$route.name}`)}`
    }
  },
  watch: {
    objRows: {
      handler () {
        this.rows = []
        Object.values(this.objRows).map(el => {
          this.rows = this.rows.concat(el)
        })
      }, deep: true
    },
    modularPermissions () {
      this.changeType('type', this.optionsType[0])
      this.form.type = this.optionsType[0]
      this.generateSchema() 
    }
  },
  mounted () {
    this.fields = [
      {fieldType: 'FieldRadio', name: 'type', type: 'type', label: 'Tipo de permiso', align: 'h', options: this.optionsType, change: this.changeType, containerClass: 'col-12 container-info', validation: 'required' }
    ]
    this.changeType('type', this.optionsType[0])
    this.form.type = this.optionsType[0]
    this.generateSchema()
    this.actions = [
      { action: id => this.confirmRemovePermission(id), icon: 'TrashIcon', color: 'danger', text: 'Eliminar' }
    ]
    this.rows = []
    this.getModularPermissions('roles')
    this.getModularPermissions('users')
    this.getModularPermissions('positions')
  },
  methods: {
    generateSchema () {
      this.topSchema = []
      this.schema = [
        {label: 'Tipo', sortable: true, key: 'type'},
        {label: 'Valor', sortable: true, key: 'value'}
      ]
      this.generateCheckboxes(this.modularPermissions)
      this.schema.push({label: 'Acciones', key: 'actions', class: ['text-center']})
    },
    generateCheckboxes (permissions = {}, extraName = null) {
      // console.log(Array.isArray(permissions))
      if (Array.isArray(permissions)) {
        permissions.map(permission => {
          const currentKey = extraName ? `${permission}_${extraName}` : permission
          this.totalPermissions.push(currentKey)
          this.schema.push({label: permission, sortable: true, useSlot: true, key: currentKey, class: ['text-center']})
          this.calculateModalClass()
        })
      } else {
        this.topSchema.push([])
        const topSchemaCurrent = this.topSchema.length - 1
        this.topSchema[topSchemaCurrent].push({label: 'colspan2', key: 'colspan2', class: ['sr-only'], colspan: 2 })
        Object.entries(permissions).map((data, index) => {
          this.topSchema[topSchemaCurrent].push({label: data[0], key: data[0], class: ['text-center'], colspan: data[1].length })
          this.generateCheckboxes(data[1], data[0])
        })
      }
    },
    calculateModalClass () {
      const length = this.schema.length - 2 // - correo - acciones
      const base = 400
      const estimated = base + (length  * 100)
      this.modalClass = `dialog-${estimated < 800 ? 800 : estimated}`
    },
    changeType (name, value) {
      if (!value?.id) return
      const indexType = this.fields.findIndex(el => el.name === 'type')
      this.fields = this.fields.filter(el => !['users', 'roles', 'positions'].includes(el.name))
      this.fields.splice(indexType + 1, 0, this.getField(value.id))
    },
    getField (type) {
      switch (type) {
      case 'users':
        return {fieldType: 'FieldInput', name: 'users', type: 'email', label: 'Correo', containerClass: 'col-sm-8 container-info', validation: 'required|email' }
      case 'roles':
        return {fieldType: 'FieldSelect', name: 'roles', label: 'Rol', options: this.optionsRole, containerClass: 'col-sm-8 container-info', validation: 'required' }
      case 'positions':
        return {fieldType: 'FieldSelect', name: 'positions', label: 'Cargo', options: this.optionsPosition, containerClass: 'col-sm-8 container-info', validation: 'required' }
      }
    },  
    close () {
      this.form = { type: this.form.type }
    },

    addUsersPermissions (data) {
      const permissions = { 
        add: false,
        delete: false,
        edit: false
      }
      console.log({...data})
      const newDoc = data[data.type.id].id || data[data.type.id]
      this.$root.$data.db.collection('specialPermissions').doc(this.$route.name).collection(data.type.id).doc(newDoc).set(permissions)
        .then(resp => {
          // this.$success(this.$t('Correo agregado a permisos correctamente'))
          this.form = { type: this.form.type }
          this.keyFormRender++
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-guardar', {code: err}))
        })
    },

    updatePermissions(value, permission, data) {
      let newValue = false
      if (value === true) {
        newValue = false
      } else {
        newValue = true
      }
      const update = { [`${permission}`]: newValue}
      this.$root.$data.db.collection('specialPermissions').doc(this.$route.name).collection(data.type_id).doc(data.id).update(update)
        .then(resp => {
          // console.log('Cambio exitoso')
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-guardar', {code: err}))
        })
    },

    confirmRemovePermission (id) {
      const type = this.rows.find(el => el.id === id).type_id
      this.$yesno(this.$t('msg-pregunta-eliminar-elemento'), _ => this.removeModularPermission(id, type))
    },
    
    getModularPermissions(type) {
      this.$root.$data.db.collection('specialPermissions').doc(this.$route.name).collection(type)
        .onSnapshot(resp => {
          this.objRows[type] = resp.docs.map(doc => {
            return {
              id: doc.id,
              type: this.optionsType.find(el => el.id === type).text,
              type_id: type,
              value: doc.id, 
              permissions : {...doc.data()}
            }
          })
        })
    },

    removeModularPermission(id, type) {
      this.$root.$data.db.collection('specialPermissions').doc(this.$route.name).collection(type).doc(id).delete()
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