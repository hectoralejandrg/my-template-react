<template>
  <div>
    <form-render :fields="fields" :form.sync="form" :key="keyFormRender" ref="formRenderShipper" @send="saveDataShipper" class="col-sm-12 col-md-8" 
    :buttonSend="buttonSend" containerButtonsClass="col-sm-12 pt-2">
      <template #company_info>
        <h5>{{$t('Datos de la empresa')}}</h5>
      </template>
      <template #direction_info>
        <h5>{{$t('Dirección de facturación')}}</h5>
      </template>
      <template #billing_info>
        <h5>{{$t('Datos de contacto')}}</h5>
      </template>
      <template #config_company>
        <h5>{{$t('Configuraciones de compañia')}}</h5>
      </template>
    </form-render>
  </div>
</template>
<script>
import ShippersService from '../../shippers.service'
import { mapGetters } from 'vuex'
export default {
  name: 'shipper-info',

  data() {
    return {
      fields: [],
      buttonSend: {icon: 'EditIcon', color: 'warning', text: 'Editar compañía'},
      form: {},
      keyFormRender: 0,
      optionState: [{id: 1, text: this.$t('Activo')}, {id: 2, text: this.$t('Inactivo')}],
      optionPurchaseOrder: [{id: 1, text: this.$t('Si')}, {id: 2, text: this.$t('No')}],
      cyberCheckBox: [{ id: 1, text: 'Mostrar formulario Cyber'}],
      invoicesCheckBox: [{ id: 1, text: 'Mostrar facturas'}],
      addressType: [{id: 'manual', text: 'Ingresar dirección manualmente'}],
      rulesList: [
        { id: 1, text: 'Regla 1'},
        { id: 2, text: 'Regla 2'},
        { id: 3, text: 'Regla 3'}
      ],
      loading: {
        first: true,
        organizations: true,
        shipper: true,
        countries: true,
        users: false,
        total: true,
        main: true,
        levels: true
      },
      shippersService: new ShippersService
    }
  },

  computed: {
    ...mapGetters({
      organizations: 'getOrganizations',
      countries: 'getCountries',
      shipper: 'getShipper',
      generalLoading: 'getLoading'
    })
  },

  watch: {
    shipper () {
      this.form = {
        ...this.shipper,
        address_type: this.shipper.autocomplete?.id ? [] : this.addressType,
        rule_id: (this.shipper.rule_id === 0) ? { id: 0, text: 'Sin regla asignada'} : this.rulesList.filter(rule => rule.id === this.shipper.rule_id)[0],
        show_cyber_form: this.shipper.show_cyber_form ? [{ id: 1, text: 'Mostrar formulario Cyber'}] : [],
        show_invoices: this.shipper.show_invoices ? [{ id: 1, text: 'Mostrar facturas'}] : [],
        need_purchase_order: [{id: 1, text: this.$t('Si')}, {id: 2, text: this.$t('No')}].filter(option => (option.id === 1) === this.shipper.need_purchase_order)[0],
        activated: [{id: 1, text: this.$t('Activo')}, {id: 2, text: this.$t('Inactivo')}].filter(option => (option.id === 1) === this.shipper.activated)[0]
      }
      this.setCountryShipper()
      // this.setOrganizationShipper()
    },
    countries () {
      this.setCountries('watch')
      this.setCountryShipper()
    },
    organizations () {
      this.setOrganizations('watch')
      // this.setOrganizationShipper()
    },
    generalLoading: {
      handler () {
        this.loading.shipper = !!this.generalLoading.getShipper
        this.loading.organizations = !!this.generalLoading.getOrganizations
        this.loading.countries = !!this.generalLoading.getCountries
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
    }
  },

  mounted() {
    this.setInitialData()
  },

  methods: {
    setInitialData() {
      this.fields = [
        {name: 'company_info', useSlot: true, containerClass: 'col-sm-12 container-info pt-1'},
        {fieldType: 'FieldInput', name: 'id', label: 'ID', containerClass: 'col-sm-12 col-md-1 container-info', validation: 'required', disabled: true},
        {fieldType: 'FieldSelect', name: 'organization', label: 'Organización', containerClass: 'col-sm-12 col-md-5 container-info', disabled: true},
        {fieldType: 'FieldInput', name: 'name1', label: 'Nombre empresa', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required', disabled: true},
        {fieldType: 'FieldInput', name: 'name2', label: 'Razon social', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required', disabled: true},
        {fieldType: 'FieldInput', name: 'business_activity', label: 'Giro', containerClass: 'col-sm-12 col-md-6 container-info', disabled: false},
        {fieldType: 'FieldInput', name: 'code', label: 'Codigo empresa', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required'},
        {fieldType: 'FieldInput', name: 'webpage', label: 'Sitio web', containerClass: 'col-sm-12 col-md-6 container-info'},
        {name: 'direction_info', useSlot: true, containerClass: 'col-sm-12 container-info pt-1 border-top mt-1'},
        {fieldType: 'FieldSelect', name: 'country', label: 'País', containerClass: 'col-sm-12 col-md-6 container-info', disabled: true, change: this.changeCountry},
        {fieldType: 'FieldInput', name: 'zip_code', label: 'Codigo postal', containerClass: 'col-sm-12 col-md-6 container-info'},
        {fieldType: 'FieldCheckbox', multiple: true, name: 'address_type', containerClass: 'col-sm-12 col-md-12 container-info', options: this.addressType, change: this.changeAddressType},
        {fieldType: 'FieldAutocomplete', name: 'autocomplete', label: 'Dirección (Calle, número)', containerClass: 'col-sm-12 col-md-12 container-info', validation: 'required', 
          dependency: 'country',
          // change: this.changeAddress,
          searchOnType: { fx: this.searchGoogleAddress, nChar: 3, debounce: 300, allowSearchAsValue: true, persistSearch: true }},
        {fieldType: 'FieldTextarea', name: 'information', label: 'Informacion adicional', containerClass: 'col-sm-12 col-md-12 container-info'},
        {fieldType: 'FieldRadio', name: 'need_purchase_order', label: '¿Necesita orden de compra?', containerClass: 'col-sm-12 col-md-6 container-info', align: 'h', options: this.optionPurchaseOrder},
        {name: 'billing_info', useSlot: true, containerClass: 'col-sm-12 container-info pt-1 border-top mt-1'},
        {fieldType: 'FieldInput', name: 'contact_dni', label: 'WORD_DNI', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required|dni:country'},
        {fieldType: 'FieldInput', name: 'contact_name', label: 'Nombre de contacto', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required'},
        {fieldType: 'FieldInput', type: 'email', name: 'contact_email', label: 'Email de contacto', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required|email'},
        {fieldType: 'FieldInput', name: 'contact_phone', label: 'Telefono de contacto', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required'},
        {name: 'config_company', useSlot: true, containerClass: 'col-sm-12 container-info pt-1 border-top mt-1'},
        {fieldType: 'FieldInput', name: 'api_key', label: 'API key', containerClass: 'col-sm-12 col-md-6 container-info'},
        {fieldType: 'FieldRadio', name: 'activated', label: 'Estado', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required', align: 'h', options: this.optionState},
        {fieldType: 'FieldInput', name: 'credit_days', label: 'Días de crédito', containerClass: 'col-sm-12 col-md-6 container-info'},
        {fieldType: 'FieldSelect', name: 'rule_id', label: 'Regla', containerClass: 'col-sm-12 col-md-6 container-info', options: this.rulesList},
        // {fieldType: 'FieldInput', name: 'customization', label: 'customization', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required'},
        // {fieldType: 'FieldInput', name: 'default_setting', label: 'default_setting', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required'},
        // {fieldType: 'FieldInput', name: 'integrations', label: 'integrations', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required'},
        {fieldType: 'FieldCheckbox', multiple: true, name: 'show_cyber_form', containerClass: 'col-sm-12 col-md-12 container-info', options: this.cyberCheckBox},
        {fieldType: 'FieldCheckbox', multiple: true, name: 'show_invoices', containerClass: 'col-sm-12 col-md-12 container-info', options: this.invoicesCheckBox}
      ]
    },
    setCountries (ori) {
      const indexCountry = this.fields.findIndex(({name}) => name === 'country')
      if (indexCountry !== -1) this.fields[indexCountry].options = this.countries
      console.log('countries')
    },
    setOrganizations (ori) {
      const indexOrganization = this.fields.findIndex(({name}) => name === 'organization')
      if (indexOrganization !== -1) this.fields[indexOrganization].options = this.organizations.rows
      console.log('organizations')
    },

    setCountryShipper () {
      if (this.form.country?.id && this.countries?.length) {
        const indexCountry = this.countries.findIndex(el => el.id === this.shipper.country?.id)
        if (indexCountry !== -1) this.form.country = this.form.country_id = this.countries[indexCountry] 
        else this.form.country = this.form.country_id = null
        this.changeCountry('country', this.form.country)
        this.changeAddressType('address_type', this.form.address_type)
      }
    },

    setOrganizationShipper () {
      if (this.form.organization?.id && this.organizations?.length) {
        const indexOrganization = this.organizations.findIndex(el => el.id === this.shipper.organization?.id)
        if (indexOrganization !== -1) this.form.organization = this.form.organization_id = this.organizations[indexOrganization] 
        else this.form.organization = this.form.organization_id = null
      }
    },

    changeAddressType (name, value) {
      const index = this.fields.findIndex(el => el.name === 'address_type') + 1
      this.fields = this.fields.filter(el => !['autocomplete', 'street_name', 'street_number'].includes(el.name))
      if (value.length > 0) {
        this.fields.splice(index, 0, {
          fieldType: 'FieldInput',
          name: 'street_name',
          label: 'Calle',
          containerClass: 'col-sm-12 col-md-4 container-info',
          validation: 'required'
        }, {
          fieldType: 'FieldInput',
          name: 'street_number',
          label: 'Número',
          containerClass: 'col-sm-12 col-md-4 container-info',
          validation: 'required'
        })
        this.fields[index].fieldType = 'FieldInput'
      } else {
        this.fields.splice(index, 0, {
          fieldType: 'FieldAutocomplete',
          name: 'autocomplete',
          label: 'Dirección (Calle, número)',
          containerClass: 'col-sm-12 col-md-12 container-info',
          validation: 'required',
          change: this.changeAddress,
          dependency: this.form.country?.id ? `level${Math.max(...this.form.country.required_levels)}` : 'country',
          searchOnType: { fx: this.searchGoogleAddress, nChar: 3, debounce: 300, allowSearchAsValue: true, persistSearch: true }
        })
      }
    },
    searchGoogleAddress (value) {
      value = this.getFullAddress(value)
      return this.shippersService.callService('getGoogleAddress', {address: value})
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
              geocode_data: address,
              name: address.formatted_address,
              address_id: address.place_id,
              location: address.geometry.location,
              address_components: address.address_components,
              street_name: indexStreetName !== -1 ? address.address_components[indexStreetName].long_name : null,
              street_number: indexStreetNumber !== -1 ? address.address_components[indexStreetNumber].long_name : null,
              valid: indexStreetName !== -1 && indexStreetNumber !== -1
            }
          }).filter(el => el.valid)
        })
    },
    getFullAddress (value) {
      let text = `${value}, `
      if (this.form.country?.id) {
        this.form.country.required_levels.map(level => {
          if (this.form[`level${level}`] && this.form[`level${level}`].id) text += `${this.form[`level${level}`].text}, `
        })
        text += this.form.country.text
      }
      return text
    },
    changeCountry (name, value) {
      const fields = this.fields.filter(el => el.name.indexOf('level') !== -1)
      fields.map(f => this.fields.splice(this.fields.findIndex(el => el.name === f.name), 1))
      this.selectorsLevel = {}
      const index = this.fields.findIndex(el => el.name === 'autocomplete')
      if (!value?.id) {
        this.fields[index].dependency = 'country'
        return null
      }
      if (index !== -1) this.fields[index].dependency = `level${Math.max(...value.required_levels)}`
      this.getLevels(value)
    },
    getLevels (country) {
      this.loading.levels = true
      this.shippersService.callService('getLevels', null, {country: country.code.toLowerCase() })
        .then(resp => {
          const requiredLevels = country.required_levels || []
          const displayLevels = country.display_levels
          this.selectorsLevel = this.$generatePlacesLevels(this.$generateArrayPlacesFromTree(resp.data.level1), Math.max(...requiredLevels), displayLevels)
          this.addPlacesLevelFields(requiredLevels)

          // this.setValuesOnEdit()
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-cargar-datos', {code: err}))
        })
        .finally(_ => {
          this.loading.levels = false
        })
    },
    

    addPlacesLevelFields (requiredLevels) {
      const texts = this.$i18nImport(`${this.form.country.code.toLowerCase()}.es`)[`${this.form.country.code.toLowerCase()}.es`]
      let indexSplice = this.fields.findIndex(el => el.name === 'country') + 1
      const indexLabelModificate = this.fields.findIndex(el => el.name === 'contact_dni')
      this.fields[indexLabelModificate].label = texts.WORD_DNI
      this.fields[indexLabelModificate].placeholder = texts.FORMAT_DNI
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
        myField.validation = requiredLevels.includes(parseInt(key.split('level')[1])) ? 'required' : ''
        this.fields.splice(indexSplice, 0, myField)
        this.form[key] = this.selectorsLevel[key].filter(e => e.text === this.form[`${key}Text`])[0]
        delete this.form[`${key}Text`]
        indexSplice++
      })
    },
    changePlaceLevel (name, value, next) {
      const index = this.fields.findIndex(el => el.name === next)
      if (next && value?.id) this.fields[index].options = value[next].sort((a, b) => a.name > b.name ? 1 : -1)
      if (!value?.id && next) {
        this.form[next] = null
        const nextIndex = Object.keys(this.selectorsLevel).findIndex(key => key === next)
        this.changePlaceLevel(next, null, Object.keys(this.selectorsLevel)[nextIndex + 1] || null)
      }
    },

    saveDataShipper (data) {
      // this.$route.params.breadcrumb.id = this.$route.params.id
      const params = { shipper_id: this.$route.params.id }
      const shipper = {
        code: data.code,
        credit_days: parseInt(data.credit_days),
        extra_fields: {
          business_activity: data.business_activity,
          // logo_url_text: http://www.laurl.com/dellogo.jpeg,
          webpage: data.webpage
        },
        need_purchase_order: (data.need_purchase_order.id === 1),
        rule_id: data.rule_id ? data.rule_id.id : 0,
        show_cyber_form: (data.show_cyber_form[0]?.id === 1),
        show_invoices: (data.show_invoices[0]?.id === 1),
        activated: data.activated.id === 1 ? data.activated.id : 0
        // country_id: data.country.id,
        // name1: data.name1,
        // name2: data.name2,
        // organization_id: this.$session.get('cas_user').organization.id,
      }
      const address = {
        country_code: data.country.code,
        level1: data.level1 ? data.level1.text : '',
        level2: data.level2 ? data.level2.text : '',
        level3: data.level3 ? data.level3.text : '',
        level4: data.level4 ? data.level4.text : '',
        // place_id: data[`level${Math.max(...data.country.required_levels)}`].id,
        information: data.information,
        zip_code: data.zip_code
      }
      let full_address = ''
      if ((!data.address_type || data.address_type.length === 0)) {
        full_address = data.autocomplete.formatted_address
      } else {
        full_address = `${data.street_name}, ${data.street_number}`
        Object.keys(this.selectorsLevel).map((key, index) => {
          full_address += `, ${data[key].text}`
        })
        full_address += `, ${data.country.name}`
      }
      if (!data.address_type || data.address_type.length === 0) {
        if (typeof data.autocomplete !== 'string') {
          address.formatted_address = data.autocomplete.formatted_address
          address.full_address = data.autocomplete.formatted_address
          address.geocode_api = 'goglegeocode'
          address.geocode_data = data.autocomplete.geocode_data
          address.location = data.autocomplete.location
          address.street_name = data.autocomplete.street_name
          address.street_number = data.autocomplete.street_number
        }
      } else {
        address.street_name = data.street_name
        address.street_number = data.street_number
        address.full_address = full_address
        address.formatted_address = address.full_address
        address.location = null
        address.geocode_data = null
        address.geocode_api = null
      }
      const form = {
        address,
        code: `HQ${data.code}`,
        name: data.name1,
        type: 'headquarters',
        contact: {
          name: data.contact_name,
          email: data.contact_email,
          phone: data.contact_phone,
          dni: data.contact_dni
        }
      }
      // console.log(shipper, form)
      if (this.shipper.address.id) this.updateShipper(shipper, params, form, this.shipper.address.id)
      else this.saveAddress(form, shipper, params)
    },

    updateShipper (shipper, params, form, idAddress) {
      this.shippersService.callService('updateShippers', shipper, params)
        .then(response => {
          if (idAddress) this.updateAddress(form, idAddress)
        })
        .catch(err => {
          console.log(err)
          this.$alert(this.$t('msg-problema-guardar'))
        })
    },

    updateAddress (data, id) {
      const params = { shipper_id: this.$route.params.id, id }
      this.shippersService.callService('updateAddressShipper', data, params)
        .then(response => {
          this.$success(this.$t('msg-exito-guardar'))
        })
        .catch(err => {
          console.log(err)
          this.$alert(this.$t('msg-problema-guardar'))
        })
    },

    saveAddress (data, shipper, paramsShipper) {
      const params = { shipper_id: this.$route.params.id }
      this.shippersService.callService('saveAddressShipper', data, params)
        .then(response => {
          this.updateShipper({...shipper, address_id: response.data.id}, paramsShipper, data, null)
        })
        .catch(err => {
          console.log(err)
          this.$alert(this.$t('msg-problema-guardar'))
        })
    }
  }
}
</script>

<style scoped>
.centered {
  display: flex;
  justify-content: center;
}
</style>