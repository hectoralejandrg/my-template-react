<template>
	<div class="company-dialog">
		<b-modal id="modalExtendedFilter" centered modal-class="modal-warning dialog-1000 custom-dialog"
    @ok="ok" ok-variant="warning" :ok-title="$t('Filtrar')" ok-only
    :title="$t('Búsqueda avanzada')">
			<div class="mt-0">
				<form-render v-if="!loading.total" :key="keyFormRender" :fields="fields" :form.sync="form" @send="(form) => this.$emit('result', form)"
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
  props: ['form'],
  data () {
    return {
      buttonSend: {text: 'Filtrar', icon: 'SearchIcon', color: 'warning'},
      fields: [],
      keyFormRender: 0,
      loading: {
        carriers: true,
        deliveryStatuses: true,
        deliveryTypes: true,
        total: true
      },
      optionsType: [
        { id: 'delivery', text: 'Despacho a domicilio' },
        { id: 'pudo', text: 'Punto de retiro' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      generalLoading: 'getLoading',
      carriers: 'getCarriers',
      deliveryStatuses: 'getDeliveryStatuses',
      deliveryTypes: 'getDeliveryTypes'
    }),
    permissionList() {
      return this.$store.getters.getRelevantEntities
    }
  },
  mounted () {

    this.fields = [
      {fieldType: 'FieldInput', clearable: true, label: 'N° de ticket, de envío', name: 'order_imported_id', containerClass: 'col-md-4 container-info col-sm-12'},
      {fieldType: 'FieldInput', clearable: true, label: 'Orden de flete', name: 'order_tracking_number', containerClass: 'col-md-4 container-info col-sm-12'},
      {fieldType: 'FieldSelect', clearable: true, label: 'Tipo', name: 'order_type', containerClass: 'col-md-4 container-info col-sm-12'},
      {fieldType: 'FieldSelect', clearable: true, label: 'Estado', name: 'order_status_id', containerClass: 'col-md-4 container-info col-sm-12'},
      {fieldType: 'FieldSelect', clearable: true, label: 'Carrier', name: 'carrier_code', containerClass: 'col-md-4 container-info col-sm-12'},
      {fieldType: 'FieldSelect', clearable: true, label: 'Servicio', name: 'carrier_service', containerClass: 'col-md-4 container-info col-sm-12', dependency: 'carrier_code',
        options: [
          {text: 'Servicio 1', id: 1},
          {text: 'Servicio 2', id: 2}
        ]
      },
      {fieldType: 'FieldSelect', clearable: true, label: 'Tipo carrier', name: 'carrier_type', containerClass: 'col-md-4 container-info col-sm-12',
        options: [
          {text: 'Tipo 1', id: 1},
          {text: 'Tipo 2', id: 2}
        ]
      },
      {fieldType: 'FieldCheckbox', multiple: true, name: 'show_deleted', containerClass: 'col-md-4 container-info col-sm-12 pt-2', options: [
        {text: 'Mostrar eliminados', id: 1}
      ]}      
    ]

    this.getDataForm()
  },
  watch: {
    deliveryStatuses () {
      this.setSelectOptions('order_status_id', { options: this.deliveryStatuses })
    },
    deliveryTypes () {
      this.setSelectOptions('order_type', { options: this.deliveryTypes })
    },
    carriers () {
      this.setSelectOptions('carrier_code', { options: this.carriers.rows })
    },
    'generalLoading': {
      handler () {
        this.loading.carriers = !!this.generalLoading.getCarriers
        this.loading.deliveryStatuses = !!this.generalLoading.getDeliveryStatuses
        this.loading.deliveryTypes = !!this.generalLoading.getDeliveryTypes
      },
      deep: true
    },
    'loading': {
      handler () {
        const prevTotal = this.loading.total
        this.loading.total = !Object.keys(this.loading).filter(key => key !== 'total').every(key => !this.loading[key])
        // Que la actualización del componente solo se fuerce cuando esté todo cargado
        if (prevTotal !== this.loading.total && !this.loading.total) this.keyFormRender++
      },
      deep: true
    }
  },
  methods: {
    getDataForm () {
      const services = [
        { name: 'getCarriers' },
        { name: 'getDeliveryStatuses', queryParams: {limit: 9999} },
        { name: 'getDeliveryTypes', queryParams: {limit: 9999} }
      ]
      this.$store.dispatch('fetchMultipleServices', {services, byName: true})
    },
    setSelectOptions (name, { options }) {
      const index = this.fields.findIndex(el => el.name === name)
      if (index !== -1) {
        this.fields[index].options = options
        this.keyFormRender++
      }
      this.form[name] = null
      this.$emit('update:form', this.form)
    },
    onAccept () {
      this.$emit('update:form', this.form)
    },
    ok (e) {
      e.preventDefault()
      this.$refs.formRenderExtendedFilter.checkForm()
    }
  }
}
</script>
<style>

</style>
