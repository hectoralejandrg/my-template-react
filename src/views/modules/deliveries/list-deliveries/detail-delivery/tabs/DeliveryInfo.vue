<template>
  <div>
    <div class="mt-2">
      <h4>{{$t('Datos de origen')}}</h4>
      <form-render class="mb-2" :fields="fields" :key="keyFormRender" :form.sync="form" ref="formRenderDelivery" containerButtonsClass="col-sm-12 col-md-3 container-button"></form-render>
    </div>
    <div class="row">
      <div class="col-sm-12 col-md-6 border-top">
        <form-distribution-info class="mt-2"></form-distribution-info>
      </div>
      <div class="col-sm-12 col-md-6 border-top">
        <form-recipient-info class="mt-2"></form-recipient-info>
      </div>
    </div>
  </div>
</template>

<script>
import FormDistributionInfo from '@/views/components/custom/form-generic/FormDistributionInfo.vue'
import FormRecipientInfo from '@/views/components/custom/form-generic/FormRecipientInfo.vue'
export default {
  name: 'delivery-info',
  components: { FormDistributionInfo, FormRecipientInfo },

  data () {
    return {
      fields: [],
      keyFormRender: 0,
      form: {}
    }
  },

  mounted () {
    this.setInitialData()
  },

  methods: {
    setInitialData () {
      this.fields = [
        { fieldType: 'FieldInput', name: 'id_shipper', label: 'Id', containerClass: 'col-sm-12 container-info col-md-2' },
        { fieldType: 'FieldInput', name: 'company', label: 'Empresa', containerClass: 'col-sm-12 container-info col-md-2' },
        { fieldType: 'FieldSelect', name: 'bodega', label: 'Lugar de retiro / Bodega', containerClass: 'col-sm-12 container-info col-md-2', options: this.warehouse },
        { fieldType: 'FieldInput', name: 'address', label: 'Direccion', containerClass: 'col-sm-12 container-info col-md-2' },
        { fieldType: 'FieldSelect', name: 'commune', label: 'Place_level3', containerClass: 'col-sm-12 container-info col-md-2', options: this.communes }
      ]
    }
  }
}
</script>