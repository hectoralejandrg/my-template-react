import { length } from '@/@core/utils/validations/validations';
<template>
  <b-modal id="modalProducts" :title="$t(`${editing ? 'Editar' : 'Nuevo'} producto`)" :ok-title="$t('Guardar')" ok-variant="warning" modal-class="dialog-900"
  ok-only no-close-on-esc no-close-on-backdrop centered @ok="ok">
     <form-render :fields.sync="fields" :form.sync="products" @send="onAccept"
        ref="formRenderProducts"
        containerButtonsClass="col-sm-12 col-lg-4 container-button">
    </form-render>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { computed } from '@vue/composition-api'

export default {
  name:'modal-products',
  props: ['formTab'],
  data () {
    return {
      products: {},
      editing: false,
      fields: []
    }
  },
  computed : {
    ...mapGetters({
      carrier: 'getCarrier'
    })
  },
  watch: {
    formTab () {
      this.formTab.default_products = this.formTab.is_default ?  [{id: 1, text: 'Marcar producto por defecto'}] : []
      this.products = {...this.formTab}
      this.editing = !!this.formTab.id
    },
    editing () {
      if (!this.editing) this.form = {}
    }
  },
  mounted() {
    this.fields = [
      {fieldType: 'FieldInput', label: 'Código', name: 'code', containerClass: 'col-md-6 container-info col-sm-12', validation: 'required'},
      {fieldType: 'FieldInput', label: 'Nombre', name: 'name', containerClass: 'col-md-6 container-info col-sm-12', validation: 'required'},
      {fieldType: 'FieldCheckbox', multiple: true, name: 'default_products', label: 'Este producto será utilizado por defecto en la creación de un envío', containerClass: 'col-sm-12 col-md-12 container-info', options: [{id: 1, text: 'Marcar producto por defecto'}], change: this.changeDefaultProduct},
      {fieldType: 'FieldTextarea', label: 'Descripción', name: 'description', containerClass: 'col-md-12 container-info col-sm-12'},
      {fieldType: 'FieldTextarea', label: 'Formula', name: 'formula', containerClass: 'col-md-12 container-info col-sm-12'}
    ]
  },
  methods: {
    onAccept (form) {
      this.$emit('result', this.form)
      const { default_products, is_default, default_product, formula,  ...rest } = form
      console.log(default_products, is_default, default_product, formula,  rest)
      const newData = {
        ...rest,
        is_default: default_products === undefined ? false : !false,
        formula : [formula],
        carrier_id: this.$route.params.id
      }
      console.log(newData)
      if (this.editing) {
        this.updateProduct(newData)
      } else {
        this.saveProduct(newData)
      }
    },
    saveProduct (data) {
      this.$store.dispatch('fetchService', {name : 'createCarrierProducts', queryParams : {...data}, onSuccess : this.successSaveProduct})
    },
    successSaveProduct (data) {
      this.$store.dispatch('fetchService', {name : 'getCarrierProducts', queryParams : {carrier_id: this.$route.params.id}})
      this.$bvModal.hide('modalProducts')
      this.$success(this.$t('msg-exito-guardar'))
    },
    updateProduct (form) {
      this.$store.dispatch('fetchService', {name : 'updateCarrierProducts', queryParams : {...form}, params : {carrier_type_id : this.products.id}, onSuccess : this.successUpdateProduct})
    },
    successUpdateProduct (data) {
      this.$store.dispatch('fetchService', {name : 'getCarrierProducts', queryParams : {carrier_id: this.$route.params.id}})
      this.$bvModal.hide('modalProducts')
      this.$success(this.$t('msg-exito-actualizar'))
    },
    ok (e) {
      e.preventDefault()
      this.$refs.formRenderProducts.checkForm()
    },
    changeDefaultProduct () {},
    openUpdateModal (id) {},
    confirmDeleteProduct (id) {}
  }
}
</script>
<style>

</style>
