<template>
<b-modal id="modalTranslation" :title="$t('Traducción')" modal-class="dialog-600" :ok-disabled="loading.full" :ok-title="$t(`${editing ? 'Modificar' : 'Crear'} traducción`)" ok-variant="warning"
  ok-only no-close-on-esc no-close-on-backdrop centered @close="close" @ok="ok" @show="show">
    <table-render :schema="schema" :rows.sync="rows" :actions="actions" class="mb-4" v-if="editing"/>
    <form-render v-if="!loading.full" :key="keyFormRender" :form.sync="form" :fields="fields" @send="onAccept" containerButtonsClass="col-sm-12" ref="formRenderTranslation"></form-render>
    <div v-show="loading.full">
      <b-skeleton width="30%"/>
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
import TrackingService from './tracking.service'

export default {
  name: 'modal-translation',
  props: ['status', 'send', 'carriers'],
  data () {
    return {
      schema: [],
      rows: [],
      actions: [],
      form: {},
      fields: [],
      editing: false,
      keyFormRender: 0,
      symbols: [
        {id: '=', text: '=', name: 'equal'}, {id: '<>', text: '<>', name: 'distinct'}
      ],
      optionsReturnType: [{id: 'return', text: 'Tipo devolución'}],
      loading: {
        status_carrier: false,
        status: true,
        full: true
      },
      trackingService: new TrackingService(this)
    }
  },
  watch: {
    status () {
      this.form = { 
        ...this.status,
        carrier: this.carriers.filter(carrier => carrier.code === this.status.carrier_code)[0],
        operator_1: this.status.json_aditional && this.status.json_aditional.one ? this.status.json_aditional.one : '',
        operator_2: this.status.json_aditional && this.status.json_aditional.two ? this.status.json_aditional.two : '',
        return: this.status.delivery_type === 'return' ? this.optionsReturnType : [],
        operation: this.status.json_aditional && this.status.json_aditional.operator ? this.symbols.filter(el => el.id === this.status.json_aditional.operator.symbol)[0] : null
      }
      this.loading.full = true
      this.editing = !!this.status.id
      this.keyFormRender++
      if (this.editing) this.getCurrentDeliveries()
      if (this.form.carrier) this.getAllCarrierStatusesByCarrier('carrier', this.form.carrier)
    },
    carriers () {
      this.fields[0].options = this.carriers
    }
  },
  mounted () {
    this.schema = [
      {label: 'ID', sortable: true, key: 'id'},
      {label: 'N° de tracking', sortable: true, key: 'tracking_number'},
      {label: 'Fecha', sortable: true, key: 'registered_at'},
      {label: 'Acciones', key: 'actions', class: ['text-center']}
    ]
    this.actions = [
      { action: (id) => this.trackingService.goToPlatform(`deliveries/${id}`), icon: 'link', color:'light', text: 'Ir a envío' }
    ]
    this.fields = [
      {fieldType: 'FieldSelect', name: 'carrier', label: 'Carrier', containerClass: 'col-sm-12 container-info', validation: 'required', change: this.getAllCarrierStatusesByCarrier},
      {fieldType: 'FieldSelect', name: 'status_carrier', label: 'Estado carrier', containerClass: 'col-sm-12 container-info', validation: 'required', dependency: 'carrier'},
      {fieldType: 'FieldSelect', name: 'status', label: 'Estado Envíame', containerClass: 'col-sm-12 container-info', validation: 'required'},
      {fieldType: 'FieldCheckbox', multiple: true, name: 'return', containerClass: 'col-sm-12 container-info', options: this.optionsReturnType},
      {fieldType: 'FieldTextarea', name: 'observations', label: 'Observación', maxLength: 450, containerClass: 'col-sm-12 container-info'},
      {fieldType: 'FieldInput', name: 'operator_1', label: 'Operador 1', containerClass: 'col-sm-12 container-info col-md-4'},
      {fieldType: 'FieldSelect', name: 'operation', label: 'Operación', containerClass: 'col-sm-12 container-info col-md-4', options: this.symbols},
      {fieldType: 'FieldInput', name: 'operator_2', label: 'Operador 2', containerClass: 'col-sm-12 container-info col-md-4'}
    ]
    this.fields[0].options = this.carriers
  },
  methods: {
    getCurrentDeliveries () {
      this.rows = []
      this.trackingService.callService('getDeliveriesStatus', null, {status: this.status.delivery_carrier_status_id})
        .then(resp => {
          this.rows = resp.data
        })
        .catch(err => console.error(err))
    },
    show () {
      this.getAllDeliveryStatuses()
    },
    ok (e) {
      e.preventDefault()
      this.$refs.formRenderTranslation.checkForm()
    },
    close () {
      this.$emit('update:status', {})
    },
    onAccept (data) {
      this.loading.full = true
      let json_aditional = null
      if (data.operation && (data.operator_1 || data.operator_1 === '0') && (data.operator_2 || data.operator_2 === '0')) {
        json_aditional = {
          one: data.operator_1 || null,
          operator: data.operation ? {
            symbol: data.operation.id,
            name: data.operation.name
          } : null,
          two: data.operator_2 || null
        }
      }
      const form = {
        delivery_status_id: data.status.id,
        delivery_carrier_status_id: data.status_carrier.id,
        observations: data.observations || '',
        // company_id: data.company ? data.company.id : null,
        delivery_type: data.return && data.return.length > 0 ? 'return' : null,
        json_aditional
      }
      this.$emit('send', { form, id: this.editing ? this.status.id : null, original: data})    
    },
    setLoading (sub, bool) {
      this.loading[sub] = bool
      this.loading.full = !(!(this.loading.status && this.loading.status_carrier) || !this.loading.full)
    },
    getAllCarrierStatusesByCarrier (name, value) {
      this.setLoading('status_carrier', true)
      this.fields[1].options = []
      if (value && value.code) {
        this.trackingService.callService('getAllCarrierStatuses', {carrier: value.code, limit: 9999})
          .then(response => {
            if (response.data && response.data.length > 0) {
              this.fields[1].options = response.data.map(status => ({...status, text: status.code || JSON.stringify(status.customization) || '[Sin código]'}))
              this.form.status_carrier = this.fields[1].options.filter(status => this.status.delivery_carrier_status_id === status.id)[0]
            } else {
              this.$alert(this.$t('msg-carrier-no-estados')) // El carrier seleccionado no tiene estados asociados
            }
            this.keyFormRender++
          })
          .catch(response => {
            this.$alert(this.$t('msg-problema-carga-estados-carrier')) // Ocurrió un problema al cargar los estados del carrier seleccionado.
          })
          .finally(end => {
            this.setLoading('status_carrier', false)
          })
      }
    },
    getAllDeliveryStatuses () {
      this.setLoading('status', true)
      this.trackingService.callService('getAllDeliveryStatuses')
        .then(response => {
          this.fields[2].options = response.data.map(status => ({...status, text: status.name}))
          this.form.status = this.fields[2].options.filter(status => this.status.delivery_status_id === status.id)[0]
          this.keyFormRender++
        })
        .catch(response => {
          this.$alert(this.$t('msg-carrier-no-estados')) // Ocurrió un problema al cargar los estados del carrier seleccionado.
        })
        .finally(end => {
          this.setLoading('status', false)
        })
    },
    setDataTranslation () {
      this.form.carrier = this.carriers.filter(carrier => carrier.code === this.status.carrier_code)[0]
    }
  }
}
</script>
<style lang="scss">
  
</style>