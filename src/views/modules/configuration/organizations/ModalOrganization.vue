<template>
  <div class="company-dialog">
    <b-modal id="modalOrganization" centered modal-class="modal-warning dialog-1000 custom-dialog"
    @ok="ok" ok-variant="warning" :ok-title="$t(`${editing ? 'Modificar' : 'Crear'} organización`)" ok-only
    :title="title">
      <div class="mt-0">
        <form-render :fields.sync="fields" :form.sync="organization" @send="onAccept"
          ref="formRenderExtendedFilter"
          containerButtonsClass="col-sm-12 col-lg-4 container-button">
        </form-render>
      </div>
    </b-modal>
  </div>
</template>
<script>

import { mapGetters } from 'vuex'
export default {
  props: ['form', 'title'],
  data () {
    return {
      organization: {},
      editing: false,
      buttonSend: {text: 'Filtrar', icon: 'SearchIcon', color: 'warning'}
    }
  },
  computed: {
    ...mapGetters({
      countries: 'getCountries',
      organizationTypes: 'getOrganizationTypes'
    })
  },
  mounted () {
    this.setCountries()
    this.setOrganizationTypes()
  },
  watch: {
    form () {
      this.organization = {
        ...this.form
      }
      this.editing = !!this.form.id
      if (this.editing) {
        this.organization.country = this.countries.filter(({id}) => this.form.country_id === id)[0]
        this.organization.organization_type = this.organizationTypes.filter(({id}) => this.form.organization_type_id === id)[0]
      }
    },
    countries () {
      this.setCountries()
    },
    organizationTypes () {
      this.setOrganizationTypes()
    }
  },
  methods: {
    setCountries () {
      const indexCountry = this.fields.findIndex(({name}) => name === 'country')
      if (indexCountry !== -1) this.fields[indexCountry].options = this.countries
    },
    setOrganizationTypes () {
      const indexTypes = this.fields.findIndex(({name}) => name === 'organization_type')
      if (indexTypes !== -1) this.fields[indexTypes].options = this.organizationTypes
    },
    onAccept (form) {
      const organization = {
        name: form.name,
        country_id: form.country.id,
        executive_id: '4',
        code: form.code,
        organization_type: form.organization_type.id,
        employer_identification_number: form.employer_identification_number
      }
      const data = {
        name: this.form?.id ? 'updateOrganization' : 'saveOrganization',
        queryParams: { ...organization },
        params:  { id: this.form?.id },
        reload: 'getOrganizations'
      }
      /*
        1.- Actualizará el loading.organizations = true
        2.- Actualizará o guardará la organización
        3.- Mostrará una alerta de exito cuando complete el guardado/actualización
        4.- Cargará el listado principal (reload) con los params y queryParams de la ultima consulta
        5.- Actualizará el loading.organizations = false
      */
      this.$store.dispatch('fetchService', data)
    },
    ok (e) {
      e.preventDefault()
      this.$refs.formRenderExtendedFilter.checkForm()
    }
  },
  setup () {
    let fields = []
    const setField = (translate) => {
      const indexStatus = fields.findIndex(({name}) => name === 'employer_identification_number')
      Object.keys(translate).map(key => {
        fields[indexStatus].label = translate[key].WORD_DNI || 'WORD_DNI'
        fields[indexStatus].placeholder = translate[key].FORMAT_DNI || 'FORMAT_DNI'
      })
    }

    const i18nImport = (name, value) => {
      if (!value?.id) return
      const country = `${value.code.toLowerCase()}.es`
      const locales = require.context('@/libs/i18n/locales', true, /[A-Za-z0-9-_.,\s]+\.json$/i)
      const messages = {}
      locales.keys().forEach(key => {
        const matched = key.match(/([A-Za-z0-9-_.]+)\./i)
        if (matched && matched.length > 1) {
          if (key.indexOf(country.toLowerCase()) !== -1) {
            const locale = matched[1]
            messages[locale] = locales(key)
          }
        }
      })
      setField(messages)
    }
    fields = [
      {fieldType: 'FieldSelect', clearable: true, label: 'Id de ejecutivo', name: 'executive_id', containerClass: 'col-md-6 container-info col-sm-12'},
      {fieldType: 'FieldInput', label: 'Nombre', name: 'name', containerClass: 'col-md-6 container-info col-sm-12', validation: 'required'},
      {fieldType: 'FieldInput', label: 'Código', name: 'code', containerClass: 'col-md-6 container-info col-sm-12', validation: 'required'},
      {fieldType: 'FieldSelect', clearable: true, label: 'País', name: 'country', containerClass: 'col-md-6 container-info col-sm-12', validation: 'required', options: [], change: i18nImport},
      {fieldType: 'FieldInput', label: 'WORD_DNI', name: 'employer_identification_number', containerClass: 'col-md-6 container-info col-sm-12', validation: 'dni:country'},
      {fieldType: 'FieldSelect', clearable: true, label: 'Tipo de organización', name: 'organization_type', containerClass: 'col-md-6 container-info col-sm-12', validation: 'required'}
    ]

    return { fields }
  }
}
</script>
<style>

</style>
