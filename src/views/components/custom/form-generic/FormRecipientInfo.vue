<template>
  <div id="FormRecipientInfo">
    <h4>{{$t('Datos destinatario')}}</h4>
    <form-render class="mb-2" :fields="fields" :key="keyFormRender" :form.sync="form" ref="formRenderDelivery" containerButtonsClass="col-sm-12 col-md-3 container-button"></form-render>
  </div>
</template>

<script>
export default {
  name: 'form-recipient-info',
  data () {
    return {
      form: {},
      fields: [],
      formFilter: {},
      keyFormRender: 0,
      optionsDistributionType: [
        { id: 1, text: this.$t('Domicilio') },
        { id: 2, text: this.$t('Punto de retiro') }
      ]
    }
  },

  mounted () {
    this.setInitialData()
  },

  methods: {
    setInitialData () {
      this.fields = [
        { fieldType: 'FieldInput', name: 'name', label: 'Nombre', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required' },
        { fieldType: 'FieldInput', name: 'cellphone', label: 'Celular', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required' },
        { fieldType: 'FieldInput', type: 'email', name: 'email', label: 'E-mail', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required|email' },
        {
          fieldType: 'FieldRadio',
          name: 'distributionType',
          label: 'Tipo de distribución',
          containerClass: 'col-sm-12 col-md-6 container-info',
          validation: 'required',
          align: 'h', change: this.changeFields,
          options: this.optionsDistributionType
        },
        { fieldType: 'FieldInput', name: 'direction', label: 'Dirección', containerClass: 'col-sm-12 container-info col-md-6', validation: 'required' },
        { fieldType: 'FieldSelect', name: 'commune', label: 'Place_level3', containerClass: 'col-sm-12 container-info col-md-6', options: this.communes },
        { fieldType: 'FieldInput', name: 'zipcode', label: 'Código postal', containerClass: 'col-sm-12 container-info col-md-6', validation: 'required' },
        { fieldType: 'FieldTextarea', name: 'directionDetail', label: 'Observaciones', containerClass: 'col-sm-12 container-info' }
      ]

      this.form.distributionType = this.optionsDistributionType[0]
      this.keyFormRender++
    },

    changeFields (name, value) {
      const index = this.fields.findIndex(({name}) => name === 'direction')
      if (index !== -1) {
        this.fields.splice(index, 3, { fieldType: 'FieldSelect', name: 'pudo', label: 'Punto de retiro', containerClass: 'col-sm-12 container-info col-md-6', validation: 'required' })
      }
      if (value.id === 1) {
        const index = this.fields.findIndex(({name}) => name === 'pudo')
        this.fields.splice(index, 1,
          { fieldType: 'FieldInput', name: 'direction', label: 'Dirección', containerClass: 'col-sm-12 container-info col-md-6', validation: 'required' },
          { fieldType: 'FieldSelect', name: 'commune', label: 'Place_level3', containerClass: 'col-sm-12 container-info col-md-6', options: this.communes },
          { fieldType: 'FieldInput', name: 'zipcode', label: 'Código postal', containerClass: 'col-sm-12 container-info col-md-6', validation: 'required' }
        )
      }
    }
  }
}
</script>