<template>
  <b-modal id="modalAlerts" :title="$t('Alerta')" modal-class="custom-dialog dialog-800" :ok-title="$t(`${editing ? 'Modificar' : 'Crear'} alerta`)" ok-variant="warning" 
  ok-only no-close-on-esc no-close-on-backdrop centered @close="close" @ok="ok" :ok-disabled="loading">
    <form-render v-show="!loading" :form.sync="form" :fields="fields" @send="onAccept" containerButtonsClass="col-sm-12" ref="formRenderAlert">
    </form-render>
    <div v-show="loading">
      <b-skeleton width="30%"/>
      <b-skeleton type="input"/>
      <b-skeleton width="30%" class="mt-1"/>
      <b-skeleton type="input"/>
      <b-skeleton width="30%" class="mt-1"/>
      <b-skeleton type="input"/>
    </div>
  </b-modal>
</template>
<script>
export default {
  name: 'modal-alerts',
  props: ['alert', 'send', 'countries', 'typeAttributes'],
  data () {
    return {
      form: {},
      fields: [],
      editing: false,
      loading: true,
      keyFormRender: 0
    }
  },
  watch: { 
    alert () {
      //Concatenamos un array de objeto para tener una nueva opción en country que sea Todos
      const allCountries = [{id: '*', text: 'Todos', code: 'ALL'}].concat(this.countries)
      // Creamos el objeto que sera el cual muestre la información en el modal al momento de editar
      this.form = {
        ...this.alert,
        country: this.alert.country ? allCountries.filter(el => this.alert.country.includes(el.code)) : null,
        alerts: this.alert.text ? this.alert.text : null
      }
      this.editing = !!this.alert.text
      this.loading = false
      this.keyFormRender++
    },
    typeAttributes () {
      const index = this.fields.findIndex(el => el.name === 'type')
      this.fields[index].options = this.typeAttributes
      this.loading = false
    },
    countries () { 
      const index = this.fields.findIndex(el => el.name === 'country')
      this.fields[index].options =  [{id: '*', text: 'Todos', code: 'ALL'}].concat(this.countries)
      this.loading = false
    }
   
  },
  mounted () {
    this.fields = [
      {fieldType: 'FieldSelect', name: 'country', label: 'País', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required', options: [{id: '*', text: 'Todos', code: 'ALL'}].concat(this.countries), multiple: true, specialVerification: this.verifySelectionOptions},
      {fieldType: 'FieldSelect', name: 'type', label: 'Tipo de Alerta', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required', options: this.typeAttributes},
      {fieldType: 'FieldTextarea', name: 'alerts', label: 'Alerta', containerClass: 'col-sm-12 container-info', validation: 'required'}
    ]
  },
  
  methods: {
    ok (e) {
      e.preventDefault()
      this.$refs.formRenderAlert.checkForm()
    },
    close () {
      this.$emit('update:alert', {})

    },
    onAccept (data) {
      this.loading = true
      const form = {
        alerts: data.alerts,
        type: !!data.type ? {...data.type} : {},
        country: !!data.country ? [...data.country] : []
      }
      this.$emit('send', { form, id: this.editing ? this.alert.text : null, original: data, countryEdit: this.alert.country, typeEdit: this.alert.type})
    },
    // Verificamos la multiselección en el selector country, para que en el caso de que se seleccione Todos, no se puedan seleccionar otros países o si ya estan seleccionados se remuevan
    verifySelectionOptions (value) {
      if (value && value.length > 0 && value.findIndex(el => el.id === '*') !== -1) {
        return [{ id: '*', text: 'Todos', code: 'ALL' }]
      }
      return value
    }
    
  }
}
</script>
<style lang="scss">
</style>