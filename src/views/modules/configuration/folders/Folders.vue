<template>
  <div>
    <b-card>
      <div class="folders-button">
        <b-button :disabled="loading.organizations" variant="warning" class="push-right" @click="() => openModalCreateFolder()" ><feather-icon icon="PlusIcon"/> Crear folder envíame</b-button> <!-- :disabled="loading.total" -->
      </div>
      <filter-swapper v-if="!loading.first" :trigger="selectedRows.length === 0" id="folders_swapper" :buttons="buttons" :controlHeightButtons="controlHeight">
        <template #slot1>
          <form-render :key="keyFormRender" class="mb-2" :fields="fields" :buttonSend="buttonSend" :form.sync="formFilter" @send="filterList"
          containerButtonsClass="col-sm-12 col-md-3 col-lg-6 mt-2">
            <template #buttons>
              <b-button variant="outline-light" v-b-tooltip.hover title="Limpiar filtros" class="ml-2" @click="cleanFilter"><feather-icon icon="RefreshCwIcon"/></b-button>
            </template>
          </form-render>
        </template>
      </filter-swapper>
      <table-render :key="keyTableRender" v-if="!loading.first" id="table_folders" :rows="rows" :schema="schema" :actions="actions" showCheckboxes="true" :selectedRows.sync="selectedRows" :loading="loading.folders" />
      <pagination v-if="!loading.first" :pagination="pagination" :noDigits="false" :showSize="true" />
      <b-skeleton height="40px" width="100%" class="mt-2 mb-2 spacing-label-field" v-show="loading.first" />
      <div class="table-render-skeleton" v-show="loading.first">
        <b-skeleton-table :rows="pagination.limit || 10" :columns="schema.length || 10" :table-props="{}" />
      </div>
    </b-card>
    <modal-folder v-if="!loading.organizations" :form="modalForm" :title="modaltitle"></modal-folder>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FoldersService from './folders.service'
import modalFolder from './ModalFolder.vue'

export default {
  name: 'crud-folders',
  components: {modalFolder},

  data() {
    return {
      buttons: [],
      controlHeight: { class: 'row mb-2 spacing-label-field' },
      schema: [],
      selectedRows: [],
      actions: [],
      rows: [],
      formFilter: {},
      modaltitle: '',
      modalForm: {},
      filters: {},
      currentFolder: {},
      pagination: { page: 1, limit: 10, total: 100, loading: false },
      buttonSend: { icon: 'SearchIcon', color: 'warning', title: 'Filtrar' },
      loading: {
        first: true,
        organizations: true,
        folders: true,
        total: true
      },
      keyTableRender: 0,
      keyFormRender: 0,
      foldersService: new FoldersService(this)
    }
  },

  setup () {
    const fields = [
      { fieldType: 'FieldInput', name: 'name', label: 'Nombre', containerClass: 'col-sm-12 container-info col-md-2' },
      { fieldType: 'FieldInput', name: 'code', label: 'Código', containerClass: 'col-sm-12 container-info col-md-2' },
      { fieldType: 'FieldSelect', name: 'organization_id', label: 'Organización', containerClass: 'col-sm-12 container-info col-md-2' }
    ]
    return { fields }
  },

  computed: {
    ...mapGetters({
      folders: 'getFolders',
      organizations: 'getOrganizationsGlobal',
      generalLoading: 'getLoading'
    })
  },

  mounted() {
    if (this.organizations && !!this.organizations.length) {
      this.setOrganizations('mounted')
    }
    this.setInitialData()
    this.getAllInitialData()
  },

  watch: {

    generalLoading: {
      handler () {
        this.loading.organizations = !!this.generalLoading.getOrganizationsGlobal
        this.loading.folders = !!this.generalLoading.getFolders
        if (!this.generalLoading.saveFolder && !this.generalLoading.updateFolder) {
          this.$bvModal.hide('modalFolder')
          this.modalForm = {}
        }
      },
      deep: true
    },
    loading: {
      handler () {
        const prevTotal = this.loading.total
        this.loading.total = !Object.keys(this.loading).filter(key => key !== 'total').every(key => !this.loading[key])
        if (prevTotal !== this.loading.total) this.keyFormRender++
      },
      deep: true
    },

    folders () {
      this.rows = this.folders.rows
      this.loading.first = false
      this.pagination.total = this.folders.total
      this.selectedRows = []
    },

    organizations () { 
      this.setOrganizations('watch')
    },

    'pagination.page' () {
      this.getFolders()
    },
    'pagination.limit' () {
      this.getFolders()
    }
  },

  methods: {

    setInitialData () {
      this.schema = [
        { label: 'Id', sortable: true, key: 'id' },
        { label: 'Folder', sortable: true, key: 'folder_name' },
        { label: 'Código', sortable: true, key: 'code' },
        { label: 'Organización', sortable: true, key: 'organization_name' },
        { label: 'Acciones', key: 'actions', class: ['text-center'] }
      ]
      this.actions = [
        { action: id => this.openModalEditFolder(id), icon: 'Edit2Icon', color: 'success', text: 'Editar' },
        { action: id => this.confirmFolderDelete(id), icon: 'TrashIcon', color: 'danger', text: 'Eliminar' }
      ]
      this.buttons = [{ name: 'delete', text: 'Eliminar', color: 'danger', icon: 'TrashIcon', action: this.confirmMultipleFolders }]
    },

    setOrganizations (ori) {
      const index = this.fields.findIndex(el => el.name === 'organization_id')
      this.fields[index].options = this.organizations
    },

    filterList (data) {
      this.filters = {}
      Object.keys(data).map(key => {
        this.filters[key] = data[key].id || data[key]
      })
      if (this.pagination.page !== 1) this.pagination.page = 1
      else this.getFolders()
    },

    cleanFilter () {
      this.formFilter = {}
      this.keyFormRender++
      this.filterList(this.formFilter)
    },

    getAllInitialData () {
      const arrServices = []
      if (['admin', 'superadmin'].includes(this.$session.get('cas_user').role)) {
        this.getFolders()
      } else {
        this.$alert(this.$t('msg-error-permission'))
        return null
      }
    },

    getFolders () {
      const queryParams = {
        ...this.filters,
        paginate_by: this.pagination.limit,
        page: this.pagination.page
      }
      this.$store.dispatch('fetchService', { name: 'getFolders', queryParams })
    },

    confirmMultipleFolders () {
      this.$yesno(this.$t('msg-pregunta-eliminar-seleccionados'), this.deleteMultipleFolders)
    },

    deleteMultipleFolders () {
      const services = this.selectedRows.map(id => ({ name: 'deleteFolders', params: { folder_id: id } }))
      this.$store.dispatch('fetchMultipleServices', { services, showPackSuccess: true, onSuccess: this.getFolders })
    },

    confirmFolderDelete (_id) {
      this.$yesno(this.$t('msg-pregunta-eliminar-elemento'), () => this.deleteFolder(_id))
    },

    deleteFolder (id) {
      this.$store.dispatch('fetchService', { name: 'deleteFolder', params: { folder_id: id }, onSuccess: this.getFolders })
    },
    
    openModalCreateFolder () {
      this.modaltitle = 'Crear folder'
      this.modalForm = {}
      this.$bvModal.show('modalFolder')
    },

    openModalEditFolder (_id) {
      this.modaltitle = 'Editar folder'
      this.modalForm = this.rows.filter(({id}) => id === _id)[0]
      this.$bvModal.show('modalFolder')
    }
  }
}
</script>

<style lang="scss">
  .folders-button {
    top: -3.5rem !important;
    right: 0rem !important;
    position: absolute !important;
    z-index: 9;
  }
</style>