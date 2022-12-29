<template>
  <div>
    <b-card>
      <div class="button-save-permissions">
        <b-button variant="outline-light" class="mr-2" @click="goBack" :disabled="loading"><feather-icon icon="ChevronLeftIcon"/> {{$t('Volver')}}</b-button>
        <b-button variant="warning" class="push-right" @click="savePermissions" :disabled="loading"><feather-icon icon="SaveIcon"/> {{$t('Guardar permisos')}}</b-button>
      </div>
      <form-render :fields="fieldsRole" :form.sync="formRole" class="mb-1" containerButtonsClass="mt-2" :key="`keyFormRender_${keyFormRender}`">
        <template #buttons>
          <b-button variant="outline-light" :disabled="!enableReset" @click="() => selectRole('', formRole.role)"><feather-icon icon="RefreshCwIcon"/> {{$t('Reestablecer permisos')}}</b-button>
        </template>
      </form-render>
    </b-card>
    <div v-if="myPermissions" >
    
    <b-card no-body class="border">
      <b-card-header class="p-1">
        <b-card-title class="font-medium-2">
          <feather-icon
            icon="LockIcon"
            size="18"
          />
          <span class="align-middle ml-50">{{$t('Permisos')}}</span>
        </b-card-title>
      </b-card-header>
      <permissions-table-render
      type="main"
      :concatKeys="false"
      :enableReset.sync="enableReset"
      :actions="actions"
      :schema="schemaPermissionsAPI"
      :permissionsData="generatePermissionData(permissionsData, [], ['menu'])">
        <template #entities="scope">
        <!--{{scope.rowdata}}
        {{`${scope.rowdata.item.permissionType}_${scope.rowdata.item.index}_entities`}} -->
          <field-select  style="max-width: 400px" :options="selectors[scope.rowdata.type]" :multiple="true"
          :id="`entitySelector_${scope.rowdata.index}`"
          :name="`${scope.rowdata.item.permissionType}_${scope.rowdata.item.index}_entities`"
          :value.sync="permissionsData[permissionsData.findIndex(pd => pd.id === scope.rowdata.item.id)].arrayEntities"></field-select>
        </template>
      </permissions-table-render>
    </b-card>
      <div class="row">
        <div class="col-sm-6">
          <b-card no-body class="border">
            <b-card-header class="p-1">
              <b-card-title class="font-medium-2">
                <feather-icon
                  icon="LockIcon"
                  size="18"
                />
                <span class="align-middle ml-50">{{$t('Acceso a pantallas')}}</span>
              </b-card-title>
            </b-card-header>
            <permissions-table-render
            type="menu"
            :key="`keyTable_${keyTable}`"
            :concatKeys="true"
            :enableReset.sync="enableReset"
            :actions="actions"
            :schema="schemaPermissionsMenu"
            :permissionsData="generatePermissionData(permissionsData, ['menu'])"></permissions-table-render>
          </b-card>
        </div>
        <div class="col-sm-6 ">
          <b-card class="border">
            <h4 class="">{{$t('Agregar permiso')}}</h4>
            <form-render :fields="fields" :form.sync="form" :buttonSend="buttonSend" @send="addPermission" containerButtonsClass="mt-2" class="mb-2"></form-render>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PermissionsTableRender from './PermissionsTableRender'
