<template>
  <div>
    <b-card>
      <div class="shippers-button">
        <b-button
          :disabled="loading.organizations"
          variant="warning"
          class="push-right"
          @click="() => openModalCreateShippers()"
          ><feather-icon icon="PlusIcon" />Crear shipper enviame</b-button
        >
      </div>
      <filter-swapper
        v-if="!loading.first"
        :trigger="selectedRows.length === 0"
        id="shipper_swapper"
        :buttons="buttons"
        :controlHeightButtons="controlHeight"
      >
        <template #slot1>
          <form-render
            :key="keyFormRender"
            :fields="fields"
            :buttonSend="buttonSend"
            class="mb-2"
            :form.sync="formFilter"
            @send="filterList"
            containerButtonsClass="col-sm-12 col-md-3 col-lg-2 mt-2"
          >
            <template #buttons>
              <b-button
                variant="outline-light"
                v-b-tooltip.hover
                title="Limpiar filtros"
                class="ml-2"
                @click="cleanFilter"
                ><feather-icon icon="RefreshCwIcon"
              /></b-button>
            </template>
          </form-render>
        </template>
      </filter-swapper>
      <table-render
        :key="keyTableRender"
        v-if="!loading.first"
        id="table_folders"
        :rows="rows"
        :schema="schema"
        :actions="actions"
        showCheckboxes="true"
        :selectedRows.sync="selectedRows"
        :loading="loading.shippers"
      />
      <pagination
        v-if="!loading.first"
        :pagination="pagination"
        :noDigits="false"
        :showSize="true"
      />
      <b-skeleton
        height="40px"
        width="100%"
        class="mt-2 mb-2 spacing-label-field"
        v-show="loading.first"
      />
      <div class="table-render-skeleton" v-show="loading.first">
        <b-skeleton-table
          :rows="pagination.limit || 10"
          :columns="schema.length || 10"
          :table-props="{}"
        />
      </div>
      <modal-shippers
        v-if="!loading.organizations"
        :countries.sync="countries"
        :organizations.sync="organizations"
        :addresses.sync="addresses"
        @send="saveShippers"
      ></modal-shippers>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ModalShippers from './ModalShippers.vue'
import ShippersService from './shippers.service'

