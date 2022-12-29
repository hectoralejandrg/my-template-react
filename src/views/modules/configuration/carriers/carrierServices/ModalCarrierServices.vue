<template>
  <b-modal
    id="modalCarrierServices"
    :title="$t(`${editing ? 'Editar' : 'Nuevo'} servicio`)"
    :ok-title="$t('Guardar')"
    ok-variant="warning"
    modal-class="dialog-900"
    ok-only
    no-close-on-esc
    no-close-on-backdrop
    centered
    @ok="ok"
    :ok-disabled="!courthoursActive && loading.main"
  >
    <form-render
      v-show="!loading.main"
      class="mb-2"
      :fields.sync="fields"
      :form.sync="form"
      @send="onAccept"
      :key="formRenderService"
      ref="formRenderServices"
      containerButtonsClass="col-sm-12 col-lg-4 container-button"
    >
      <template #space />
      <template #timeCourt>
        <label for="timepicker-courthours">{{labelTimerPicker}}</label>
        <b-form-timepicker
          id="datepicker-courthours"
          locale="en"
          :state= "courthoursActive"
          @input="courtHoursChange"
          minutes-step="5"
          label-selected="Hijo eh p[puta"
          v-model="court_hour"
        ></b-form-timepicker>
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
export default {
  name: 'modal-carrier-services',
  props: ['formTab'],
  data() {
    return {
      form: { alias : ''},
      editing: false,
      fields: [],
      loading: { main : false },
      courthoursActive: true,
      formRenderService: 0,
      court_hour: null,
      labelTimerPicker: 'Corte de horario'
    }
  },
  computed: {
    ...mapGetters({
      carrier: 'getCarrier',
      serviceType: 'getServiceType',
      serviceCarriers: 'getServiceCarriers'
    })
  },
  watch: {
    formTab() {
      this.court_hour = this.formTab.court_hours
      this.formTab.service_default = this.formTab.is_default ? [{id: 1, text: 'Marcar producto por defecto'}] : []
      this.form = {...this.formTab}
      this.form.service_type_id = this.serviceType.find(value => value.id === this.formTab.service_type_id)
      this.editing = !!this.formTab.id
      const serviceNameIndex = this.fields.findIndex(el => el.name === 'service_type_id')
      this.fields[serviceNameIndex].options = this.serviceType
    },
    editing() {
      if (!this.editing) {
        this.form = {}
        this.court_hour = ''
        this.validationServiceDefault()
      }
    }
  },
  mounted() {
    this.setInitialData()
  },
  methods: {
    setInitialData() {
      this.fields = [
        { fieldType: 'FieldInput', name: 'name', label: 'Nombre', containerClass: 'col-md-6 container-info col-sm-12', validation: 'required' },
        {
          fieldType: 'FieldCheckbox', multiple: true, name: 'service_default', label: 'Este servicio será utilizado por defecto en la creación de un envío', options: [
            { id: 1, text: 'Marcar servicio por defecto' }
          ], containerClass: 'col-sm-12 col-md-8 container-info pt-2'
        },
        { fieldType: 'FieldTextarea', name: 'description', label: 'Descripción', containerClass: 'col-md-12 container-info col-sm-12' },
        { fieldType: 'FieldInput', name: 'code', label: 'Código', containerClass: 'col-md-6 container-info col-sm-12', validation: 'required' },
        {
          fieldType: 'FieldTags', name: 'alias', label: 'Alias', tagsOption: {
            limitTagsText: this.$t('Limite de OT alcanzadas'),
            duplicateTagText: this.$t('Orden de transporte duplicada'),
            limit: 15
          }, placeholder: this.$t('Alias'), containerClass: 'col-sm-12 container-info col-md-6'
        },
        { fieldType: 'FieldSelect', name: 'service_type_id', label: 'Tipo de servicio', containerClass: 'col-sm-12 container-info col-md-6', validation: 'required' },
        { name: 'space', useSlot: true, containerClass: 'col-sm-12 container-info pt-1 border-top mt-1' },
        { fieldType: 'FieldInput', name: 'package', label: 'Mínimo de bultos retiro', containerClass: 'col-md-6 container-info col-sm-12', type: 'number' },
        { fieldType: 'FieldInput', name: 'max_kg', label: 'Máximo de kilos', containerClass: 'col-md-6 container-info col-sm-12', type: 'number' },
        { fieldType: 'FieldTextarea', name: 'formula', label: 'Formula', containerClass: 'col-md-6 container-info col-sm-12' },
        { name: 'timeCourt', useSlot: true, containerClass: 'col-md-6 container-info col-sm-12' }
      ]
    },
    onAccept(form) {
      this.loading.main = true
      if (this.editing) {
        this.updateService(form)
      } else {
        this.saveService(form)
      }
    },
    ok(e) {
      e.preventDefault()
      this.$refs.formRenderServices.checkForm()
    },
    validationServiceDefault() {
      const serviceCurrentCarrier = this.serviceCarriers.rows.filter(service => service.carrier.id === this.$route.params.id)
      const index = serviceCurrentCarrier.findIndex(el => el.is_default === true)
      if (index !== -1) {
        const indexDefault = this.fields.findIndex(el => el.name === 'is_default')
        this.fields[indexDefault].label = 'Servicio por defecto *Ya existe un servicio por defecto, este sustituira al anterior*'
        this.service.is_default = []
        this.formRenderService++
      } else {
        this.service.is_default = [{ id: 1, text: 'Marcar servicio por defecto' }]
        this.formRenderService++
      }
    },
    updateService(data) {
      const { carrier_name,
        carrier_code,
        carrier,
        created_at,
        id,
        updated_at,
        isDefault,
        service_type_id,
        service_default, ...rest } = data
      const queryParams = { ...rest,
        is_default: service_default === undefined ? false : !false,
        service_type_id: service_type_id.id,
        court_hours: this.court_hour,
        carrier_id: this.$route.params.id
      }
      this.$store.dispatch('fetchService', { name: 'updateServicesCarrier', queryParams, params: { carrier_service_id: this.form.id }, onSuccess: this.successUpdateService })
    },
    successUpdateService() {
      const queryParams = { carrier_id: this.$route.params.id }
      this.$store.dispatch('fetchService', { name: 'getServicesCarrier', queryParams })
      this.$bvModal.hide('modalCarrierServices')
      this.$success(this.$t('msg-exito-actualizar'))
      this.loading.main = false
    },
    saveService(data) {
      const queryParams = {
        ...data,
        carrier_id: this.$route.params.id,
        is_default: data.service_default === undefined ? false : !false,
        service_type_id: data.service_type_id.id,
        court_hours: this.court_hour,
        formula: data.formula && JSON.parse(data.formula),
        package: parseInt(data.package),
        max_kg: parseInt(data.max_kg)
      }
      this.$store.dispatch('fetchService', { name: 'createServicesCarrier', queryParams, onSuccess: this.successSaveServices })
    },
    courtHoursChange(value, name) {
      const hourValid = value.split(':')[0]
      if (parseInt(hourValid) > 6 && parseInt(hourValid) < 24) {
        this.courthoursActive = true
        this.labelTimerPicker = 'Corte de horario'
      } else {
        this.courthoursActive = false
        this.labelTimerPicker = this.$t('msg-horario-invalido')
      }
    },
    successSaveServices() {
      this.$store.dispatch('fetchService', { name: 'getServicesCarrier', queryParams: { carrier_id: this.$route.params.id }})
      this.$bvModal.hide('modalCarrierServices')
      this.$success(this.$t('msg-exito-guardar'))
      this.loading.main = false
    }
  }
}
</script>
<style>
</style>
