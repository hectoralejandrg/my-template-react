<template>
  <b-modal id="modalPackages" :title="$t('Bultos')" :ok-title="$t('Aceptar')" ok-variant="warning" modal-class="dialog-900"
  ok-only no-close-on-esc no-close-on-backdrop centered @ok="ok" @close="close" :ok-disabled="loading.main">
    <form-render
      @send="sendForm"
      v-for="(n,index) in quantity"
      :key="`formRenderPackages${index}`"
      v-show="!loading.main"
      :form.sync="form[index]"
      :fields="fields"
      containerButtonsClass="col-sm-12"
      :ref="`formRenderPackages${index}`"
    >
      <template #title-info>
        <h5>{{$t('Bulto N° ')}} {{n}}</h5>
      </template>
    </form-render>
  </b-modal>
</template>

<script>
export default {
  name:'modal-packages',
  props: ['qty', 'rows'],

  data() {
    return {
      loading: {
        main: true,
        levels: true
      },
      form: [],
      quantity: 0,
      fields: [],
      keyFormRender: 0
    }
  },
  watch: {
    qty () {
      if (!isNaN(this.qty)) {
        this.quantity = parseInt(this.qty)
        for (let i = 0; i < this.quantity; i++) this.form[i] = {}
      }
    },
    quantity () {
      if (isNaN(this.quantity)) this.quantity = 0
    },
    rows () {
      this.form = this.rows
    }
  },
  mounted() {
    this.fields = [
      {name: 'title-info', useSlot: true, containerClass: 'col-sm-12 container-info pt-1 border-top mt-1'},
      {fieldType: 'FieldInput', name: 'weight', label: 'Peso (Kgs)', containerClass: 'col-sm-12 container-info col-md-4', validation: 'required', disabled: false},
      {fieldType: 'FieldInput', name: 'volume', label: 'Volumen', containerClass: 'col-sm-12 container-info col-md-4', validation: 'required', disabled: false},
      {fieldType: 'FieldInput', name: 'price', label: 'Valor producto', containerClass: 'col-sm-12 container-info col-md-4', validation: 'required', disabled: false},
      {fieldType: 'FieldInput', name: 'width', label: 'Ancho', containerClass: 'col-sm-12 container-info col-md-4', validation: 'required', disabled: false},
      {fieldType: 'FieldInput', name: 'height', label: 'Alto', containerClass: 'col-sm-12 container-info col-md-4', validation: 'required', disabled: false},
      {fieldType: 'FieldInput', name: 'lenght', label: 'Largo', containerClass: 'col-sm-12 container-info col-md-4', validation: 'required', disabled: false},
      {fieldType: 'FieldTextarea', name: 'description', label: 'Descripción del producto', containerClass: 'col-sm-12 container-info', validation: 'required', disabled: false }
    ]
    this.keyFormRender++
    this.loading.main = false
  },

  methods: {
    ok (e) {

      e.preventDefault()
      const formVar = []
      for (let i = 0; i < this.quantity; i++) {
        // const valid = this.$refs[`formRenderPackages${i}`].onlyCheckForm()
        const element = this.form[i]
        if (!element.weight || !element.volume || !element.price || !element.description) {
          this.$alert(`${this.$t('Completar campos obligatorios')} (N° bulto ${i + 1})`)
          return
        }
        formVar.push(element)
      }
      this.$emit('send', formVar)
    },
    sendForm (data) {
      this.$emit('send', data)
    },
    close () {
      for (let i = 0; i < this.quantity; i++) this.form[i] = {}
    }
  }
}
</script>