export default {
  name: 'crud-shippers',
  components: { ModalShippers },

  data() {
    return {
      selectedRows: [],
      formFilter: {},
      payloadFilter: {},
      loading: {
        first: true,
        shippers: true,
        organizations: true
      },
      buttons: [],
      rows: [],
      schema: [],
      addresses: [],
      ListSelectShippers: [],
      ListSelectRS: [],
      pagination: { page: 1, limit: 10, total: 0, loading: false },
      controlHeight: { class: 'row mb-2 spacing-label-field' },
      buttonSend: { icon: 'SearchIcon', color: 'warning', title: 'Filtrar' },
      keyFormRender: 0,
      keyTableRender: 0,
      shippersService: new ShippersService(this)
    }
  },

  computed: {
    ...mapGetters({
      countries: 'getCountries',
      organizations: 'getOrganizationsGlobal',
      shippers: 'getShippers',
      generalLoading: 'getLoading'
    })
  },

  watch: {

    generalLoading: {
      handler() {
        this.loading.organizations = !!this.generalLoading.getOrganizationsGlobal
        this.loading.countries = !!this.generalLoading.getCountries
        this.loading.shippers = !!this.generalLoading.getShippers
        if (!this.generalLoading.saveShippers && !this.generalLoading.updateShippers) {
          this.$bvModal.hide('modalShippers')
          this.modalForm = {}
        }
      },
      deep: true
    },
    loading: {
      handler() {
        const prevTotal = this.loading.total
        this.loading.total = !Object.keys(this.loading).filter(key => key !== 'total').every(key => !this.loading[key])
        if (prevTotal !== this.loading.total) this.keyFormRender++
      },
      deep: true
    },
    shippers() {
      this.rows = this.shippers.rows
      this.loading.first = false
      this.selectedRows = []
      this.pagination.total = this.shippers.total
    },
    countries() {
      this.setCountries('watch')
    },
    organizations() {
      this.setOrganizations('watch')
    },

    'pagination.page'() {
      this.getShippers()
    },
    'pagination.limit'() {
      this.getShippers()
    }
  },

  mounted() {
    this.setInitialData()
    this.getAllInitialData()
    if (this.countries && !!this.countries.length) { // Por lo que entendí, esto no deberia ir acá, pero acá es donde funciona, desde el watch no se settea.
      this.setCountries('mounted')
    }
    if (this.organizations && !!this.organizations.length) {
      this.setOrganizations('mounted')
    }
  },

  methods: {
    setInitialData() {
      if (['admin', 'superadmin'].includes(this.$session.get('cas_user').role)) {
        this.fields = [
          { fieldType: 'FieldInput', name: 'name', label: 'Nombre', containerClass: 'col-sm-12 container-info col-md-2' },
          { fieldType: 'FieldSelect', name: 'organization_id', label: 'Organización', containerClass: 'col-sm-12 container-info col-md-2' },
          { fieldType: 'FieldSelect', name: 'country_id', label: 'Pais', containerClass: 'col-sm-12 container-info col-md-2' }
        ]
      } else {
        this.fields = [
          { fieldType: 'FieldInput', name: 'name', label: 'Nombre', containerClass: 'col-sm-12 container-info col-md-3' },
          { fieldType: 'FieldInput', name: 'code', label: 'Codigo', containerClass: 'col-sm-12 container-info col-md-3' }
        ]
      }
      this.schema = [
        { label: 'Id', sortable: true, key: 'id' },
        { label: 'Nombre', sortable: true, key: 'name1' },
        { label: 'Razon social', sortable: true, key: 'name2' },
        { label: 'Organización', sortable: true, key: 'organization_name' },
        { label: 'País', sortable: true, key: 'country_name' },
        { label: 'Código', sortable: true, key: 'code' },
        { label: 'Acciones', key: 'actions', class: ['text-center'] }
      ]
      this.actions = [
        { action: id => this.$router.push({ name: 'shippers-edit', params: { id, breadcrumb: { id } } }), icon: 'Edit2Icon', color: 'success', text: 'Editar Compañía' },
        { action: id => this.confirmDeleteShipper(id), icon: 'TrashIcon', color: 'danger', text: 'Eliminar' }
      ]
      this.buttons = [{ name: 'delete', text: 'Eliminar', color: 'danger', icon: 'TrashIcon', action: this.confirmDeleteMultipleShippers }]
    },

    filterList(form) {
      this.payloadFilter = {}
      Object.keys(form).map(key => {
        this.payloadFilter[key] = form[key].id || form[key]
      })
      if (this.pagination.page !== 1) this.pagination.page = 1
      else this.getShippers()
    },

    cleanFilter() {
      this.formFilter = {}
      this.keyFormRender++
      this.filterList(this.formFilter)
    },

    openModalCreateShippers() {
      this.$bvModal.show('modalShippers')
    },

    getAllInitialData() {
      const arrServices = []
      if (['admin', 'superadmin'].includes(this.$session.get('cas_user').role)) {
        this.getShippers()
      } else {
        this.$alert(this.$t('msg-error-permission'))
        return null
      }
    },

    getShippers() {
      this.selectedRows = []
      this.loading.shippers = true
      const queryParams = {
        page: this.pagination.page,
        paginate_by: this.pagination.limit,
        ...this.payloadFilter
      }
      this.$store.dispatch('fetchService', { name: 'getShippers', queryParams })
    },

    setCountries() {
      const index = this.fields.findIndex(el => el.name === 'country_id')
      if (index !== -1) this.fields[index].options = this.countries
    },

    setOrganizations() {
      const index = this.fields.findIndex(el => el.name === 'organization_id')
      if (index !== -1) this.fields[index].options = this.organizations
    },

    confirmDeleteShipper(_id) {
      this.$yesno(this.$t('msg-pregunta-eliminar-seleccionados'), () => this.deleteShipper(_id))
    },

    deleteShipper(id, showAlerts = true) {

    },

    confirmDeleteMultipleShippers() {
      this.$yesno(this.$t('msg-pregunta-eliminar-seleccionados'), this.deleteMultipleShippers)
    },

    deleteMultipleShippers() {
      const services = this.selectedRows.map(id => ({ name: 'deleteShippers', params: { shipper_id: id } }))
      this.$store.dispatch('fetchMultipleServices', { services, showPackSuccess: true, onSuccess: this.getShippers })
    },

    saveShippers(data) {
      this.loading.shippers = true
      this.shippersService.callService('saveShippers', data.shipper)
        .then(response => {
          console.log(response)
          data.id = response.data.id
          this.saveAddress(data)
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-guardar', { code: err }))
        })
        .finally(_ => {
          this.loading.shippers = false
        })
    },

    saveAddress(data) {
      const params = { shipper_id: data.id }
      console.log(params)
      this.shippersService.callService('saveAddressShipper', data.form, params)
        .then(resp => {
          this.updateShipperAddress(data.id, resp.data.id)
        })
        .catch(err => {
          this.deleteShipper(data.id, false)
          console.error(err)
          this.$alert(this.$t('msg-problema-guardar', { code: err }))
        })
    },
    updateShipperAddress(shipper_id, address_id) {
      this.shippersService.callService('updateShippers', { address_id }, { shipper_id })
        .then(resp => {
          this.$bvModal.hide('modalShippers')
          this.getShippers()
          this.$success(this.$t('msg-exito-guardar'))
        })
        .catch(err => {
          console.error(err)
          this.deleteShipper(shipper_id, false)
          this.$alert(this.$t('msg-problema-guardar', { code: err }))
        })
    }
  }
}
</script>

<style lang="scss">
.shippers-button {
  top: -3.5rem !important;
  right: 0rem !important;
  position: absolute !important;
  z-index: 9;
}
</style>
