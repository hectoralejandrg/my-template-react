<template>
  <div>
      <div class="admin-address-button">
        <b-button variant="warning" class="push-right" @click="openModal" :disabled="loading.first"><feather-icon icon="PlusIcon"/> {{$t('Crear dirección')}}</b-button>
      </div>
      <filter-swapper v-if="!loading.first" :trigger="selectedRows.length === 0" id="addresses_swapper" :buttons="buttons" :controlHeightButtons="controlHeight">
        <template #slot1>
          <form-render v-if="fields.length > 0" id="formRenderFilterAddresses" :key="keyFormRender" class="mb-2" :fields="fields" :buttonSend="buttonSend" :form.sync="formFilter" @send="filterList"
            containerButtonsClass="col-sm-12 col-md-2 mt-2">
            <template #buttons>
              <b-button variant="outline-light" class="ml-2" v-b-tooltip.hover title="Limpiar filtros" @click="cleanFilter"><feather-icon icon="RefreshCwIcon"/></b-button>  
            </template>
          </form-render>
        </template>
      </filter-swapper>
      <table-render :key="keyTableRender" v-if="!loading.second && showTable" id="address" :rows="rows" :schema="schema" :actions="actions" :showCheckboxes="true"
        :selectedRows.sync="selectedRows" :loading="loading.addresses">
          <template #contact="scope">
            <a v-b-tooltip.hover.html="$generateTooltipPerson(scope.rowdata.contact)" class="lnk lnk-primary" >{{scope.rowdata.contact.name || ''}}</a>
          </template>
      </table-render>
      <pagination v-if="!loading.second && showTable" :pagination="pagination" :noDigits="true" :showSize="true"/>
      <b-skeleton height="40px" width="100%" class="mt-2 mb-2" v-show="loading.first"/>
      <div class="table-render-skeleton" v-show="loading.second">
        <b-skeleton-table
          :rows="pagination.limit || 10"
          :columns="schema.length || 10"
          :table-props="{ }"/>
      </div>
    <modal-address v-if="!loading.first" ref="modalAddress"
      :address.sync="currentAddress" @send="saveAddress"
      :addressesTypes="optionsAddressTypes"
      :ownerTypes="optionsOwnerTypes"
      :countries="optionsCountries"
      :owner="owner" :addressType="addressType"
      ></modal-address>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ModalAddress from './ModalAddress.vue'
import AddressesService from './addresses.service'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { getHomeRouteForLoggedInAddress } from '@/auth/utils'
import useJwt from '@/auth/jwt/useJwt'
import Cookies from 'js-cookie'

