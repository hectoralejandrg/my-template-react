<template>
  <div>
    <b-card>
      <div class="organization-button">
        <b-button variant="warning" class="push-right" @click="openCreateModal" :disabled="loading.total"><feather-icon icon="PlusIcon"/> {{$t('Crear organización')}}</b-button>
      </div>
      <filter-swapper v-show="!loading.first" :trigger="selectedRows.length === 0" :buttons="buttons" :controlHeightButtons="controlHeight">
        <template #slot1>
          <form-render :form.sync="form" :key="keyFormRender" :fields="fieldsForm" @send="filterList" :buttonSend="buttonSend" ref="formFilter"
            containerButtonsClass="col-sm-12 col-md-7 col-lg-2 container-button mt-2" class="mb-2">
            <template #buttons>
              <b-button variant="outline-light" v-b-tooltip.hover title="Limpiar filtros" class="ml-2" @click="cleanFilter"><feather-icon icon="RefreshCwIcon"/></b-button>
            </template>
          </form-render>
        </template>
      </filter-swapper>
      <div v-show="!loading.first">
        <table-render id="table-organization" :schema="schema" :rows="rows" :actions="actions"  showCheckboxes="true" :selectedRows.sync="selectedRows" :loading="loading.organizations">
        </table-render>
        <pagination :pagination="pagination" :noDigits="false" :showSize="true"/>
      </div>
      <b-skeleton type="input" v-if="loading.first" class="mb-2 mt-2 spacing-label-field"/>
      <div class="table-render-skeleton" v-if="loading.first">
        <b-skeleton-table
          :rows="pagination.limit || 10"
          :columns="schema.length || 10"
          :table-props="{ }"/>
      </div>
      <modal-organization :form="modalForm" :title="modaltitle"></modal-organization>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ModalOrganization from './ModalOrganization.vue'
import OrganizationService from './organization.service'

