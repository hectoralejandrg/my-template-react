<template>
  <div>
    <b-card>
      <div class="admin-users-button">
        <b-button variant="warning" class="push-right" @click="openModal" :disabled="loading"><feather-icon icon="PlusIcon"/> Crear usuario</b-button>
        <b-button variant="warning" class="push-right mr-2" @click="openModalBaseResources"><feather-icon icon="ArchiveIcon"/> Permisos base</b-button>
      </div>
      <filter-swapper v-if="!loading" :trigger="selectedRows.length === 0" id="users_swapper" :buttons="buttons" :controlHeightButtons="controlHeight">
        <template #slot1>
          <form-render :key="keyFormRender" class="mb-2" :fields="fields" :buttonSend="buttonSend" :form.sync="formFilter" @send="filterList"
            containerButtonsClass="col-sm-12 col-md-2 mt-2">
            <template #buttons>
              <b-button variant="outline-light" class="ml-2" v-b-tooltip.hover title="Limpiar filtros" @click="cleanFilter"><feather-icon icon="RefreshCwIcon"/></b-button>  
            </template>
          </form-render>
        </template>
      </filter-swapper>
      <table-render :key="keyTableRender" v-if="!loading" id="users" :rows="rows" :schema="schema" :actions="actions" :showCheckboxes="false"
        :selectedRows.sync="selectedRows" :loading="pagination.loading">
        <template v-for="currentSlot in booleanList" #[currentSlot]="scope">
          <b-avatar size="32" v-if="scope.rowdata[currentSlot]" :key="currentSlot" variant="light-success"><feather-icon icon="CheckCircleIcon"/></b-avatar>
          <b-avatar size="32" v-if="!scope.rowdata[currentSlot]" :key="currentSlot" variant="light-danger"><feather-icon icon="XCircleIcon"/></b-avatar>
        </template>
      </table-render>
      <!--pagination v-if="!loading" :pagination="pagination" :noDigits="true" :showSize="true"/-->
      <b-skeleton height="40px" width="100%" class="mt-2 mb-2" v-show="loading"/>
      <div class="table-render-skeleton" v-show="loading">
        <b-skeleton-table
          :rows="pagination.limit || 10"
          :columns="schema.length || 10"
          :table-props="{ }"/>
      </div>
    </b-card>
    <modal-user ref="modalUser" :user.sync="currentUser" @send="saveUser" :shippers="shippers" :organizations="organizations"></modal-user>
    <modal-base-permissions ref="modalBasePermissions"></modal-base-permissions>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ModalUser from './ModalUser.vue'
import ModalBasePermissions from './ModalBasePermissions.vue'
import UsersService from './users.service'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'
import useJwt from '@/auth/jwt/useJwt'
import Cookies from 'js-cookie'

