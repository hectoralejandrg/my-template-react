<template>
  <div>
    <div class="mt-2">
      <form-render
        class="mb-2"
        :fields="fields"
        :key="formRenderGenerals"
        :form.sync="form"
        @send="updateOrSaveCarrierDetails"
        ref="formRenderGenerals"
        containerButtonsClass="col-sm-12 col-md-3 container-button"
      >
        <template #space />
        <template #titleComercial>
          <h5>{{$t("Datos comerciales")}}</h5>
        </template>
      </form-render>
      <b-button
        variant="warning"
        class="push-right col-sm-12 col-md-2"
        @click="send"
        >Guardar</b-button
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CarriersService from '../carriers.service'

export default {
  name: 'generals',
  data() {
    return {
      form: {},
      actions: null,
      fields: [],
      formRenderGenerals: 0,
      carrier_id: this.$route.params.id,
      carriersService: new CarriersService(this)
    }
  },
  computed: {
    ...mapGetters({
      countries: 'getCountries',
      carrier: 'getCarrier',
      actionsOpt: 'getActions',
      carrieStatus: 'getCarrierStatus'
    })
  },
  watch: {
    countries() { //Para cuando se actualiza la pagina y el contenido carga antes que el listado de countries
      this.setCountries()

    },
    carrier() {
      this.form = {
        ...this.carrier,
        carrier_status: this.carrieStatus.find(value => value.id === this.carrier.status_id)
      }
      this.changeCountryCarrier()
    },
    actionsOpt() {
      const index = this.fields.findIndex(el => el.name === 'actions')
      if (index !== -1) this.fields[index].options = this.actionsOpt
      this.form.actions = this.actionsOpt.filter(action => this.carrier.actions.includes(action.value))
      this.formRenderGenerals++
    },
    carrieStatus() {
      const index = this.fields.findIndex(el => el.name === 'carrier_status')
      if (index !== -1) this.fields[index].options = this.carrieStatus
      this.formRenderGenerals++
    }
  },
  mounted() {
    this.setInitialData()
  },
  methods: {
    setInitialData() {
      this.fields = [
        { fieldType: 'FieldInput', name: 'name', label: 'Nombre del Carrier', containerClass: 'col-sm-12 container-info col-md-3', validation: 'required' },
        { fieldType: 'FieldInput', name: 'code', label: 'Código', containerClass: 'col-sm-12 container-info col-md-3', validation: 'required' },
        { fieldType: 'FieldSelect', name: 'country_carrier', label: 'País', containerClass: 'col-sm-12 container-info col-md-3', validation: 'required', change: this.changeCountryCarrier},
        { fieldType: 'FieldSelect', name: 'carrier_status', label: 'Estado', containerClass: 'col-sm-12 container-info col-md-3'},
        { fieldType: 'FieldSelect', name: 'actions', label: 'Acciones', containerClass: 'col-sm-12 container-info col-md-3', multiple : true, validation: 'required' },
        { fieldType: 'FieldInput', name: 'carrier_manager', label: 'Carrier Manager', containerClass: 'col-sm-12 container-info col-md-3', validation: 'required' },
        {name: 'titleComercial',  useSlot: true, containerClass: 'col-sm-12 container-info pt-1 border-top mt-1'},
        { fieldType: 'FieldInput', name: 'tradename', label: 'Nombre De la Empresa', containerClass: 'col-sm-12 container-info col-md-3' },
        { fieldType: 'FieldInput', name: 'business_name', label: 'Nombre Comercial', containerClass: 'col-sm-12 container-info col-md-3' },
        { fieldType: 'FieldInput', name: 'business_commercial_code', label: 'WORD_DNI', containerClass: 'col-sm-12 container-info col-md-3', placeholder: 'FORMAT_DNI', validation: 'dni:country_carrier' },
        { name: 'space', useSlot: true, containerClass: 'col-sm-12 container-info pt-1 border-top mt-1' },
        { fieldType: 'FieldInput', name: 'max_packages', label: 'Cantidad máxima de bultos', containerClass: 'col-sm-12 container-info col-md-3', disabled: true },
        { fieldType: 'FieldInput', name: 'max_packages_return', label: 'Cantidad máxima de bultos retiros', containerClass: 'col-sm-12 container-info col-md-3', disabled: true },
        { name: 'space', useSlot: true, containerClass: 'col-sm-12 container-info pt-1 border-top mt-1' },
        { fieldType: 'FieldInput', name: 'response_time', label: 'Tiempo de respuesta BO solicitudes', containerClass: 'col-sm-12 container-info col-md-3', disabled: true },
        { fieldType: 'FieldInput', name: 'max_time_complaint', label: 'Tiempo máximo reclamo', containerClass: 'col-sm-12 container-info col-md-3', disabled: true },
        { fieldType: 'FieldInput', name: 'max_time_compensation', label: 'Tiempo máximo indemnización', containerClass: 'col-sm-12 container-info col-md-3', disabled: true },
        { fieldType: 'FieldInput', name: 'time_payment_compensation', label: 'Tiempo pago indemnización', containerClass: 'col-sm-12 container-info col-md-3', disabled: true },
        { fieldType: 'FieldInput', name: 'time_payment_compensation', label: 'Tiempo pago indemnización', containerClass: 'col-sm-12 container-info col-md-3', disabled: true },
        { name: 'space', useSlot: true, containerClass: 'col-sm-12 container-info pt-1 border-top mt-1' },
        { fieldType: 'FieldInput', name: 'amount_coverage_insurance', label: 'Monto cobertura sin seguro', containerClass: 'col-sm-12 container-info col-md-3', disabled: true },
        { fieldType: 'FieldInput', name: 'additional_insurance ', label: '% seguro adicional', containerClass: 'col-sm-12 container-info col-md-3', disabled: true },
        { fieldType: 'FieldInput', name: 'compensation_cap_insurance', label: 'Tope indemnización con seguro', containerClass: 'col-sm-12 container-info col-md-3', disabled: true }
      ]
      this.$store.dispatch('fetchService', { name: 'getActions' })
      this.$store.dispatch('fetchService', { name: 'getCarrierStatus' })
      this.$store.dispatch('fetchService', { name: 'getServicesCarrier', queryParams: { carrier_id: this.carrier_id } })
      if (this.carrier_id) {
        this.getCarrier()
      }
      if (this.countries && !!this.countries.length) { //Para cuando se cambia de pantalla dentro del sitio sin actualizar
        this.setCountries()
      }
    },
    changeCountryCarrier(name, value, origin) {

      //Mejora label de codigo comercial, al montar componente y al actualizar pais
      const texts = this.$i18nImport(`${this.form.country_carrier.code.toLowerCase()}.es`)[`${this.form.country_carrier.code.toLowerCase()}.es`]
      const indexDNI = this.fields.findIndex(el => el.name === 'business_commercial_code')
      this.fields[indexDNI].label = texts.WORD_DNI
      this.fields[indexDNI].placeholder = texts.FORMAT_DNI
    },
    getCarrier() {
      this.$store.dispatch('fetchService', { name: 'getCarrier', params: { carrier_id: this.carrier_id } })
    },
    setCountries() {
      const index = this.fields.findIndex(el => el.name === 'country_carrier')
      this.fields[index].options = this.countries.map(value => ({id: value.id, code: value.code, text: value.text}))
      this.formRenderGenerals++
    },
    updateCarrierDetails(data) {
      console.log(data.actions)
      const queryParams = { ...data, actions : data.actions.map(el => el.value) }
      this.carriersService.callService('updateCarrier', queryParams, { carrier_id: this.carrier_id })
        .then(resp => {
          this.$router.push({ name: 'config-carriers' })
          this.$success(this.$t('msg-exito-actualizar'))
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-actualizar', { code: err }))
        })
    },
    saveCarrierDetails(data) {
      const queryParams = { ...data }
      this.$store.dispatch('fetchService', { name: 'createCarriers', queryParams, onSuccess: this.successSaveCarrierDetails })
    },
    successSaveCarrierDetails() {
      this.$router.push({ name: 'config-carriers' })
      this.$success(this.$t('msg-exito-guardar'))
    },
    updateOrSaveCarrierDetails(data) {
      const { country_carrier, carrier_status, actions, ...rest } = data
      const newData = {
        ...rest,
        country_id: country_carrier?.id,
        status_id: carrier_status?.id,
        actions : actions.map((action) => ({ [action.code]: action.text.toLowerCase() }))
      }
      if (this.carrier_id) {
        this.updateCarrierDetails(newData)
      } else {
        this.saveCarrierDetails(newData)
      }
    },
    send(e) {
      e.preventDefault()
      this.$refs.formRenderGenerals.checkForm()
    }
  }
}
</script>

<style>
</style>
