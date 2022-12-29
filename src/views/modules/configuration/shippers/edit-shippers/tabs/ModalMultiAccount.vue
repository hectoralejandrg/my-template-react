<template>
  <b-modal id="modal-multi-account" :title="$t(`${editing ? 'Editar' : 'Agregar nueva'} cuenta`)" :ok-title="$t('Guardar')"
    ok-variant="warning" modal-class="dialog-900" ok-only no-close-on-esc no-close-on-backdrop centered @ok="ok">
    <form-render class="mb-2" :fields="fields" :key="formRenderAccount" :form.sync="form" @send="onAccept"
      ref="formRenderAccount" containerButtonsClass="col-sm-12 col-md-3 container-button">
    </form-render>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'modal-multi-account',
  props: ['formTab'],
  data() {
    return {
      form: {},
      editing: false,
      fields: [],
      formRenderAccount: 0,
      optionServices: [{ id: 4, text: 'All' }, { id: 5, text: 'SameDay' }, { id: 6, text: 'NextDay' }],
      optionDelivery: [{ id: 1, text: this.$t('Distribucion normal') }, { id: 2, text: this.$t('Devolucion logistica inversa') }]
    }
  },
  computed: {
    ...mapGetters({
      carriers: 'getCarriers'
    })
  },
  watch: {
    formTab() {
      this.editing = !!this.formTab.id
      this.form = {
        ...this.formTab,
        account_type : 'Pasarela'
      }
    },
    editing() {
      if (!this.editing) {
        this.form = { account_type : 'Pasarela'}
      }
    },
    carriers() {
      const serviceNameIndex = this.fields.findIndex(el => el.name === 'carrier_name')
      this.fields[serviceNameIndex].options = this.carriers.rows.map(carrier => ({
        ...carrier,
        text: carrier.name
      }))
      this.setCarrierNameForm()
      this.formRenderAccount++
    }
  },
  mounted() {
    this.setInitialData()
  },
  methods: {
    setInitialData() {
      this.fields = [
        { fieldType: 'FieldInput', name: 'account_code', label: 'Nombre de cuenta', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required', placeholder : 'Escriba el nombre de la cuenta' },
        { fieldType: 'FieldInput', name: 'account_type', label: 'Tipo de cuenta enviame', containerClass: 'col-md-6 col-sm-12 container-info', disabled: true },
        { fieldType: 'FieldSelect', name: 'carrier_name', label: 'Carrier', containerClass: 'col-sm-12 col-md-6 container-info', placeholder: 'Seleccione nombre carrier', change : this.carrierChange }

      ]
    },
    setCarrierNameForm() {
      const carrierCurrent = this.carriers.rows.find(carrier => carrier.id === this.formTab.carrier_id)
      this.form.carrier_name = carrierCurrent ? carrierCurrent.name : ''
      this.formRenderAccount++
    },
    carrierChange(name) {
      const index = this.fields.findIndex(el => el.name === name)
      const validate = this.fields.findIndex(el => el.name === 'api_key')
      const credentialExample = [
        { fieldType: 'FieldInput', name: 'api_key', label: 'Apikey Example', containerClass: 'col-sm-12 col-md-6 container-info', placeholder: 'Escriba api key' },
        { fieldType: 'FieldInput', name: 'passWord', label: 'Contraseña', containerClass: 'col-sm-12 col-md-6 container-info', placeholder: 'Escriba password' },
        { fieldType: 'FieldRadio', name: 'delivery_type', label: 'Tipo de envío', containerClass: 'col-sm-6 col-md-12 container-info', options: this.optionDelivery, dependency: 'carrier_id', change: this.changeDelivery, align : 'h' }
      ]
      if (validate === -1) {
        this.fields.splice(index + 1, 0, ...credentialExample)
      }
      this.formRenderAccount++
    },
    changeDelivery(name) {
      const index = this.fields.findIndex(el => el.name === name)
      const validate = this.fields.findIndex(el => el.name === 'services')
      const serviceExample = [
        {fieldType : 'FieldCheckbox', name : 'services', containerClass: 'col-sm-12 col-md-6 container-info', label : 'Categoria de servicios', options : this.optionServices, dependency : 'delivery_type', align : 'h'}
      ]
      if (validate === -1) {
        this.fields.splice(index + 1, 0, ...serviceExample)
      }
      this.formRenderAccount++
    },
    ok(e) {
      e.preventDefault()
      this.$refs.formRenderAccount.checkForm()
    },
    onAccept(form) {
      console.log(form, 'Aun nada Brahyan del futuro resuelvelo, XDDDDD')
    }
  }
}
</script>

<style>
</style>
