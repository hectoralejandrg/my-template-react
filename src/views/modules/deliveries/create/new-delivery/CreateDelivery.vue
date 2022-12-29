<template>
  <div>
    <div class="mt-2">
      <h4>{{$t('Datos de origen')}}</h4>
      <form-render :disableAll="allowEditForm" class="mb-2" :fields="fields1" :key="`formRenderDelivery1_${keyFormRender1}`" :form.sync="form" ref="formRenderDelivery1" containerButtonsClass="col-sm-12 col-md-3 container-button"></form-render>
    </div>
    <div class="row">
      <div class="col-sm-12 col-md-6 mt-1">
        <h4>{{$t('Datos destinatario')}}</h4>
        <form-render :disableAll="allowEditForm" class="mb-2" :fields="fields2" :key="`formRenderDelivery2_${keyFormRender2}`" :form.sync="form" ref="formRenderDelivery2" containerButtonsClass="col-sm-12 col-md-3 container-button">
          <template #infoPudo>
            <label>Dirección</label>: {{infoPudo}}
          </template>
        </form-render>
      </div>
      <div class="col-sm-12 col-md-6 mt-1">
        <h4>{{$t('Datos de distribución')}}</h4>
        <form-render :disableAll="allowEditForm" class="mb-2" :fields="fields3" :key="`formRenderDelivery3_${keyFormRender3}`" :form.sync="form" ref="formRenderDelivery3" containerButtonsClass="col-sm-12 col-md-3 container-button">
          <template #buttons>
            <b-button
              v-b-tooltip.hover
              :title="$t('Editar bultos')"
              class="col-sm-12 col-md-12 mt-2"
              v-b-modal.modalPackages
              :disabled="isNaN(form.qty) || form.qty <= 0 || !!allowEditForm"
            >
              <span>
                <feather-icon icon="Edit2Icon" /> {{$t('Detalle bultos')}}
              </span>
            </b-button>  
          </template>
        </form-render>
        <div v-show="packagesStatus">
          <table-render id="table-packages" class="pl-2 pr-2 mb-1" :schema="schema" :rows="rows">
          </table-render>
        </div>
        <b-button variant="warning" class="push-right" @click="sendForm" :disabled="!!allowEditForm"><feather-icon icon="PlusIcon" />{{$t(`${currentDelivery ? 'Editar' : 'Crear'} envío`)}}</b-button>
      </div>
    </div>
    <modal-packages :qty.sync="form.qty" @send="loadPackages" :rows.sync="rows"></modal-packages>
  </div>
</template>

<script>
import ModalPackages from './ModalPackages.vue'
import comunas from '@/const-data/comunas.json'
import DeliveryService from '../delivery.service.js'

