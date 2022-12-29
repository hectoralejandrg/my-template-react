<template>
  <div id="FormDistributionInfo">
    <h4>{{$t('Datos de distribución')}}</h4>
    <form-render class="mb-2" :fields="fields" :key="keyFormRender" :form.sync="form" ref="formRenderDelivery" containerButtonsClass="col-sm-12 col-md-3 container-button"></form-render>
  </div>
</template>

<script>
export default {
  name: 'form-distribution-info',
  data () {
    return {
      form: {},
      fields: [],
      formFilter: {},
      keyFormRender: 0
    }
  },

  // watch: {
  //   carriers () {
  //     this.fields3[1].options = this.carriers
  //     this.keyFormRender3++
  //   }
  // },

  mounted () {
    this.setInitialData()
  },

  methods: {
    setInitialData () {
      this.fields = [
        { fieldType: 'FieldInput', name: 'deliverysNumber', label: 'N° de envío', type: 'number', containerClass: 'col-sm-12 container-info', validation: 'required' },
        { fieldType: 'FieldSelect', name: 'carrier', label: 'Carrier', containerClass: 'col-sm-12 container-info col-md-6' },
        { fieldType: 'FieldSelect', name: 'service', label: 'Servicio', containerClass: 'col-sm-12 container-info col-md-6' },
        { fieldType: 'FieldInput', name: 'width', label: 'Peso (Kgs)', containerClass: 'col-sm-12 col-md-3 container-info', validation: 'required' },
        { fieldType: 'FieldInput', name: 'volume', label: 'Volumen', containerClass: 'col-sm-12 col-md-3 container-info', validation: 'required' },
        { fieldType: 'FieldInput', name: 'packs', label: 'N° de bultos', containerClass: 'col-sm-12 col-md-3 container-info', validation: 'required' },
        { fieldType: 'FieldInput', name: 'cost', label: 'Valor producto', containerClass: 'col-sm-12 col-md-3 container-info', validation: 'required' },
        { fieldType: 'FieldTextarea', name: 'description', label: 'Descripción del producto', containerClass: 'col-sm-12 container-info', validation: 'required' }
      ]
      
      this.keyFormRender++
    }
  }
}
</script>