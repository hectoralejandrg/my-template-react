<template>
  <b-modal id="modalShippers" :title="$t( 'Crear shippers')" :ok-title="$t( 'Crear shippers')" ok-variant="warning" modal-class="dialog-900"
  ok-only no-close-on-esc no-close-on-backdrop centered @ok="ok" @close="close" :ok-disabled="loading.main">
    <form-render v-show="!loading.main" :form.sync="form" :fields="fields" @send="onAccept" containerButtonsClass="col-sm-12" ref="formRenderShippers" :key="keyFormRender">
      <template #company_info>
        <h5>{{$t('Datos de la empresa')}}</h5>
      </template>
      <template #direction_info>
        <h5>{{$t('Dirección de casa matriz')}}</h5>
      </template>
      <template #billing_info>
        <h5>{{$t('Datos de facturación')}}</h5>
      </template>
      <template #config_company>
        <h5 class="">{{$t('Configuraciones de compañia')}}</h5>
      </template>
    </form-render>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import ShippersService from './shippers.service'
export default {
  name:'modal-shippers',
  // props: ['countries', 'organizations', 'addresses'],

  data() {
    return {
      loading: {
        main: true,
        levels: true
      },
      form :{},
      fields: [],
      keyFormRender: 0,
      optionState: [{id: 1, text: this.$t('Activo')}, {id: 2, text: this.$t('Inactivo')}],
      optionPurchaseOrder: [{id: 1, text: this.$t('Si')}, {id: 2, text: this.$t('No')}],
      cyberCheckBox: [{ id: 1, text: 'Mostrar formulario Cyber'}],
      addressSearcher: [{id: 'existente', text: 'Dirección existente'}],
      addressType: [{id: 'manual', text: 'Ingresar dirección manualmente'}],
      invoicesCheckBox: [{ id: 1, text: 'Mostrar facturas'}],
      shippersService: new ShippersService(this)
    }
  },

  computed: {
    ...mapGetters({
      countries: 'getCountries',
      organizations: 'getOrganizationsGlobal'
    })
  },

  watch: {
    countries () {
      this.setCountries('watch')
    },
    organizations () {
      this.setOrganizations('watch')
    }
  },
  
  mounted() {
    this.setInitialData()
    if (this.organizations && !!this.organizations.length) {
      this.setOrganizations('mounted')
    }
    this.loading.main = false
  },

  methods: {
    setInitialData() {
      this.fields = [
        {name: 'company_info', useSlot: true, containerClass: 'col-sm-12 container-info pt-1'},
        {fieldType: 'FieldSelect', name: 'organization', label: 'Organización', containerClass: 'col-sm-12 col-md-12 container-info', validation: 'required', change: this.getOrganization},
        {fieldType: 'FieldInput', name: 'name1', label: 'Nombre empresa', containerClass: 'col-sm-12 col-md-4 container-info', validation: 'required', disabled: true},
        {fieldType: 'FieldInput', name: 'name2', label: 'Razon social', containerClass: 'col-sm-12 col-md-4 container-info', validation: 'required', disabled: true},
        {fieldType: 'FieldInput', name: 'business_activity', label: 'Giro', containerClass: 'col-sm-12 col-md-4 container-info', validation: 'required', disabled: true},
        {fieldType: 'FieldInput', name: 'code', label: 'Codigo empresa', containerClass: 'col-sm-12 col-md-4 container-info', validation: 'required', disabled: true},
        {fieldType: 'FieldInput', name: 'api_key', label: 'API key', containerClass: 'col-sm-12 col-md-4 container-info', disabled: true},
        {fieldType: 'FieldRadio', name: 'activated', label: 'Estado', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required', align: 'h', options: this.optionState, disabled: true},
        {name: 'direction_info', useSlot: true, containerClass: 'col-sm-12 container-info pt-1 border-top mt-1', disabled: true},
        // {fieldType: 'FieldCheckbox', multiple: true, name: 'address_searcher', label: 'Dirección', containerClass: 'col-sm-12 col-md-4 container-info', options: this.addressSearcher, change: this.changeAddressCheckbox, disabled: true},
        // {fieldType: 'FieldSelect', name: 'address_select',  label: 'Seleccione dirección', containerClass: 'col-sm-12 col-md-8 container-info', validation: 'required', disabled: true, change: this.changeAddressSelect, disabled: true},
        {fieldType: 'FieldSelect', name: 'country', label: 'País', containerClass: 'col-sm-12 col-md-6 container-info', disabled: true},
        {fieldType: 'FieldInput', name: 'zip_code', label: 'Codigo postal', containerClass: 'col-sm-12 col-md-6 container-info', disabled: true},
        {fieldType: 'FieldCheckbox', multiple: true, name: 'address_type', containerClass: 'col-sm-12 col-md-12 container-info', options: this.addressType, change: this.changeAddressType, disabled: true},
        {fieldType: 'FieldAutocomplete', name: 'autocomplete', label: 'Dirección (Calle, número)', containerClass: 'col-sm-12 col-md-12 container-info', validation: 'required', disabled: true, 
          dependency: 'country',
          // change: this.changeAddress,
          searchOnType: { fx: this.searchGoogleAddress, nChar: 3, debounce: 300, allowSearchAsValue: true, persistSearch: true }},
        {fieldType: 'FieldTextarea', name: 'information', label: 'Informacion adicional', containerClass: 'col-sm-12 col-md-12 container-info', disabled: true}, 
        {name: 'billing_info', useSlot: true, containerClass: 'col-sm-12 container-info pt-1 border-top mt-1', disabled: true},
        {fieldType: 'FieldInput', name: 'contact_dni', label: 'WORD_DNI', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required|dni:country', disabled: true},
        {fieldType: 'FieldInput', name: 'contact_name', label: 'Nombre de contacto', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required', disabled: true},
        {fieldType: 'FieldInput', type: 'email', name: 'contact_email', label: 'Email de contacto', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required|email', disabled: true},
        {fieldType: 'FieldInput', name: 'contact_phone', label: 'Telefono de contacto', containerClass: 'col-sm-12 col-md-6 container-info', disabled: true},
        {name: 'config_company', useSlot: true, containerClass: 'col-sm-12 container-info pt-1 border-top mt-1', disabled: true},
        {fieldType: 'FieldRadio', name: 'need_purchase_order', label: '¿Necesita orden de compra?', containerClass: 'col-sm-12 col-md-12 container-info', align: 'h', options: this.optionPurchaseOrder, disabled: true},
        // {fieldType: 'FieldInput', name: 'credit_days', label: 'credit_days', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required'}
        // {fieldType: 'FieldInput', name: 'billing_info', label: 'billing_info', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required'},
        // {fieldType: 'FieldInput', name: 'customization', label: 'customization', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required'},
        // {fieldType: 'FieldInput', name: 'default_setting', label: 'default_setting', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required'},
        // {fieldType: 'FieldInput', name: 'integrations', label: 'integrations', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required'},
        {fieldType: 'FieldCheckbox', multiple: true, name: 'show_cyber_form', containerClass: 'col-sm-12 col-md-12 container-info', options: this.cyberCheckBox, disabled: true},
        {fieldType: 'FieldCheckbox', multiple: true, name: 'show_invoices', containerClass: 'col-sm-12 col-md-12 container-info', options: this.invoicesCheckBox, disabled: true}
      ]
      this.form.activated = this.optionState[0]
      this.form.need_purchase_order = this.optionPurchaseOrder[1]
    },
    setCountries () {
      const indexCountry = this.fields.findIndex(field => field.name === 'country')
      if (indexCountry !== -1) this.fields[indexCountry].options = this.countries
    },
    setOrganizations (ori) {
      const indexOrganization = this.fields.findIndex(field => field.name === 'organization')
      if (indexOrganization !== -1) this.fields[indexOrganization].options = this.organizations
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
              name: address.formatted_address,
              geocode_data: address,
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


    getOrganization (name, value) {
      if (!value?.id) return
      this.shippersService.callService('getOrganization', null, { id: value.id })
        .then(resp => {
          this.form[name] = {...resp.data, text: resp.data.name}
          this.setCountry(name, {...resp.data, text: resp.data.name})
        })
        .catch(err => {
          console.error(err)
        })
    },

    setCountry (name, value) {
      if (!value?.id) return 
      this.form.country = this.countries.filter(el => (el.id === value.country.id))[0]
      this.changeCountry(null, this.form.country)
      this.fields = this.fields.map(el => {
        if (el.name === 'country') {
          el.disabled = true
        }
        else {
          el.disabled = false
        }
        return el
      })
    },

    changeAddressCheckbox (name, value) {
      const index = this.fields.findIndex(el => el.name === 'address_searcher') + 1
      const indexStart = this.fields.findIndex(el => el.name === 'level1')
      const indexEnd = this.fields.findIndex(el => el.name === 'billing_info')
      if (value.length > 0) {
        this.fields[index].options = this.addresses
        this.fields[index].disabled = false
        for (let i = indexStart; i < indexEnd; i++) {
          this.fields[i].disabled = true
        }
      } else {
        this.form.address_select = null
        this.fields[index].disabled = true
        this.changeAddressSelect(null, null)
        for (let i = indexStart; i < indexEnd; i++) {
          this.fields[i].disabled = false
        }
      }
      this.keyFormRender++
    },

    changeAddressSelect (name, value) {
      if (value === null) {
        // this.form.address_type = {}
        this.form.level1 = null
        this.form.level2 = null
        this.form.level3 = null
        this.form.level4 = null
        this.form.street_name = ''
        this.form.street_number = ''
        this.form.zip_code = ''
        this.form.information = ''
      } else {
        this.form.level1 = value.address.level1
        this.form.level2 = this.form.level2 = value.address.level2
        this.form.level3 = this.form.level3 = value.address.level3
        this.form.level4 = this.form.level4 = value.address.level4
        this.form.street_name = this.form.street_name = value.address.street_name
        this.form.street_number = this.form.street_number = value.address.street_number
        this.form.zip_code = value.address.zip_code
        this.form.information = value.address.information
      }
    },

    ok (e) {
      e.preventDefault()
      this.$refs.formRenderShippers.checkForm()
    },

    close () {
      this.form = {}
      this.changeCountry(null, null)
    },

    onAccept (data) {
      const shipper = {
        name1: data.name1,
        name2: data.name2,
        organization_id: data.organization.id,
        employer_identification_number: data.organization.employer_identification_number,
        country_id: data.country.id,
        code: data.code,
        api_key: data.api_key,
        activated: data.activated.id === 1 ? data.activated.id : 0,
        credit_days: 0,
        need_purchase_order: data.need_purchase_order.id === 1 ? data.need_purchase_order.id : 0,
        show_invoices: data.show_invoices ? data.show_invoices[0].id : 0,
        show_cyber_form: data.show_cyber_form ? data.show_cyber_form[0].id : 0,
        extra_fields: {
          business_activity: data.business_activity ? data.business_activity : ''
        },
        rule_id: 0
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
        // address.location = {}
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
      this.$emit('send', {shipper, form})
    }
  }
}
</script>