export default {
  components: {ModalOrganization},
  data () {
    return {
      buttons: [],
      controlHeight: { class: 'row mb-2 spacing-label-field'},
      buttonSend: {title: 'Buscar', icon: 'SearchIcon', color: 'warning'},
      schema: [],
      rows: [],
      countriesData: [],
      actions: [],
      form: {},
      filters: {},
      modaltitle: '',
      keyFormRender: 0,
      modalForm: {},
      pagination: {
        page: 1,
        total: 40,
        limit: 10
      },
      loading: {
        first: true,
        organizations: true,
        types: true,
        countries: true,
        users: false,
        total: true
      },
      selectedRows: [],
      organizationService: new OrganizationService(this)
    }
  },
  setup () {
    const fieldsForm = [
      {fieldType: 'FieldInput', label: 'Nombre', name: 'name', clearable: true, containerClass: 'col-sm-12 container-info col-md-2'},
      {fieldType: 'FieldInput', label: 'Código', name: 'code', clearable: true, containerClass: 'col-sm-12 container-info col-md-2'},
      {fieldType: 'FieldSelect', label: 'Usuario', name: 'executive_id', clearable: true, containerClass: 'col-sm-12 container-info col-md-2'},
      {fieldType: 'FieldSelect', label: 'País', name: 'country_id', clearable: true, containerClass: 'col-sm-12 container-info col-md-2'},
      {fieldType: 'FieldSelect', label: 'Tipo de organización', name: 'organization_type', clearable: true, containerClass: 'col-sm-12 container-info col-md-2'}
    ]
    return { fieldsForm }
  },
  computed: {
    ...mapGetters({
      countries: 'getCountries',
      organizations: 'getOrganizations',
      organizationTypes: 'getOrganizationTypes',
      // Estos loading se definen en store/global/index.js
      // Se utlizan en el watch para saber cuando el listado fue recargado correctamente
      generalLoading: 'getLoading'
    })
  },
  mounted () {
    //Para cuando se cambia de pantalla dentro del sitio sin actualizar
    if (this.countries && !!this.countries.length) {
      this.setCountries('mounted')
    }
    this.setInitialData()
    this.getAllInitialData()
  },
  watch: {
    // Se escuchan los loading que me interesan
    // en este caso el del listado de organizations llamado getOrganizations, getOrganizationTypes y getCountries
    // Se usa el mismo nombre del servicio para que esto se haga automatico y la siguiente instruccion funcione siempre
    generalLoading: {
      handler () {
        this.loading.organizations = !!this.generalLoading.getOrganizations
        this.loading.types = !!this.generalLoading.getOrganizationTypes
        this.loading.countries = !!this.generalLoading.getCountries
        if (!this.generalLoading.saveOrganization && !this.generalLoading.updateOrganization) {
          this.$bvModal.hide('modalOrganization')
          this.modalForm = {}
        }
      },
      deep: true
    },
    // Me aseguro de saber cuando todo está cargado con una sola variable
    loading: {
      handler () {
        const prevTotal = this.loading.total
        this.loading.total = !Object.keys(this.loading).filter(key => key !== 'total').every(key => !this.loading[key])
        // Que la actualización del componente solo se fuerce cuando esté todo cargado
        if (prevTotal !== this.loading.total) this.keyFormRender++
      },
      deep: true
    },
    // Para cuando se actualiza la página y el contenido carga antes que el listado de countries o cuando se llama dentro del módulo
    countries () {
      this.setCountries('watch')
    },
    // Para cuando se actualiza la página y el contenido carga antes que el listado de organizationTypes o cuando se llama dentro del módulo
    organizationTypes () {
      const index = this.fieldsForm.findIndex(el => el.name === 'organization_type')
      this.fieldsForm[index].options = this.organizationTypes
    },
    // Para cuando se actualiza la página y el contenido carga antes que el listado de organizations o cuando se llama dentro del módulo
    organizations () {
      this.rows = this.organizations.rows.map(organization => {
        return {
          ...organization,
          created_at: organization.created_at ? this.$options.filters.dbDateToFormat(organization.created_at.replace(' ', 'T'), 'D T') : '',
          updated_at: organization.updated_at ? this.$options.filters.dbDateToFormat(organization.updated_at.replace(' ', 'T'), 'D T') : ''
        }
      })
      this.loading.first = false
      this.pagination.total = this.organizations.total
    },
    'pagination.page' () {
      this.getOrganizations()
    },
    'pagination.limit' () {
      this.getOrganizations()
    }
  },
  methods: {
    setCountries (ori) {
      console.log(ori)
      const index = this.fieldsForm.findIndex(el => el.name === 'country_id')
      this.fieldsForm[index].options = this.countries
    },
    setInitialData () {
      this.schema = [
        {label: 'ID', key: 'id', sortable: true},
        {label: 'Nombre', key: 'name', sortable: true},
        {label: 'Código', key: 'code', sortable: true},
        {label: 'Tipo', key: 'organization_type', sortable: true},
        {label: 'WORD_DNI', key: 'employer_identification_number', sortable: true},
        {label: 'País', key: 'country', sortable: true},
        {label: 'Fecha creación', key: 'created_at', sortable: true},
        {label: 'Fecha actualización', key: 'updated_at', sortable: true},
        {label: 'Acciones', key: 'actions', class: 'text-center', style: { width: '10%'}}
      ]
      this.actions = [
        {action: id => this.openUpdateModal(id), icon: 'Edit2Icon', color:'success', text: 'Editar'},
        {
          action: id => this.$router.push({ name: 'details-organizations', params: { id } }), icon: 'FileTextIcon', color: 'success', text: 'Detalles de organizacion'
        },
        { action: id => this.confirmDeleteCarrier(id), icon: 'TrashIcon', color: 'danger', text: 'Eliminar' }]
      this.buttons = [
        { name: 'delete', text: 'Eliminar', color: 'danger',  icon: 'TrashIcon', action: () => this.confirmMultipleOrganizations()}
      ]
    },
    filterList (form) {
      this.filters = {}
      Object.keys(form).map(key => {
        this.filters[key] = form[key].id || form[key]
      })
      if (this.pagination.page !== 1) this.pagination.page = 1
      else this.getOrganizations()
    },
    cleanFilter (e) {
      this.form = {}
      this.filters = {}
      this.getOrganizations()
    },
    openCreateModal () {
      this.modaltitle = 'Crear organización'
      this.modalForm = {}
      this.$bvModal.show('modalOrganization')
    },
    getAllInitialData () {
      const arrServices = []
      if (this.$ability.can('GET', 'organizations') || this.$ability.can('GET', 'organizations.*')) {
        this.getOrganizations()
        this.$store.dispatch('fetchService', { name: 'getOrganizationTypes' })
      } else {
        this.$alert(this.$t('msg-error-permission'))
        return null
      }
    },
    getOrganizations () {
      const queryParams = {
        ...this.filters,
        paginate_by: this.pagination.limit,
        page: this.pagination.page
      }
      /*
      Si el servicio existe con el nombre especificado
      Esta sola llamada hará lo siguiente:
        1.- Actualizará el loading.organizations = true
        2.- Cargará el listado principal con los params y queryParams especificados
        3.- Actualizará el loading.organizations = false
      */
      this.$store.dispatch('fetchService', { name: 'getOrganizations', queryParams })
    },
    openUpdateModal (_id) {
      this.modaltitle = 'Editar organización'
      this.modalForm = this.rows.filter(({ id }) => id === _id)[0]
      this.$bvModal.show('modalOrganization')
    },
    deleteOrganization (id) {
      /*
      Si el servicio existe con el nombre especificado
      Y el reload es el mismo servicio principal de mi modulo
      Esta sola llamada hará lo siguiente:
        1.- Actualizará el loading.organizations = true
        2.- Eliminará la organización
        3.- Mostrará una alerta de exito cuando complete la eliminación
        4.- Cargará el listado principal (reload) con los params y queryParams de la ultima consulta
        5.- Actualizará el loading.organizations = false

        En caso de error, actualizará el loading.organizations = false directamente
      */
      this.$store.dispatch('fetchService', { name: 'deleteOrganization', params: { id }, onSuccess: this.getOrganizations})
    },
    confirmDeleteOrganizations (id) {
      this.$yesno(this.$t('msg-pregunta-eliminar-elemento'), () => this.deleteOrganization(id))
    },
    confirmMultipleOrganizations () {
      this.$yesno(this.$t('msg-pregunta-eliminar-seleccionados'), this.deleteMultipleOrganizations)
    },
    deleteMultipleOrganizations () {
      /*
      Si el servicio existe con el nombre especificado
      Y el reload es el mismo servicio principal de mi modulo
      Esta sola llamada hará lo siguiente:
        1.- Actualizará el loading.organizations = true
        2.- Eliminará las organizaciones
        3.- Mostrará una alerta de exito cuando complete las eliminaciones
        4.- Cargará el listado principal (reload) con los params y queryParams de la ultima consulta
        5.- Actualizará el loading.organizations = false

        En caso de error, actualizará el loading.organizations = false directamente
      */
      const services = this.selectedRows.map(id => ({ name: 'deleteOrganization', params: { id } }))
      this.$store.dispatch('fetchMultipleServices', { services, showPackSuccess: true, onSuccess: this.getOrganizations })
    }
  }
}
</script>

<style lang="scss">
div[class^="organization-button"] {
  top: -3.5rem !important;
  right: 0rem !important;
  position: absolute !important;
  z-index: 9;
}
</style>