export default {
  name: 'crud-users',
  components: { ModalUser, ModalBasePermissions },
  data () {
    return {
      shippers: [],
      buttons: [],
      controlHeight: { class: 'row mb-2 spacing-label-field'},
      selectedRows: [],
      schema: [],
      actions: [],
      rows: [],
      currentDocs: [],
      pagination: { page: 1, limit: 20, total: 1, loading: false },
      currentUser: {},
      companies: [],
      buttonSend: {icon: 'SearchIcon', color: 'warning', title: 'Filtrar'},
      fields: [],
      formFilter: {},
      payloadFilter: {},
      loading: true,
      keyTableRender: 0,
      keyFormRender: 0,
      booleanList: ['hasPermissions', 'status'],
      usersService: new UsersService(this)
    }
  },
  computed: {
    ...mapGetters({
      organizations: 'getOrganizations',
      generalLoading: 'getLoading'
    })
  },
  watch: {
    'pagination.page' () {
      this.getAllUsers()
    },
    'pagination.limit' () {
      this.getAllUsers()
    },
    organizations () {
      console.log(this.organizations)
      if (!this.shippers?.length) this.setInitialData()
      // this.organizations = resp.getOrganizations.data.map(el => ({...el, text: el.name}))
    }
  },
  mounted () {
    this.getAllInitialData()
    this.buttons = [
      { name: 'delete', text: 'Eliminar', color: 'danger',  icon: 'TrashIcon', action: this.confirmDeleteMultipleUser}
    ]
  },
  methods: {
    setInitialData () {
      console.log(33333333333333333)
      this.schema = [
        {label: 'Id', sortable: true, key: 'id', class: ['w-10']},
        {label: 'Nombre', sortable: true, key: 'fullName'},
        {label: 'E-mail', sortable: true, key: 'email'},
        {label: 'Organización', sortable: true, key: 'organization_name'},
        {label: 'Permisos', sortable: true, key: 'hasPermissions', useSlot: true, class: ['text-center']},
        {label: 'Activo', sortable: true, key: 'status', useSlot: true, class: ['text-center']},
        {label: 'Acciones', key: 'actions', class: ['text-center']}
      ]
      this.actions = [
        {action: id => this.openUser(id), icon: 'Edit2Icon', color: 'success', text: 'Editar'},
        {action: id => this.redirect(id), icon: 'LockIcon', color: 'warning', text: 'Permisos'},
        {action: id => this.confirmDeleteUser(id), icon: 'TrashIcon', color:'danger', text: 'Eliminar'},
        {action: id => this.confirmChangeProfile(id), icon: 'MonitorIcon', color:'danger', text: 'Ver sitio como'}
      ]
      this.fields = [
        // {fieldType: 'FieldInput', name: 'name', label: 'Nombre'},
        {fieldType: 'FieldInput', type: 'email', name: 'email', label: 'E-mail', validation: 'email'},
        {fieldType: 'FieldSelect', name: 'shipper', label: 'Shipper', placeholder: 'Nombre de la empresa', options: this.shippers},
        {fieldType: 'FieldSelect', name: 'organization', label: 'Organización', placeholder: 'Nombre de la empresa', options: this.organizations}
      ]
      // this.getDataFirestore()
      this.getAllUsers()
    },
    getAllInitialData () {
      console.log(111111111111111111111)
      const arrServices = [
        { name: 'getShippers', queryParams: { paginate_by: 9999, page: 1 } }
      ]
      this.usersService.callMultipleServices(arrServices, true)
        .then(resp => {
          console.log(2222222222222222222222)
          this.shippers = resp.getShippers.data.map(el => ({...el, text: el.name1}))
          const indexShipper = this.fields.findIndex(el => el.name === 'shipper')
          if (!this.organizations?.length) this.setInitialData()
          // const indexOrganization = this.fields.findIndex(el => el.name === 'organization')
          // this.fields[indexOrganization].options = this.shippers
        })
    },
    // searchShipper (value) {
    //   return this.usersService.callService('getShippers', {name: value})
    //     .then(resp => {
    //       return resp.data.map(el => ({...el, text: `${el.id} - ${el.name1}`}))
    //     })
    // },
    filterList (form) {
      this.payloadFilter = {}
      if (form.organization && form.organization.id) this.payloadFilter.organization = form.organization.id
      if (!!form.name) this.payloadFilter.name = form.name.toLowerCase()
      if (!!form.email) this.payloadFilter.email = form.email.toLowerCase()
      if (this.pagination.page !== 1) this.pagination.page = 1
      else this.getAllUsers()
    },
    cleanFilter () {
      this.formFilter = {}
      this.keyFormRender++
      this.filterList(this.formFilter)
    },
    savePermissions (data) {
    },
    openModalBaseResources () {
      this.$bvModal.show('modalBasePermissions')
    },
    redirect (_id) {
      this.currentUser = this.rows.filter(({id}) => id === _id)[0]
      this.$router.push({ name: 'config-users-permissions', params: {
        permissions: this.currentUser.permissions,
        role: this.currentUser.role,
        id: _id,
        breadcrumb: {
          user: this.currentUser.fullName
        }
      } })
    },
    openUser (_id) {
      this.currentUser = this.rows.filter(({id}) => id === _id)[0]
      this.$bvModal.show('modalUser')
    },
    openModal () {
      this.currentUser = {}
      this.$bvModal.show('modalUser')
    },
    saveUser (data) {
      this.pagination.loading = true
      this.$refs.modalUser.loading = true
      if (!!data.id) this.updateUser(data)
      else this.addUserFirebase(data)
    },
    addUserFirebase (data) {
      this.$root.$data.auth.createUserWithEmailAndPassword(data.form.email, btoa(`${(Math.random() * (99999999 - 10000000)) + 10000000}`))
        .then((userCredential) => {
          this.addUserCollection(userCredential.user.uid, data.form)
        })
        .catch((error) => {
          const errorCode = error.code
          const errorMessage = error.message
          this.$alert(error.message, null, error.code)
          this.pagination.loading = false
          this.$refs.modalUser.loading = false
        })
    },
    addUserCollection (id, form) {
      const user = {
        ...form,
        role: 'admin',
        roles: ['user', 'admin'],
        created: (new Date()).getTime()
      }
      this.$root.$data.accountsCollection.doc(id).set(user)
        .then(resp => {
          this.$bvModal.hide('modalUser')
          this.pagination.loading = false
          this.currentUser = {}
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-guardar', {code: err}))
          this.$refs.modalUser.loading = false
        })
    },
    updateUser (data) {
      this.$root.$data.accountsCollection.doc(data.id).update({...data.form})
        .then(resp => {
          this.$bvModal.hide('modalUser')
          this.pagination.loading = false
          this.currentUser = {}
        }).catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-guardar', {code: err}))
          this.$refs.modalUser.loading = false
        })
    },
    getAllUsers () {
      this.pagination.loading = true
      this.selectedRows = []
      const queryParams = {
        page: this.pagination.page,
        limit: this.pagination.limit,
        ...this.payloadFilter
      }
      let ref = this.$root.$data.accountsCollection
      if (this.payloadFilter.email) {
        ref = ref.where('email', '==', this.payloadFilter.email)
      }
      if (this.payloadFilter.organization) {
        ref = ref.where('organization.id', '==', this.payloadFilter.organization)
      }
      console.log('aqui', 444444444444444444)
      ref
        .onSnapshot(resp => {
          this.rows = []
          resp.docs.forEach(user => {
            console.log('aqui', 99999999999999)
            this.rows.push({
              ...user.data(), 
              id: user.id, 
              organization_name: !!user.data().organization && user.data().organization.id ? `${user.data().organization.id} - ${user.data().organization.name}` : '',
              hasPermissions: user.data().permissions && user.data().permissions.length !== 0})
          })
          this.pagination.loading = false
          this.loading = false
        })
    },
    confirmDeleteUser (_id) {
      this.$yesno(this.$t('msg-pregunta-eliminar-elemento'), () => this.deleteUser(_id))
    },
    deleteUser (id) {
      this.pagination.loading = true
      this.$root.$data.accountsCollection.doc(id).delete()
        .then(response => {
          this.selectedRows = []
          this.pagination.page = 1
          this.getAllUsers()
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-eliminar-elemento'))
        })
        .finally(end => {
          this.pagination.loading = false
        })
    },
    confirmChangeProfile (id) {
      this.$yesno(this.$t('msg-pregunta-cambiar-sesión'), _ => this.changeProfile(id))
    },
    async changeProfile (id) {
      // const user = this.rows.filter(el => el.id === id)
      const originalCookie = Cookies.get('ori_session') ? Cookies.get('ori_session') : Cookies.get('session')
      const originalUser = this.$session.get('ori_user') ? this.$session.get('ori_user') : this.$session.get('cas_user')
      
      // useJwt.setCookie('ori_session', originalCookie, 1)
      Cookies.set('ori_session', originalCookie)
      this.$session.set('ori_user', originalUser)
      this.$store.dispatch('fetchUserData', {id, from: 'users'})
    },
    confirmDeleteMultipleUser () {
      this.$yesno(this.$t('msg-pregunta-eliminar-seleccionados'), this.deleteMultipleUser)
    }
    // deleteMultipleUser () {
    //   this.pagination.loading = true
    //   this.usersService.fbDeleteMultipleUsers(this, this.selectedRows)
    //     .then(resp => {
    //       this.selectedRows = []
    //       this.pagination.page = 1
    //       this.getAllUsers()
    //     })
    //     .catch(err => {
    //       this.$t('msg-problema-eliminar-seleccionados')
    //       console.error(err)
    //     })
    //     .finally(end => {
    //       this.pagination.loading = false
    //     })
    // }
  }
}
</script>
<style lang='scss'>
  
.admin-users-button {
  top: -3.5rem !important;
  right: 0rem !important;
  position: absolute !important;
  z-index: 9;
}
</style>