export default {
  name: 'generic-addresses',
  props: ['addressType'],
  components: { ModalAddress },
  data () {
    return {
      buttons: [],
      controlHeight: { class: 'row mb-2 spacing-label-field'},
      selectedRows: [],
      schema: [],
      actions: [],
      rows: [],
      currentDocs: [],
      pagination: { page: 1, limit: 10, total: 1, loading: false },
      currentAddress: {},
      companies: [],
      optionsOwnerTypes: [],
      buttonSend: {icon: 'SearchIcon', color: 'warning', title: 'Filtrar'},
      fields: [],
      formFilter: {},
      payloadFilter: {},
      loading: {
        first: true,
        second: false,
        addresses: true
      },
      showTable: true,
      keyTableRender: 0,
      keyFormRender: 0,
      booleanList: ['hasPermissions', 'status'],
      optionsAddressTypes: [],
      optionsCountries: [],
      addressesService: new AddressesService(this)
    }
  },
  watch: {
    'pagination.page' () {
      this.getAllAddresses()
    },
    'pagination.limit' () {
      this.getAllAddresses()
    }
  },
  computed: {
    ...mapGetters({
      globalData: 'getGlobalData'
    })
  },
  mounted () {
    console.log(this.owner)
    this.setInitialData()
    this.buttons = [
      { name: 'delete', text: 'Eliminar', color: 'danger',  icon: 'TrashIcon', action: this.confirmDeleteMultipleAddress}
    ]
  },
  methods: {
    setInitialData () {
      this.schema = [
        {label: 'Código', sortable: true, key: 'code', class: ['w-10']},
        {label: 'Nombre', sortable: true, key: 'name'},
        {label: 'Código', sortable: true, key: 'code'},
        {label: 'Dirección', sortable: true, key: 'address_full_address'},
        {key: 'replace'},
        {label: 'Contacto', sortable: true, key: 'contact', useSlot: true},
        {label: 'Tipo', sortable: true, key: 'type'},
        {label: 'Dueño', sortable: true, key: 'owner'},
        {label: 'Acciones', key: 'actions', class: ['text-center']}
      ]
      this.addPlacesLevelHeaders()
      this.actions = [
        {action: id => this.openAddress(id), icon: 'Edit2Icon', color: 'success', text: 'Editar'},
        {action: id => this.confirmDeleteAddress(id), icon: 'TrashIcon', color:'danger', text: 'Eliminar'}
      ]
      this.fields = [
        // {fieldType: 'FieldInput', type: 'email', name: 'email', label: 'E-mail'},
      ]
      if (!this.addressType) {
        this.fields.push({fieldType: 'FieldSelect', name: 'type', label: 'Tipo de dirección', containerClass: 'col-sm-12 col-md-3 col-lg-2 container-info' })
      }

      // Añadir selección de tipo de dueño
      if (!this.owner?.type) {
        this.showTable = false
        this.fields.splice(0, 0, 
          {fieldType: 'FieldSelect', name: 'owner_type', label: 'Tipo de dueño', validation: 'required', options: this.optionsOwnerTypes, change: this.changeOwnerType, containerClass: 'col-sm-12 col-md-3 col-lg-2 container-info'},
          {fieldType: 'FieldSelect', name: 'owner_id', label: 'Dueño', validation: 'required', dependency: 'owner_type', change: this.changeOwner, containerClass: 'col-sm-12 col-md-3 col-lg-2 container-info'}
        )

        // this.fields.push({fieldType: 'FieldSelect', name: 'country', label: 'País', containerClass: 'col-sm-12 col-md-3 col-lg-2 container-info' })
      }
      this.fields.push({fieldType: 'FieldInput', name: 'name', label: 'Nombre', containerClass: 'col-sm-12 col-md-3 col-lg-2 container-info', change: this.$validateDNI })

      // this.getDataFirestore()
      this.getAllInitialData()
    },
    changeOwnerType (name, value) {
      if (!value || !value.id) return null
      this.formFilter.type = 'Cargando...'
      this.formFilter.owner_id = 'Cargando...'
      this.addOptionsOwnerId(value)
      this.addOptionsType(value)
    },
    addOptionsOwnerId (value) {
      const index = this.fields.findIndex(el => el.name === 'owner_id')
      const attr = this.addressesService.getAttributesField(value.id)
      if (attr.service) {
        this.addressesService.callService(attr.service, attr.queryParams)
          .then(resp => {
            this.fields[index] = { ...this.fields[index], ...attr, options: this.addressesService.formatSelect(attr.service, resp.data)}
            delete this.fields[index].searchOnType
            this.keyFormRender++
          })
          .finally(_ => {
            delete this.formFilter.owner_id
          })
      } else {
        delete this.formFilter.owner_id
        this.fields[index] = {...this.fields[index], ...attr}
        this.keyFormRender++
      }
    },
    addOptionsType (value) {
      const index = this.fields.findIndex(el => el.name === 'type')
      this.addressesService.callService('getAddressesTypes', {owner_type: value.id})
        .then(resp => {
          this.fields[index] = { ...this.fields[index], options: resp.data.address_types.map(el => ({id: el, text: el}))}
          this.keyFormRender++
        })
        .finally(_ => {
          this.formFilter.type = null
        })
    },
    changeOwner (name, value) {
      // console.log(value, {...this.formFilter.owner_id})
      // this.showTable = (!value || !value.id)
    },
    addPlacesLevelHeaders () {
      const index = this.schema.findIndex(el => el.key === 'replace')
      const newHeaders = []
      const requiredLevels = this.$session.get('cas_user').country.required_levels
      requiredLevels.map(rl => {
        newHeaders.push({label: `Place_level${rl}`, key: `address_level${rl}`, sortable: true})
      })
      this.schema.splice(index, 1, ...newHeaders)
    },
    filterList (data) {
      this.payloadFilter = {}
      Object.keys(data).map(key => {
        this.payloadFilter[key] = data[key].id || data[key]
      })
      if (this.pagination.page !== 1) this.pagination.page = 1
      else {
        this.loading.second = true
        this.getAllAddresses()
      }
    },
    cleanFilter () {
      this.formFilter = {}
      this.keyFormRender++
      
      if (['admin', 'superadmin'].includes(this.$session.get('cas_user').role) && !this.owner?.type) this.showTable = false // this.$ability.can('GET', 'shippers.addresses')
      else this.filterList(this.formFilter)
    },
    openAddress (_id) {
      this.currentAddress = this.rows.filter(({id}) => id === _id)[0]
      console.log(this.currentAddress)
      this.$bvModal.show('modalAddress')
    },
    openModal () {
      this.currentAddress = {}
      this.$bvModal.show('modalAddress')
    },
    saveAddress (data) {
      this.loading.addresses = true
      this.$refs.modalAddress.loading.main = true
      const params = { shipper_id: data.owner.id }
      const service = this.getServiceData(data)
      if (data.id) params.id = data.id
      this.addressesService.callService(service, data.form, params)
        .then(resp => {
          this.$bvModal.hide('modalAddress')
          if (data.id || (this.owner?.type && this.owner?.id) || (this.formFilter?.owner_type?.id && this.formFilter?.owner_id?.id)) this.getAllAddresses()
          this.$success(this.$t(data.id ? 'msg-exito-actualizar' : 'msg-exito-guardar'))
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-guardar', {code: err}))
        })
        .finally(_ => {
          this.loading.addresses = false
          this.$refs.modalAddress.loading.main = false
        })
    },
    getServiceData (data) {
      let service = 'Address'
      if (!data.id) service = `save${service}`
      else service = `update${service}`
      return this.getTypeOwnerService(data.owner.type, service)
    },
    getTypeOwnerService (owner, service) {
      switch (owner) {
      case 'shipper': 
        return `${service}Shipper`
      case 'carrier': 
        return `${service}Carrier`
      default:
        return service
      }
    },
    getAllInitialData () {
      this.loading.addresses = true
      this.selectedRows = []

      const services = [
        { name: 'getCountries' }
      ]
      if (!this.addressType) {
        const queryParams = {}
        if (this.owner?.type) {
          queryParams.owner_type = this.owner.type
        }
        services.push({ name: 'getAddressesTypes', queryParams })
      }
      if (!this.owner?.type) {
        services.push({ name: 'getOwnerTypes' })
      }
      if (this.owner?.id && this.owner?.type) {
        const queryParams = {
          page: this.pagination.page,
          paginate_by: this.pagination.limit,
          ...this.payloadFilter
        }
        const params = { }
        if (this.owner?.type === 'shipper') params.shipper_id = this.owner?.id
        if (this.owner?.type === 'carrier') params.carrier_id = this.owner?.id
        if (this.addressType) {
          queryParams.type = this.addressType
        }
        services.push({ name: 'getAllAddressesShipper', queryParams, params, id: 'getAllAddresses'})
      }
      // if (this.$ability.can('GET', 'shippers.addresses')) services.splice(0, 1)
      this.addressesService.callMultipleServices(services, true)
        .then(response => {
          if (response.getCountries) {
            this.optionsCountries = response.getCountries.data.map(el => ({...el, text: el.name}))
            const indexCountry = this.fields.findIndex(el => el.name === 'country')
            if (indexCountry !== -1) this.fields[indexCountry].options = this.optionsCountries
          }
          if (response.getAllAddresses) {
            this.rows = this.parseAddressesRows(response.getAllAddresses.data)
            this.pagination.total = (response.getAllAddresses.data.page * this.pagination.limit) + 1
            if (this.rows.length < this.pagination.limit) this.pagination.total--
          }
          if (response.getAddressesTypes) {
            this.optionsAddressTypes = response.getAddressesTypes.data.address_types.map(el => ({id: el, text: el}))
            const indexType = this.fields.findIndex(el => el.name === 'type')
            if (indexType !== -1) this.fields[indexType].options = this.optionsAddressTypes
          }
          if (response.getOwnerTypes) {
            this.optionsOwnerTypes = response.getOwnerTypes.data.owner_types.map(el => ({id: el, text: el}))
            const indexOwnerType = this.fields.findIndex(el => el.name === 'owner_type')
            if (indexOwnerType !== -1) this.fields[indexOwnerType].options = this.optionsOwnerTypes
          }
          this.keyFormRender++
        })
        .catch(err => {
          this.$alert(this.$t('msg-problema-cargar-datos', {code: err}))
          console.error(err)
        })
        .finally(end => {
          this.loading.first = false
          this.loading.addresses = false
        })
    },
    parseAddressesRows (rows) {
      
      return rows.map(row => {
        Object.keys(row.address).map(el => {
          row[`address_${el}`] = row.address[el]
        })
        row.owner = `${row.owner_type} ${row.owner_id}`
        row.address_full_address = `${row.address.street_name} ${row.address.street_number}`
        return row
      })
    },
    getAllAddresses () {
      this.loading.addresses = true
      this.selectedRows = []
      const queryParams = {
        page: this.pagination.page,
        paginate_by: this.pagination.limit,
        ...this.payloadFilter
      }
      const params = { }
      const ownerType = this.owner?.type || this.formFilter?.owner_type?.id
      const ownerId = this.owner?.id || this.formFilter?.owner_id?.id
      const service = this.getTypeOwnerService(ownerType, 'getAllAddresses')
      if (this.addressType) {
        queryParams.type = this.addressType
      }
      params[`${ownerType}_id`] = ownerId
      this.showTable = true
      this.addressesService.callService(service, queryParams, params)
        .then(response => {
          if (response.data) {
            this.rows = []
            this.rows = this.parseAddressesRows(response.data)
            this.pagination.total = (response.data.page * this.pagination.limit) + 1
            if (this.rows.length < this.pagination.limit) this.pagination.total--
            this.loading.addresses = false
            this.loading.first = false
            this.loading.second = false
          }
        })
        .catch(err => {
          this.$alert(this.$t('msg-problema-cargar-datos', {code: err}))
          console.error(err)
        })
        .finally(end => {
        })
    },
    confirmDeleteAddress (_id) {
      this.$yesno(this.$t('msg-pregunta-eliminar-elemento'), () => this.deleteAddress(_id))
    },
    deleteAddress (id) {
      this.loading.addresses = true
      const address = this.rows.filter(el => el.id === id)[0]
      const service = this.getTypeOwnerService(address.owner_type, 'deleteAddress')
      const params = { id: address.id }
      params[`${address.owner_type}_id`] = address.owner_id
      this.addressesService.callService(service, null, params)
        .then(response => {
          this.selectedRows = []
          this.pagination.page = 1
          this.$t('msg-exito-eliminar-seleccionados')
          this.getAllAddresses()
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-eliminar-elemento'))
        })
        .finally(end => {
          this.loading.addresses = false
        })
    },
    confirmDeleteMultipleAddress () {
      this.$yesno(this.$t('msg-pregunta-eliminar-seleccionados'), this.deleteMultipleAddress)
    },
    deleteMultipleAddress () {
      this.loading.addresses = true
      const services = []
      this.selectedRows.map(id => {
        const address = this.rows.filter(el => el.id === id)[0]
        const service = this.getTypeOwnerService(address.owner_type, 'deleteAddress')
        const params = { id: address.id }
        params[`${address.owner_type}_id`] = address.owner_id
        services.push({name: service, params})
      })
      this.addressesService.callMultipleServices(services)
        .then(resp => {
          this.selectedRows = []
          this.pagination.page = 1
          this.$t('msg-exito-eliminar-seleccionados')
          this.getAllAddresses()
        })
        .catch(err => {
          this.$t('msg-problema-eliminar-seleccionados')
          console.error(err)
        })
        .finally(end => {
          this.loading.addresses = false
        })
    }
  }
}
</script>
<style lang='scss'>
  
.admin-address-button {
  top: -3.5rem !important;
  right: 0rem !important;
  position: absolute !important;
  z-index: 9;
}
</style>