export default {
  name: 'create-deliveries',
  components: { ModalPackages },
  props: ['carriers', 'allowEditForm', 'currentDelivery'],
  data () {
    return {
      communes: comunas.map(el => ({ ...el, id: el.codigo, text: el.nombre })),
      organizationId: null,
      form: {},
      fields1: [],
      fields2: [],
      fields3: [],
      formFilter: {},
      optionsDistributionType: [
        { id: 'address', text: this.$t('Domicilio') },
        { id: 'pudo', text: this.$t('Punto de retiro') }
      ],
      optionsOrganizations: [],
      optionsShippers: [],
      optionsWarehouse: [],
      optionsPudo: [],
      packages: [],
      schema: [],
      rows: [],
      packagesStatus: false,
      requiredLevels: [],
      countryResp: null,
      levelsResp: null,
      addressType: [{id: 'manual', text: 'Ingresar dirección manualmente'}],
      keyFormRender1: 0,
      keyFormRender2: 0,
      keyFormRender3: 0,
      deliveryService: new DeliveryService(this),
      selectorsLevel: {},
      infoPudo: ''
    }
  },

  watch: {
    carriers () {
      this.fields3[1].options = this.carriers
      this.keyFormRender3++
    },

    allowEditForm () {
      this.changeAllowEditForm()
    },

    currentDelivery () {
      this.form = {
        ...this.currentDelivery.infoDeliveryForm,
        address_type: this.currentDelivery.infoDeliveryForm.autocomplete.geocode_api === 'goglegeocode' ? [] : this.addressType
      }
      if (this.form.distributionType && this.form.distributionType.id === 'pudo') {
        console.log('es pudo')
        this.changeDistributionType('distributionType', this.form.distributionType)
      } else {
        this.changeAddressType('address_type', this.form.address_type)
      }
      this.getBaseData(this.currentDelivery.shipper)
      this.packages = this.currentDelivery.order.packages
      this.packagesStatus = true
      this.parseRows(this.packages)
    } 

  },

  mounted () {
    console.log(this.$options.filters.dbDateToFormat('2021-09-03T12:00:00-04:00', 'D T'))
    this.setInitialData()
  },

  methods: {
    changeAllowEditForm () {
    },
    setInitialData () {
      if (['admin', 'superadmin'].includes(this.$session.get('cas_user').role)) { 
        if (this.currentDelivery) {
          this.organizationId = this.$session.get('cas_user').organization.id
          this.fields1 = [
            { fieldType: 'FieldSelect', name: 'warehouse', label: 'Bodega', containerClass: 'col-sm-12 container-info col-md-3', validation: 'required' }
          ]
        } else {
          this.fields1 = [
            { fieldType: 'FieldSelect', name: 'organization', label: 'Organización', containerClass: 'col-sm-12 container-info col-md-3', change: this.changeOrganization },
            { fieldType: 'FieldSelect', name: 'company', label: 'Empresa', containerClass: 'col-sm-12 container-info col-md-3', change: this.changeShipper,
              searchOnType: {
                fx: this.getShipperOnSearch, nChars: 4, debounce: 300
              }, dependency: 'organization' },
            { fieldType: 'FieldSelect', name: 'warehouse', label: 'Bodega', containerClass: 'col-sm-12 container-info col-md-3', dependency: 'company' }
          ]
          this.getOrganization()
        }
      } else if (this.$session.get('cas_user').role === 'company' || this.$session.get('cas_user').role === 'seller' || this.$session.get('cas_user').role === 'pudo') { // (!!this.$session.get('cas_user').shipper?.id && this.$ability.can('GET', 'shippers.addresses')) {
        this.organizationId = this.$session.get('cas_user').organization.id
        this.getBaseData(this.$session.get('cas_user').shipper)
        this.fields1 = [
          { fieldType: 'FieldSelect', name: 'warehouse', label: 'Bodega', containerClass: 'col-sm-12 container-info col-md-3' }
        ]
      } else if ((this.$session.get('cas_user').role === 'marketplace')) {
        this.organizationId = this.$session.get('cas_user').organization.id
        if (this.currentDelivery) {
          this.getBaseData(this.$session.get('cas_user').shipper)
          this.fields1 = [
            { fieldType: 'FieldSelect', name: 'warehouse', label: 'Bodega', containerClass: 'col-sm-12 container-info col-md-3' }
          ]
        } else {
          this.fields1 = [
            { fieldType: 'FieldSelect', name: 'company', label: 'Empresa', containerClass: 'col-sm-12 container-info col-md-3', change: this.changeShipper,
              searchOnType: {
                fx: this.getShipperOnSearch, nChars: 4, debounce: 300
              } },
            { fieldType: 'FieldSelect', name: 'warehouse', label: 'Bodega', containerClass: 'col-sm-12 container-info col-md-3', dependency: 'company' }
          ]
        }
        this.getShipper(null)
      }
      this.fields2 = [
        { fieldType: 'FieldInput', name: 'name', label: 'Nombre', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required' },
        { fieldType: 'FieldInput', name: 'dni', label: 'Rut', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required' },
        { fieldType: 'FieldInput', name: 'phone', label: 'Celular', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required' },
        { fieldType: 'FieldInput', type: 'email', name: 'email', label: 'E-mail', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required|email' },
        {
          fieldType: 'FieldRadio',
          name: 'distributionType',
          label: 'Tipo de distribución',
          containerClass: 'col-sm-12 col-md-6 container-info',
          validation: 'required',
          align: 'h', change: this.changeDistributionType,
          options: this.optionsDistributionType,
          dependency: 'company'
        },
        { fieldType: 'FieldInput', name: 'zipcode', label: 'Código postal', containerClass: 'col-sm-12 container-info col-md-6', validation: 'required' },
        {fieldType: 'FieldCheckbox', multiple: true, name: 'address_type', containerClass: 'col-sm-12 col-md-8 container-info', options: this.addressType, change: this.changeAddressType },
        // {fieldType: 'FieldAutocomplete', name: 'autocomplete', label: 'Dirección (Calle, número)', containerClass: 'col-sm-12 col-md-12 container-info', validation: 'required', 
        //   dependency: 'company',
        //   // change: this.changeAddress,
        //   searchOnType: { fx: this.searchGoogleAddress, nChar: 3, debounce: 300, allowSearchAsValue: true, persistSearch: true }},
        // { fieldType: 'FieldInput', name: 'street_name', label: 'Calle', containerClass: 'col-sm-12 container-info col-md-6', validation: 'required' },
        // { fieldType: 'FieldInput', name: 'street_number', label: 'Número', containerClass: 'col-sm-12 container-info col-md-6', validation: 'required' },
        { fieldType: 'FieldTextarea', name: 'addressDetail', label: 'Información adicional (Depto., bloque, indicaciones, etc.)', containerClass: 'col-sm-12 container-info' }
        // { fieldType: 'FieldTextarea', name: 'observations', label: 'Observaciones', containerClass: 'col-sm-12 container-info' }
      ]
      this.fields3 = [
        { fieldType: 'FieldInput', name: 'deliverysNumber', label: 'N° de envío', type: 'number', containerClass: 'col-sm-12 container-info', validation: 'required' },
        { fieldType: 'FieldSelect', name: 'carrier', label: 'Carrier', containerClass: 'col-sm-12 container-info col-md-6' },
        { fieldType: 'FieldSelect', name: 'service', label: 'Servicio', containerClass: 'col-sm-12 container-info col-md-6' },
        // { fieldType: 'FieldInput', name: 'weight', label: 'Peso (Kgs)', containerClass: 'col-sm-12 col-md-3 container-info', validation: 'required' },
        // { fieldType: 'FieldInput', name: 'volume', label: 'Volumen', containerClass: 'col-sm-12 col-md-3 container-info', validation: 'required' },
        { fieldType: 'FieldInput', name: 'qty', label: 'N° de bultos', type: 'number', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required' }
        // { fieldType: 'FieldInput', name: 'cost', label: 'Valor producto', containerClass: 'col-sm-12 col-md-3 container-info', validation: 'required' },
        // { fieldType: 'FieldTextarea', name: 'description', label: 'Descripción del producto', containerClass: 'col-sm-12 container-info', validation: 'required' }
      ]
      this.schema = [
        {label: 'Peso (Kgs)', key: 'weight'},
        {label: 'Volumen', key: 'volume'},
        {label: 'Valor producto', key: 'price'},
        {label: 'Ancho', key: 'width'},
        {label: 'Alto', key: 'height'},
        {label: 'Largo', key: 'lenght'},
        {label: 'Descripción', key: 'description'}
      ]
      this.changeAddressType('address_type', [])
      this.form.distributionType = this.optionsDistributionType[0]
      this.changeDistributionType('distributionType', this.form.distributionType)
      if (this.currentDelivery) {
        const index = this.fields2.findIndex(el => el.name === 'distributionType')
        this.fields2[index].dependency = false
      }
      this.keyFormRender1++
      this.keyFormRender2++
      this.keyFormRender3++
    },
    getBaseData (shipper) {
      const arrayServices = [
        { name: 'getLevels', params: { country: shipper.country.code } },
        { name: 'getAddresses', queryParams: {paginate_by: 9999, page: 1}, params: {shipper_id: shipper.id} },
        { name: 'getCountry', queryParams: {}, params: {id: shipper.country.id} },
        { name: 'getCarriersByShipper', queryParams: {}, params: {shipper_id: shipper.id} }
      ]
      this.deliveryService.callMultipleServices(arrayServices, true)
        .then(resp => {
          if (resp?.getCountry) {
            if (this.form.distributionType.id === 'address') this.loadLevels(resp.getCountry.data, resp.getLevels.data)
            this.countryResp = resp.getCountry.data
          }
          if (resp?.getLevels) this.levelsResp = resp.getLevels.data
          if (resp?.getAddresses) this.loadAddresses(resp.getAddresses.data)
          if (resp?.getCarriers) this.loadCarriers(resp.getCarriers)
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-cargar-datos', {code: err}))
        })
    },
    loadLevels (country, levels) {
      const fields = this.fields2.filter(el => el.name.indexOf('level') !== -1)
      // fields.map(f => this.fields2.splice(this.fields.findIndex(el => el.name === f.name), 1))
      this.selectorsLevel = {}
      const index = this.fields2.findIndex(el => el.name === 'autocomplete')
      if (!country?.id) {
        this.fields2[index].dependency = 'company'
        return null
      }
      if (index !== -1) this.fields2[index].dependency = `level${Math.max(...country.required_levels)}`
      const requiredLevels = country.required_levels || []
      const displayLevels = country.display_levels
      this.selectorsLevel = this.$generatePlacesLevels(this.$generateArrayPlacesFromTree(levels.level1), Math.max(...requiredLevels), displayLevels)
      this.requiredLevels = requiredLevels
      this.addPlacesLevelFields(country)
    },
    loadAddresses (addresses) {
      const indexWarehouse = this.fields1.findIndex(el => el.name === 'warehouse')
      this.optionsWarehouse = addresses.map(el => ({...el, text: el.name})).filter(el => el.type === 'warehouse')
      if (indexWarehouse !== -1) {
        this.fields1[indexWarehouse].options = this.optionsWarehouse
        this.keyFormRender1++
      }
      const indexPudo = this.fields2.findIndex(el => el.name === 'pudo')
      this.optionsPudo = addresses.map(el => ({...el, text: el.name})).filter(el => el.type === 'pudo')
      if (indexPudo !== -1) {
        this.fields2[indexPudo].options = this.optionsPudo
        this.keyFormRender2++
      }
      console.log(this.form.destination_code)
      if (this.form.destination_code && this.form.destination_code !== '') {
        this.form.pudo = this.optionsPudo.filter(el => el.code === this.form.destination_code)[0]
        this.changePudo('pudo', this.form.pudo)
      }
    },
    loadCarriers (carriers) {
      const indexCarrier = this.fields3.findIndex(el => el.name === 'carrier')
      this.optionsCarrier = carriers.data.map(el => ({...el, text: el.name})).filter(el => el.type === 'carrier')
      if (indexCarrier !== -1) {
        this.fields3[indexCarrier].options = this.optionsCarrier
        this.keyFormRender3++
      }
    },
    loadPackages (packageForm) {
      this.packages = []
      this.packagesStatus = false
      for (let i = 0; i < packageForm.length; i++) {
        const element = packageForm[i]
        const packagesVar = {
          price: element.price,
          description: element.description,
          weight: element.weight,
          volume: element.volume,
          dimensions: {
            width: element.width,
            height: element.height,
            lenght: element.lenght
          }
        }
        this.packages.push(packagesVar)
      }
      this.packagesStatus = true
      this.parseRows(this.packages)
      setTimeout(() => this.$bvModal.hide('modalPackages'), 200)
    },
    parseRows (packages) {
      this.rows = packages.map(el => {
        return {
          ...el,
          weight: el.weight,
          volume: el.volume,
          price: el.price,
          width: el.dimensions.width,
          height: el.dimensions.height,
          lenght: el.dimensions.lenght,
          description: el.description
        }
      })
    },
    getShipperOnSearch (name) {
      const queryParams = {
        name,
        page: 1,
        paginate_by: 99999
      }
      const params = {
        organization_id: !!this.organizationId ? this.organizationId : this.form.organization?.id || 0
      }
      return this.deliveryService.callService('getShippersByOrganization', queryParams, params)
        .then(resp => {
          return resp.data.map(el => {
            el.text = `${el.id} - ${el.name1} - ${el.name2}`
            return el
          })
        })
    },
    addPlacesLevelFields (country) {
      const texts = this.$i18nImport(`${country.code.toLowerCase()}.es`)[`${country.code.toLowerCase()}.es`]
      let indexSplice = this.fields2.findIndex(el => el.name === 'distributionType') + 1
      const indexDNI = this.fields2.findIndex(el => el.name === 'dni')
      this.fields2[indexDNI].label = texts.WORD_DNI
      this.fields2[indexDNI].placeholder = texts.FORMAT_DNI
      this.fields2[indexDNI].validation = `required|dni:${country.code.toLowerCase()}`
      Object.keys(this.selectorsLevel).map((key, index) => {
        const myField = { fieldType: 'FieldSelect', name: key, label: texts[`Place_${key}`], containerClass: 'col-sm-12 container-info col-md-6', options: this.selectorsLevel[key].sort((a, b) => a.name > b.name ? 1 : -1) }
        if (index !== 0) {
          myField.dependency = Object.keys(this.selectorsLevel)[index - 1]
        }
        if (index !== Object.keys(this.selectorsLevel).length - 1) {
          myField.change = (name, value) => this.changePlaceLevel(name, value, Object.keys(this.selectorsLevel)[index + 1])
        } else {
          myField.change = (name, value) => this.changePlaceLevel(name, value, Object.keys(this.selectorsLevel)[index + 1])
        }
        myField.validation = (country.requiredLevels || []).includes(parseInt(key.split('level')[1])) ? 'required' : ''
        const indexFields = this.fields2.findIndex(el => el.name === myField.name)
        if (indexFields === -1) {
          this.fields2.splice(indexSplice, 0, myField)
        }
        this.form[key] = this.selectorsLevel[key].filter(e => e.text === this.form[`${key}Text`])[0]
        // delete this.form[`${key}Text`]
        indexSplice++
      })
      this.changeAllowEditForm()
    },
    changePlaceLevel (name, value, next) {
      const index = this.fields2.findIndex(el => el.name === next)
      if (next) this.fields2[index].options = value[next].sort((a, b) => a.name > b.name ? 1 : -1)
    },
    getOrganization () {
      const queryParams = {
        simplified: true
      }
      return this.deliveryService.callService('getOrganizations', queryParams)
        .then(resp => {
          const indexOrganization = this.fields1.findIndex(el => el.name === 'organization')
          this.optionsOrganizations = resp.data.map(el => ({...el, text: el.name}))
          if (indexOrganization !== -1) {
            this.fields1[indexOrganization].options = this.optionsOrganizations
            this.keyFormRender1++
          }
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-cargar-datos', {code: err}))
        })
    },
    changeOrganization (name, value) {
      this.form = {
        ...this.form,
        company: '',
        warehouse: '',
        pudo: '',
        carrier: '',
        service: '',
        level1: '',
        level2: '',
        level3: ''
      }
      this.fields2 = this.fields2.filter(el => el.name.indexOf('level'))
      // this.getShipper(value.id)
    },
    getShipper (value) {
      const queryParams = {
        paginate_by: 9999,
        page: 1
      }
      const params = {
        organization_id: !!this.organizationId ? this.organizationId : value
      }
      return this.deliveryService.callService('getShippersByOrganization', queryParams, params)
        .then(resp => {
          const indexShipper = this.fields1.findIndex(el => el.name === 'company')
          this.optionsShippers = resp.data.map(el => ({...el, text: el.name1}))
          if (indexShipper !== -1) {
            this.fields1[indexShipper].options = this.optionsShippers
            this.keyFormRender1++
          }
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-cargar-datos', {code: err}))
        })
    },
    changeShipper (name, value) {
      this.fields2 = this.fields2.filter(el => el.name.indexOf('level'))
      this.form = {
        ...this.form,
        warehouse: '',
        pudo: '',
        carrier: '',
        service: '',
        level1: '',
        level2: '',
        level3: ''
      }
      if (!value?.id) return
      this.getBaseData(value)
    },
    changePudo (name, value) {
      this.infoPudo = `${value.address.full_address}`
      this.keyFormRender2++
    },
    changeDistributionType (name, value) {
      this.fields2 = this.fields2.filter(el => !['pudo'].includes(el.name)).filter(el => el.name.indexOf('level') === -1 && !['street_name', 'street_number', 'zipcode', 'addressDetail', 'address_type', 'autocomplete', 'infoPudo'].includes(el.name))
      const index = this.fields2.findIndex(el => el.name === 'distributionType')
      if (value?.id === 'pudo') {
        if (this.currentDelivery) {
          this.fields2.splice(index + 1, 0, {
            fieldType: 'FieldSelect', name: 'pudo', label: 'Punto de retiro', containerClass: 'col-sm-12 container-info col-md-6', options: this.optionsPudo, change: this.changePudo
          },
          {name: 'infoPudo', useSlot: true, containerClass: 'col-sm-12 container-info mt-2'}) 
        } else {
          this.fields2.splice(index + 1, 0, {
            fieldType: 'FieldSelect', name: 'pudo', label: 'Punto de retiro', containerClass: 'col-sm-12 container-info col-md-6', options: this.optionsPudo, change: this.changePudo, dependency: 'company'
          },
          {name: 'infoPudo', useSlot: true, containerClass: 'col-sm-12 container-info mt-2'})
        }
      } else {
        this.fields2.splice(index + 2, 0, 
          { fieldType: 'FieldInput', name: 'zipcode', label: 'Código postal', containerClass: 'col-sm-12 container-info col-md-6', validation: 'required' },
          {fieldType: 'FieldCheckbox', multiple: true, name: 'address_type', containerClass: 'col-sm-12 col-md-8 container-info', options: this.addressType, change: this.changeAddressType},
          {fieldType: 'FieldAutocomplete', name: 'autocomplete', label: 'Dirección (Calle, número)', containerClass: 'col-sm-12 col-md-12 container-info', validation: 'required', 
            searchOnType: { fx: this.searchGoogleAddress, nChar: 3, debounce: 300, allowSearchAsValue: true, persistSearch: true }},
          { fieldType: 'FieldTextarea', name: 'addressDetail', label: 'Información adicional (Depto., bloque, indicaciones, etc.)', containerClass: 'col-sm-12 container-info col-md-6' }
        )
        this.loadLevels(this.countryResp, this.levelsResp)
        const country = this.$session.get('cas_user').country || {}
        this.addPlacesLevelFields(country)
      }
      this.keyFormRender2++
    },
    validateForm () {
      const value1 = this.$refs.formRenderDelivery1.onlyCheckForm()
      const value2 = this.$refs.formRenderDelivery2.onlyCheckForm() 
      const value3 = this.$refs.formRenderDelivery3.onlyCheckForm()
      if (!this.packagesStatus || !this.form?.qty || this.form.qty <= 0) {
        this.$alert(this.$t('Ingrese el detalle de los bultos'))
        return false
      }      
      return value1 && value2 && value3
    },
    sendForm () {
      if (!this.validateForm()) return
      let queryParams = {
        'origin': {
          'type': this.form.warehouse.type,
          'code': this.form.warehouse.code,
          'address': {
            'street_number': this.form.warehouse.address.street_number,
            'street_name': this.form.warehouse.address.street_name,
            'full_address': this.form.warehouse.address.full_address,
            'information': this.form.warehouse.address.information,
            'level1': this.form.warehouse.address.level1,
            'level2': this.form.warehouse.address.level2,
            'level3': this.form.warehouse.address.level3, 
            'level4': this.form.warehouse.address.level4,
            'zip_code': this.form.warehouse.address.zip_code,
            // 'location': this.form.warehouse.address.location,
            // 'geocode_data': this.form.warehouse.address.geocode_data,
            'geocode_api': this.form.warehouse.address.geocode_api
          },
          'contact': {
            'name': this.form.warehouse.contact.name,
            'dni': this.form.warehouse.contact.dni,
            'phone': this.form.warehouse.contact.phone,
            'email': this.form.warehouse.contact.email
          }
        },
        'order': {
          'type': 'delivery',
          'imported_id': this.form.deliverysNumber,
          'qty': this.form.qty,
          'packages': this.packages
        },
        // 'extra_fields': {
        //   'observations': this.form.observations
        // },
        'carrier': {
          'code': 'PDY',
          'service': 'priority',
          'type': 'parcel',
          'attributes': [],
          'create_in_carrier': false
        }
      }
      if (this.form.distributionType.id === 'pudo') {
        queryParams = {
          ...queryParams,
          'destination': {
            'type': 'pudo',
            'code': this.form.pudo.code,
            'address': {
              'street_number': this.form.pudo.address.street_number,
              'street_name': this.form.pudo.address.street_name,
              'full_address': this.form.pudo.address.full_address,
              'information': this.form.addressDetail,
              'level1': this.form.pudo.address.level1,
              'level2': this.form.pudo.address.level2,
              'level3': this.form.pudo.address.level3, 
              'level4': this.form.pudo.address.level4,
              'zip_code': this.form.pudo.address.zip_code,
              // 'location': this.form.pudo.address.location,
              // 'geocode_data': this.form.pudo.address.geocode_data,
              'geocode_api': this.form.pudo.address.geocode_api
            },
            'contact': {
              'name':this.form.pudo.contact.name,
              'dni': this.form.pudo.contact.dni,
              'phone': this.form.pudo.contact.phone,
              'email': this.form.pudo.contact.email
            }
          }
        }
      } else {
        let full_address = ''
        if ((!this.form.address_type || this.form.address_type.length === 0)) {
          full_address = this.form.autocomplete.formatted_address
        } else {
          full_address = `${this.form.street_name}, ${this.form.street_number}`
          Object.keys(this.selectorsLevel).map((key, index) => {
            full_address += `, ${this.form[key].text}`
          })
          full_address += `, ${this.countryResp.name}`
        }
        queryParams = {
          ...queryParams,
          'destination': {
            'type': 'home',
            'code': '',
            'address': {
              'street_number': (!this.form.address_type || this.form.address_type.length === 0) ? this.form.autocomplete.street_number : this.form.street_number,
              'street_name': (!this.form.address_type || this.form.address_type.length === 0) ? this.form.autocomplete.street_name : this.form.street_name,
              full_address,
              'formatted_address': full_address,
              'information': this.form.addressDetail,
              'level1': this.form.level1?.name || '',
              'level2': this.form.level2?.name || '',
              'level3': this.form.level3?.name || '', 
              'level4': this.form.level4?.name || '',
              'zip_code': this.form.zipcode,
              // 'location': (!this.form.address_type || this.form.address_type.length === 0) ? this.form.autocomplete.location : null,
              // 'geocode_data': (!this.form.address_type || this.form.address_type.length === 0) ? this.form.autocomplete.geocode_data : null,
              'geocode_api': (!this.form.address_type || this.form.address_type.length === 0) && !!this.form.autocomplete.geocode_data && this.form.autocomplete.geocode_data !== '' ? 'goglegeocode' : null
            },
            'contact': {
              'name': this.form.name,
              'dni': this.form.dni,
              'phone': this.form.phone,
              'email': this.form.email
            }
          }
        }
      }
      console.log({...this.form})
      let service = 'postDelivery'
      const params = {
        shipper_id: this.form?.company?.id ? this.form.company.id : this.$session.get('cas_user').shipper.id
      }
      if (this.currentDelivery) {
        service = 'updateDelivery'
        params.shipper_id = this.form.shipper_id
        params.id = this.form.id
      }
      console.log(params, service)
      this.deliveryService.callService(service, queryParams, params)
        .then(resp => {
          if (this.currentDelivery) {
            this.$emit('update:allowEditForm', true)
          } else {
            this.form = {}
            this.rows = []
            this.packages = []
            this.packagesStatus = false
          }
          this.$success(this.$t(this.currentDelivery ? 'Envío editado correctamente' : 'Envío creado correctamente'))
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-guardar', {code: err}))
        })
    },
    changeAddressType (name, value) {
      const index = this.fields2.findIndex(el => el.name === 'address_type') + 1
      this.fields2 = this.fields2.filter(el => !['autocomplete', 'street_name', 'street_number'].includes(el.name))
      if (value.length > 0) {
        this.fields2.splice(index, 0, {
          fieldType: 'FieldInput',
          name: 'street_name',
          label: 'Calle',
          containerClass: 'col-sm-12 col-md-8 container-info',
          validation: 'required'
        }, {
          fieldType: 'FieldInput',
          name: 'street_number',
          label: 'Número',
          containerClass: 'col-sm-12 col-md-4 container-info',
          validation: 'required'
        })
        this.fields2[index].fieldType = 'FieldInput'
      } else {
        this.fields2.splice(index, 0, {
          fieldType: 'FieldAutocomplete',
          name: 'autocomplete',
          label: 'Dirección (Calle, número)',
          containerClass: 'col-sm-12 col-md-12 container-info',
          validation: 'required',
          change: this.changeAddress,
          dependency:  this.countryResp?.id ? `level${Math.max(...this.countryResp.required_levels)}` : 'company',
          searchOnType: { fx: this.searchGoogleAddress, nChar: 3, debounce: 300, allowSearchAsValue: true, persistSearch: true }
        })
      }
    },
    searchGoogleAddress (value) {
      value = this.getFullAddress(value)
      return this.deliveryService.callService('getGoogleAddress', {address: value})
        .then(resp => {
          // return resp.results.map(address => ({...address, id: address.place_id, text: address.formatted_address, name1: address.formatted_address}))
          return resp.results.map((address, index) => {
            const indexStreetName = address.address_components.findIndex(el => el.types.includes('route'))
            const indexStreetNumber = address.address_components.findIndex(el => el.types.includes('street_number'))
            let text = ''
            if (indexStreetName !== -1 || indexStreetNumber !== -1) {
              if (indexStreetName !== -1) {
                text += address.address_components[indexStreetName].long_name
              }
              if (indexStreetName !== -1 && indexStreetNumber !== -1) {
                text += ', '
              }
              if (indexStreetNumber !== -1) {
                text += address.address_components[indexStreetNumber].long_name
              }
            } else {
              text = address.formatted_address
            }
            return {
              id: address.place_id,
              formatted_address: address.formatted_address,
              text,
              name: address.formatted_address,
              geocode_data: address,
              address_id: address.place_id,
              location: address.geometry.location,
              address_components: address.address_components,
              street_name: indexStreetName !== -1 ? address.address_components[indexStreetName].long_name : null,
              street_number: indexStreetNumber !== -1 ? address.address_components[indexStreetNumber].long_name : null
            }
          })
        })
    },
    getFullAddress (value) {
      console.log(this.form)
      let text = `${value}, `
      if (this.countryResp?.id) {
        this.requiredLevels.map(level => {
          if (this.form[`level${level}`] && this.form[`level${level}`].id) text += `${this.form[`level${level}`].text}, `
        })
        text += this.countryResp.text || this.countryResp.name
      }
      return text
    }
  }
}
</script>
<style lang="scss"></style>