import UsersService from './users.service'
const baseMethods = ['GET', 'POST', 'PUT', 'DELETE']
export default {
  components: { PermissionsTableRender },
  data () {
    return {
      loading: false,
      formRole: {},
      fieldsRole: [],
      schemaPermissionsAPI: [],
      schemaPermissionsMenu: [],
      form: {},
      fields: [],
      buttonSend: { color: 'warning', icon: 'PlusIcon', text: 'Agregar' },
      fieldMethods: [],
      formMethods: {},
      myPermissions: undefined,
      optionMethods: baseMethods.map(el => ({id: el, text: el})),
      typePermissionOptions: [
        { id: 1, text: 'Permisos de entidad' },
        { id: 2, text: 'Otros permisos' }
      ],
      actions: [],
      permissionsData: [],
      basePermissions: {},
      enableReset: false,
      keyTable: 0,
      keyFormRender: 0,
      selectors: {},
      usersService: new UsersService(this)
    }
  },
  mounted () {
    if (!this.$route.params.breadcrumb) this.$router.push({ name: 'config-users' })
    this.schemaPermissionsAPI = [
      // {label: 'ID', key: 'id', sortable: true},
      {label: 'Servicios API', key: 'permissionType', sortable: true},
      {label: 'Entidades', key: 'entities', sortable: true, style: {'max-width': '400px'}},
      {label: 'Obtener', key: 'GET', sortable: false},
      {label: 'Guardar', key: 'POST', sortable: false},
      {label: 'Actualizar', key: 'PUT', sortable: false},
      {label: 'Eliminar', key: 'DELETE', sortable: false},
      {label: 'Acciones', key: 'actions', sortable: false}
    ]
    this.schemaPermissionsMenu = [
      // {label: 'Accesos ID', key: 'id', sortable: true},
      {label: 'Accesos de menú', key: 'permissionType', sortable: true},
      {label: 'Obtener', key: 'GET', sortable: false},
      {label: 'Acciones', key: 'actions', sortable: false}
    ]
    this.actions = [{action: id => this.confirmRemovePermission(id), icon: 'TrashIcon', color: 'danger', text: 'Eliminar'}]
    this.getBasePermissions()
  },
  methods: {
    confirmRemovePermission (id) {
      this.$yesno(this.$t('msg-pregunta-eliminar-elemento'), _ => this.removePermission(id))
    },
    removePermission (_id) {
      this.permissionsData = this.permissionsData.filter(({id}) => id !== _id)
      this.enableReset = true
    },
    generatePermissionData (permissions, allowed = [], notAllowed = []) {
      return permissions.filter(p => {
        return (allowed && allowed.length > 0 && allowed.includes(p.permissionType.split('.')[0])) || 
      (notAllowed && notAllowed.length > 0 && !notAllowed.includes(p.permissionType.split('.')[0]))
      })
    },
    getListBreadcrumb (menus) {
      return menus.split('.').map(menu => ({ text: menu, active: true }))
    },
    setPermissionsTable (permissions) {
      this.myPermissions = {...permissions}
      this.permissionsData = []
      let count = 0
      Object.keys(this.myPermissions).map(key => {
        this.myPermissions[key].map(el => {
          // console.log(this.selectors, key.split('.')[0])
          this.permissionsData.push({
            permissionType: key,
            entities: el.entities,
            id: count,
            arrayEntities: el.arrayEntities || this.selectors[key.split('.')[0]].filter(option => el.entities.includes(option.id))
          })
          if (key.indexOf('menu') !== -1) {
            this.permissionsData[this.permissionsData.length - 1]['GET'] = el.methods.includes('*') || el.methods.includes('GET')
          } else {
            baseMethods.map(me => {
              this.permissionsData[this.permissionsData.length - 1][me] = el.methods.includes('*') || el.methods.includes(me)
            })
          }
          count++
        })
        this.permissionsData = this.permissionsData.sort((a, b) => a.permissionType > b.permissionType ? 0 : -1)
        this.keyTable++
      })
    },
    addPermission (form) {
      const myNewPermission = []
      Object.keys(form).map((key, index) => {
        if (key.indexOf('level#') !== -1) {
          myNewPermission[key.split('#')[1]] = form[key].id
        }
      })
      this.permissionsData.push({permissionType: myNewPermission.join('.'), id: this.permissionsData.length})
      if (form['level#0'].id !== 'menu') {
        baseMethods.map(me => {
          this.permissionsData[this.permissionsData.length - 1].entities = [] //cambiar por form.entities
          this.permissionsData[this.permissionsData.length - 1].arrayEntities = [] //cambiar por form.entities
          this.permissionsData[this.permissionsData.length - 1][me] = false
        })
      } else {
        this.permissionsData[this.permissionsData.length - 1].entities = []
        this.permissionsData[this.permissionsData.length - 1].arrayEntities = [] //cambiar por form.entities
        this.permissionsData[this.permissionsData.length - 1]['GET'] = false
      }
      this.keyTable++
    },
    selectRole (name, value) {
      this.enableReset = false
      if (value) this.setPermissionsTable(this.optionsRoles.filter(el => el.id === value.id)[0].value)
    },
    getMasterRoles () {
      this.fieldsRole = [{ fieldType: 'FieldSelect', name: 'role', label: 'Rol', change: this.selectRole, clearable: false, containerClass: 'col-sm-12 col-md-3 container-info' }]
      this.$root.$data.db.collection('masterRoles')
        .onSnapshot(resp => {
          this.optionsRoles = this.$route.params.permissions ? [{id: 'current', text: this.$options.filters.title(`${this.$route.params.role} (Actual)`), value: this.$route.params.permissions}] : []
          resp.docs.map(el => {
            this.optionsRoles.push({id: el.id, text: this.$options.filters.title(el.id), value: el.data()})
          })
          
          this.fieldsRole[0].options = this.optionsRoles
          if (this.$route.params.permissions) {
            this.formRole.role = this.optionsRoles[0]
            this.selectRole('', {id: this.optionsRoles[0].id})
          }
          this.keyFormRender++
        })
    },
    getBasePermissions () {
      this.$root.$data.db.collection('resourcesPermissions').doc('default')
        .onSnapshot(resp => {
          this.basePermissions = resp.data()
          this.setInitialData()
          this.getOptionsSelectors()
        })
    },
    setInitialData () {
      this.fieldMethods = { 
        fieldType: 'FieldCheckbox', multiple: true, align: 'v', containerClass: 'col-sm-12 container-info',
        options: this.optionMethods
      }

      const baseOptions = Object.keys(this.basePermissions).map(key => ({ id: key, text: this.$t(`${key}-${key}`) }))
      this.fields = [
        {fieldType: 'FieldSelect', name: 'level#0', label: 'Base', containerClass: 'col-sm-12 col-md-3 container-info', validation: 'required',
          change: (name, value) => this.genericChange(name, value, [], value?.id || ''), options: baseOptions}
      ]
    },
    getOptionsSelectors () {
      const objServices = {
        'countries': { name: 'getCountries', id: 'countries' },
        // 'address-types': { name: 'getAddressesTypes', id: 'address-types' },
        'organization-types': { name: 'getOrganizationTypes', id: 'organization-types' },
        'organizations': { name: 'getOrganizations', id: 'organizations', queryParams: { simplified: true } },
        // 'owner-types': { name: 'getOwnerTypes', id: 'owner-types' },
        'shippers': { name: 'getShippers', id: 'shippers', queryParams: { paginate_by: 9999, page: 1 } },
        'folders': { name: 'getFolders', id: 'folders', queryParams: { paginate_by: 9999, page: 1 } }
      }
      const arrayServices = [
      ]
      Object.keys(this.basePermissions).map(key => {
        this.selectors[key] = [{id: '*', text: 'Todos'}]
        if (objServices[key]) {
          arrayServices.push(objServices[key])
        }
      })
      this.usersService.callMultipleServices(arrayServices, true)
        .then(resp => {
          if (resp['countries']) this.selectors['countries'] = [{id: '*', text: 'Todos'}].concat(resp['countries'].data.map(c => ({...c, text: c.name})))
          // if (resp['address-types']) this.selectors['address-types'] = [{id: '*', text: 'Todos'}].concat(resp['address-types'].data.address_types.map(c => ({id: c, text: c})))
          if (resp['organization-types']) this.selectors['organization-types'] = [{id: '*', text: 'Todos'}].concat(resp['organization-types'].data.map(c => ({...c, text: c.name})))
          if (resp['organizations']) this.selectors['organizations'] = [{id: '*', text: 'Todos'}].concat(resp['organizations'].data.map(c => ({...c, text: c.name})))
          // if (resp['owner-types']) this.selectors['owner-types'] = [{id: '*', text: 'Todos'}].concat(resp['owner-types'].data.owner_types.map(c => ({id: c, text: c})))
          if (resp['shippers']) this.selectors['shippers'] = [{id: '*', text: 'Todos'}].concat(resp['shippers'].data.map(c => ({...c, text: c.name1})))
          if (resp['folders']) this.selectors['folders'] = [{id: '*', text: 'Todos'}].concat(resp['folders'].data.map(c => ({...c, text: c.name})))
          // this.selectors.shippers = [{id: '*', text: 'Todos'}].concat(resp.shippers.data.map(c => ({...c, text: c.name1})))
          
          this.getMasterRoles()
        })
    },
    async genericChange (name, value, arrayPermissions, initialString) {
      // Calcula el actual nivel a evaluar
      const newName = `level#${arrayPermissions.length + 1}`
      delete this.form[newName]
      this.fields = this.fields.filter(el => ![newName, `baseCheckbox_${arrayPermissions.length}`].includes(el.name))
      if (!value) {
        return 0
      }
      let currentPermission = this.basePermissions
      arrayPermissions = arrayPermissions.concat(value.id)
      arrayPermissions.map(el => {
        currentPermission = currentPermission[el]
      })
      const index = this.fields.findIndex(el => el.name === name)
      let currentOptions = []

      if (arrayPermissions.length === 1 && value && value.id !== 'menu') {
        this.getListFx(value.id)
      }



      const newField = { 
        fieldType: 'FieldSelect',
        name: newName, 
        label: this.$t(`${initialString !== 'menu' && value.id === '*' ? 'main' : initialString}-${value.id}`),
        placeholder: '',
        containerClass: 'col-sm-12 col-md-3 container-info', validation: ''
      }
      if (currentPermission !== true && currentPermission && arrayPermissions[arrayPermissions.length - 1] !== '*') {
        currentOptions = Object.keys(currentPermission).map(key => ({ id: key, text: key === '*' ? 'Todos' : this.$t(`${initialString !== 'menu' && key === '*' ? 'main' : initialString}-${key}`) })).sort((a, b) => a.id > b.id ? 1 : -1)
        newField.multiple = false
        newField.change = (_name, _value) => this.genericChange(_name, _value, arrayPermissions, initialString)
        newField.options = currentOptions
        this.fields.splice(index + 1, 0, newField)
      } 
      // else if (currentPermission) {
      //   // Si debe cargar lista de recursos en base al padre
      //   currentOptions = await this.getListFx(arrayPermissions[0])
      //   newField.label = `Lista de ${arrayPermissions[0]}`
      // } else {
      //   // Si debe cargar lista de recursos en base a si mismo
      //   currentOptions = await this.getListFx(value.id)
      //   newField.label = `Lista de ${value.id}`
      // }
    },
    verifySelectionOptions (value, msg) {
      if (value && value.length > 0 && value.findIndex(el => el.id === '*') !== -1) {
        return [{ id: '*', text: 'Todos' }]
      }
      return value
    },
    addCheckboxSublevels (name, value) {
      const innerIndex = name.split('#')[1]
      const index = this.fields.findIndex(el => el.name === name)
      const newName = `baseCheckbox#${innerIndex}`
      const indexSecond = this.fields.findIndex(el => el.name === newName)
      const newField = {
        fieldType: 'FieldRadio', name: newName, label: value.id, containerClass: 'col-sm-12 col-md-3 container-info', validation: 'required', multiple: true,
        specialVerification: this.verifySelectionOptions,
        change: (_name, _value) => this.typePermissionsCheckboxChange(_name, _value), 
        options: this.typePermissionOptions
      }
      if (indexSecond === -1) this.fields.splice(index + 1, 0, newField)
      else this.fields[indexSecond] = newField
    },
    getListFx (keySearch) {
      return []
    },
    onAccept () {

    },
    async savePermissions (e) {
      const permissions = {}
      this.permissionsData.map(p => {
        const currentMethods = [...new Set(baseMethods.filter(el => p[el]))].length === 4 ? ['*'] : [...new Set(baseMethods.filter(el => p[el]))]
        const currentEntities = p.arrayEntities || []
        if (permissions[p.permissionType] && permissions[p.permissionType].length > 0) {
          permissions[p.permissionType].push({
            entities: [...currentEntities.map(en => en.id)],
            methods: currentMethods || [],
            arrayEntities: [...currentEntities.map(en => ({id: en.id, text: en.text}))]
          })
        } else {
          permissions[p.permissionType] = [{
            entities: [...currentEntities.map(en => en.id)],
            methods: currentMethods || [],
            arrayEntities: [...currentEntities.map(en => ({id: en.id, text: en.text}))]
          }]
        }
      })
      const role = this.formRole.role.id !== 'current' ? this.formRole.role.id : this.$route.params.role
      this.$root.$data.accountsCollection.doc(this.$route.params.id).update({permissions, role})
        .then(resp => {
          this.$success(this.$t('Los permisos se han actualizado correctamente'))
          this.enableReset = false
          this.$router.push({ name: 'config-users' })
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-guardar', {code: err}))
        })
    },
    getUniqueNamePermission (level, index) {
      return `${level}_${this.myPermissions[level][index].entities.join('_')}`
    },
    goBack () {
      if (this.enableReset) this.$yesno('Tiene permisos sin guardar. Si continúa, perderá los cambios. ¿Está seguro de que desea volver?', _ => this.$router.push({ name: 'config-users'}))
      else this.$router.push({ name: 'config-users'})
    }
  }
}
</script>
<style lang="scss">
  .button-save-permissions {
    top: -3.5rem !important;
    right: 0rem !important;
    position: absolute !important;
    z-index: 9;
  }
</style>