<template>
  <b-modal id="modalAddress" :title="$t('Dirección')" modal-class="custom-dialog dialog-800" :ok-title="$t(`${editing ? 'Modificar' : 'Crear'} dirección`)" ok-variant="warning" 
  ok-only no-close-on-esc no-close-on-backdrop centered @close="close" @ok="ok" :ok-disabled="loading.main">
    <form-render id="formRenderAddress" v-show="!loading.main" :key="keyFormRender" :form.sync="form" :fields.sync="fields" @send="onAccept" containerButtonsClass="col-sm-12" ref="formRenderAddress">
      <template #contact>
        <h5>{{$t('Datos de contacto')}}</h5>
      </template>
      <template #void>
        <div v-if="form.country && form.country.id && loading.levels">
          <b-skeleton width="30%"/>
          <b-skeleton type="input"/>
        </div>
      </template>
    </form-render>
    <div v-show="loading.main">
      <b-skeleton width="30%"/>
      <b-skeleton type="input"/>
      <b-skeleton width="30%" class="mt-1"/>
      <b-skeleton type="input"/>
      <b-skeleton width="30%" class="mt-1"/>
      <b-skeleton type="input"/>
      <b-skeleton width="30%" class="mt-1"/>
      <b-skeleton type="input"/>
      <b-skeleton width="30%" class="mt-1"/>
      <b-skeleton type="input"/>
      <b-skeleton width="30%" class="mt-1"/>
      <b-skeleton type="input"/>
      <b-skeleton width="30%" class="mt-1"/>
      <b-skeleton type="input"/>
      <b-skeleton width="30%" class="mt-1"/>
      <b-skeleton type="input"/>
    </div>
  </b-modal>
</template>
<script>
import { mapGetters } from 'vuex'
import { getTimeZones } from '@vvo/tzdb'
import { DateTime } from 'luxon'
import AddressesService from './addresses.service'
export default {
  name: 'modal-address',
  props: ['address', 'send', 'searchShipper', 'countries', 'ownerTypes', 'owner', 'addressType'],
  data () {
    return {
      form: {},
      fields: [],
      editing: false,
      loading: {
        main: true,
        levels: false
      },
      keyFormRender: 0,
      addressTypes: [{id: 'manual', text: 'Ingresar dirección manualmente'}],
      selectorsLevel: {},
      addressesService: new AddressesService(this)
    }
  },
  computed: {
    ...mapGetters({
      globalData: 'getGlobalData'
    })
  },
  watch: {
    address () {
      this.setFields()
      this.form = {
        ...this.address
      }
      this.editing = !!this.address.id
      if (this.editing) {
        this.loading.main = true
        const myForm = {...this.form}
        myForm.country = {...this.countries.filter(country => country.code === this.address.address_country_code)[0]}
        myForm.owner_type = {...this.ownerTypes.filter(owner => owner.id === this.address.owner_type)[0]}
        myForm.owner_id = { id: this.address.owner_id, text: `${this.address.owner_type} ${this.address.owner_id}`}
        myForm.owner_id_id = this.address.owner_id
        myForm.zipcode = this.address.address_zip_code
        myForm.street_name = this.address.address_street_name
        myForm.street_number = this.address.address_street_number
        myForm.info = this.address.address_information
        myForm.contact_dni = this.address.contact.dni
        myForm.contact_name = this.address.contact.name
        myForm.contact_email = this.address.contact.email
        myForm.contact_phone = this.address.contact.phone
        myForm.type_id = this.address.type
        myForm.address_type = this.address.address_location ? [] : this.addressTypes
        if (myForm.address_type.length === 0) {
          myForm.autocomplete = {
            id: this.address.id,
            text: this.address.address.full_address,
            name: this.address.address.full_address,
            formatted_address: this.address.address.formatted_address,
            full_address: this.address.address.full_address,
            geocode_api: 'goglegeocode',
            geocode_data: this.address.address.geocode_data || {},
            street_name: this.address.address.street_name,
            street_number: this.address.address.street_number
          }
          if (this.address.address.location.lat) {
            myForm.autocomplete.location = {...this.address.address.location}
          } else if (myForm.address.location) {
            myForm.autocomplete.location = { lat: this.address.address.location.split(', ')[0], lng: this.address.address.location.split(', ')[1] }
          }
        }
        this.form = {
          ...myForm
        }
        this.changeAddressType('address_type', myForm.address_type)
        if (!this.owner?.type) this.addOptionsOwnerId(myForm.owner_type)
        else this.changeContry('country', myForm.country, 'primero')
        if (!this.addressType) this.addOptionsType(myForm.owner_type)
      } else {
        if (this.owner?.country) {
          this.form.country = this.owner.country
          this.changeContry('country', this.owner.country, 'segundo')
        } 
        this.loading.main = false
      }
      this.keyFormRender++
    }
  },
  mounted () {
  },
  methods: {
    setFields () {
      this.fields = [
        {fieldType: 'FieldInput', name: 'name', label: 'Nombre', containerClass: 'col-sm-12 col-md-8 container-info', validation: 'required'},
        {fieldType: 'FieldInput', name: 'code', label: 'Código', containerClass: 'col-sm-12 col-md-4 container-info', validation: 'required'},
        {fieldType: 'FieldSelect', name: 'owner_type', label: 'Tipo de dueño', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required', options: this.ownerTypes, change: this.changeOwnerType},
        {fieldType: 'FieldSelect', name: 'owner_id', label: 'Dueño', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required', dependency: 'owner_type', change: this.changeOwnerId},
        {fieldType: 'FieldSelect', name: 'type', label: 'Tipo', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required', dependency: 'owner_type'},
        {fieldType: 'FieldSelect', name: 'country', label: 'País', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required', options: this.countries, disabled: true},
        {name: 'void', containerClass: 'col-sm-12', useSlot: true},
        {fieldType: 'FieldInput', name: 'zipcode', label: 'Código postal', containerClass: 'col-sm-12 col-md-3 container-info', validation: ''},
        // {
        //   fieldType: 'FieldInput',
        //   name: 'street_name',
        //   label: 'Calle',
        //   containerClass: 'col-sm-12 col-md-7 container-info',
        //   validation: 'required'
        // }, {
        //   fieldType: 'FieldInput',
        //   name: 'street_number',
        //   label: 'Número',
        //   containerClass: 'col-sm-12 col-md-2 container-info',
        //   validation: 'required'
        // },
        {fieldType: 'FieldCheckbox', multiple: true, name: 'address_type', containerClass: 'col-sm-12 col-md-8 container-info pt-2', options: this.addressTypes, change: this.changeAddressType},
        {fieldType: 'FieldAutocomplete', name: 'autocomplete', label: 'Dirección (Calle, número)', containerClass: 'col-sm-12 col-md-12 container-info', validation: 'required', 
          dependency: 'country',
          // change: this.changeAddress,
          searchOnType: { fx: this.searchGoogleAddress, nChar: 3, debounce: 300, allowSearchAsValue: true, persistSearch: true }},
        {fieldType: 'FieldInput', name: 'info', label: 'Información adicional (Depto., bloque, indicaciones, etc.)', containerClass: 'col-sm-12 container-info', validation: ''},
        {name: 'contact', useSlot: true, containerClass: 'col-sm-12 container-info pt-1'},
        {fieldType: 'FieldInput', name: 'contact_dni', label: 'WORD_DNI', placeholder: 'FORMAT_DNI', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required|dni:country'},
        {fieldType: 'FieldInput', name: 'contact_name', label: 'Nombre contacto', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required'},
        {fieldType: 'FieldInput', type: 'email', name: 'contact_email', label: 'Email', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required|email'},
        {fieldType: 'FieldInput', name: 'contact_phone', label: 'Teléfono', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required'}
      ]
      if (this.owner?.type) {
        this.fields = this.fields.filter(el => el.name !== 'owner_type')
      }
      if (this.owner?.id) {
        this.fields = this.fields.filter(el => el.name !== 'owner_id')
      }
      if (this.addressType) {
        this.fields = this.fields.filter(el => el.name !== 'type')
      }
      this.keyFormRender++
    },
    changeAddressType (name, value) {
      const index = this.fields.findIndex(el => el.name === 'address_type') + 1
      this.fields = this.fields.filter(el => !['autocomplete', 'street_name', 'street_number'].includes(el.name))
      if (value.length > 0) {
        this.fields.splice(index, 0, {
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
      return this.addressesService.callService('getGoogleAddress', {address: value})
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
              valid: indexStreetName !== -1 && indexStreetNumber !== -1,
              name: address.formatted_address,
              address_id: address.place_id,
              location: address.geometry.location,
              address_components: address.address_components,
              street_name: indexStreetName !== -1 ? address.address_components[indexStreetName].long_name : null,
              street_number: indexStreetNumber !== -1 ? address.address_components[indexStreetNumber].long_name : null
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
    changeContry (name, value, origin) {
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
      this.addressesService.callService('getLevels', null, {country: country.code.toLowerCase() })
        .then(resp => {
          const requiredLevels = country.required_levels || []
          const displayLevels = country.display_levels
          this.selectorsLevel = this.$generatePlacesLevels(this.$generateArrayPlacesFromTree(resp.data.level1), Math.max(...requiredLevels), displayLevels)
          this.addPlacesLevelFields(requiredLevels)
          this.setValuesOnEdit()
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-cargar-datos', {code: err}))
        })
        .finally(_ => {
          this.loading.main = false
          this.loading.levels = false
        })
    },
    
    addPlacesLevelFields (requiredLevels) {
      const texts = this.$i18nImport(`${this.form.country.code.toLowerCase()}.es`)[`${this.form.country.code.toLowerCase()}.es`]
      let indexSplice = this.fields.findIndex(el => el.name === 'country') + 1
      const indexDNI = this.fields.findIndex(el => el.name === 'contact_dni')
      this.fields[indexDNI].label = texts.WORD_DNI
      this.fields[indexDNI].placeholder = texts.FORMAT_DNI
      // this.fields[indexDNI].validation = `required|dni:${this.form.country.code.toLowerCase()}`
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
      this.keyFormRender++
    },
    setValuesOnEdit () {
      if (this.editing) {
        let prevKey = null
        Object.keys(this.selectorsLevel).map(key => {
          if (prevKey) {
            const index = this.fields.findIndex(el => el.name === key)
            this.fields[index].options = this.selectorsLevel[key].filter(el => {
              return el[prevKey] ===  this.form[prevKey].id
            })
          }
          this.form[key] = this.selectorsLevel[key].filter(sl => sl.text === this.form[`address_${key}`])[0]
          prevKey = key
        })
      }
      this.loading.main = false
    },
    changePlaceLevel (name, value, next) {
      const index = this.fields.findIndex(el => el.name === next)
      if (next && value?.id) this.fields[index].options = value[next].sort((a, b) => a.name > b.name ? 1 : -1)
      if (!value?.id && next) {
        delete this.form[next]
        const nextIndex = Object.keys(this.selectorsLevel).findIndex(key => key === next)
        this.keyFormRender++
        this.changePlaceLevel(next, null, Object.keys(this.selectorsLevel)[nextIndex + 1] || null)
      }
    },
    changeOwnerId (name, value) {
      if (!value || !value.id) return null
      this.form.country = this.countries.filter(el => el.id === value.country.id)[0]
      this.keyFormRender++
      this.changeContry('country', this.form.country, 'changeowner')
    },
    changeOwnerType (name, value) {
      if (!value || !value.id) return null
      // this.form.type = 'Cargando...'
      // this.form.owner_id = 'Cargando...'
      this.addOptionsOwnerId(value)
      this.addOptionsType(value)
    },
    addOptionsOwnerId (value) {
      const index = this.fields.findIndex(el => el.name === 'owner_id')
      const attr = this.addressesService.getAttributesField(value.id)
      if (attr.service) {
        this.addressesService.callService(attr.service, attr.queryParams)
          .then(resp => {
            const optionsOwnerId = this.addressesService.formatSelect(attr.service, resp.data)
            this.fields[index] = { ...this.fields[index], ...attr, options: optionsOwnerId}
            delete this.fields[index].searchOnType
          })
          .finally(_ => {
            delete this.form.owner_id
            const indexValue = this.fields[index].options.findIndex(el => `${el.id}` === `${this.form.owner_id_id}`)
            if (indexValue !== -1) {
              this.form.owner_id = {...this.fields[index].options[indexValue]}
              this.changeOwnerId(name, this.form.owner_id)
            }
          
            this.keyFormRender++
          })
      } else {
        delete this.form.owner_id
        this.fields[index] = {...this.fields[index], ...attr, options: []}
        this.keyFormRender++
      }
    },
    addOptionsType (value) {
      const index = this.fields.findIndex(el => el.name === 'type')
      this.addressesService.callService('getAddressesTypes', {owner_type: value.id})
        .then(resp => {
          const optionsType = resp.data.address_types.map(el => ({id: el, text: el}))
          this.fields[index] = { ...this.fields[index], options: optionsType }
        })
        .finally(_ => {
          delete this.form.type
          const indexValue = this.fields[index].options.findIndex(el => `${el.id}` === `${this.form.type_id}`)
          if (indexValue !== -1) this.form.type = {...this.fields[index].options[indexValue]}
          this.keyFormRender++
        })
    },
    ok (e) {
      e.preventDefault()
      this.$refs.formRenderAddress.checkForm()
    },
    close () {
      this.$emit('update:address', {})
    },
    onAccept (data) {
      this.loading.main = true
      const address = {
        country_code: data.country.code,
        level1: data.level1 ? data.level1.text : '',
        level2: data.level2 ? data.level2.text : '',
        level3: data.level3 ? data.level3.text : '',
        level4: data.level4 ? data.level4.text : '',
        // place_id: data[`level${Math.max(...data.country.required_levels)}`].id,
        information: data.info,
        zip_code: data.zipcode
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
          // address.location = `${data.autocomplete.location.lat}, ${data.autocomplete.location.lng}`
          address.location = {
            lat: data.autocomplete.location.lat,
            lng: data.autocomplete.location.lng
          }
          address.street_name = data.autocomplete.street_name
          address.street_number = data.autocomplete.street_number
        }
      } else {
        address.street_name = data.street_name
        address.street_number = data.street_number
        address.full_address = full_address
        address.formatted_address = address.full_address
        address.information = data.info
        // address.location = {}
      }
      const owner = {
        id: this.owner?.id || data.owner_id.id,
        type: this.owner?.type || data.owner_type.id
      }
      const form = {
        address,
        code: data.code,
        name: data.name,
        type: this.addressType || data.type.id,
        contact: {
          name: data.contact_name,
          email: data.contact_email,
          phone: data.contact_phone,
          dni: data.contact_dni
        }
      }
      this.$emit('send', { form, id: this.editing ? this.address.id : null, original: data, owner })
    }
  }
}
</script>
<style lang="scss">
  
</style>