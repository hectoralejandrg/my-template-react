import { watch, computed } from '@vue/composition-api';
<template>
  <div>
    <div v-show="!loading.first">
      <table-render id="table-products" :schema="schema" :rows="rows" :actions="actions" :loading="loading.products">
      </table-render>
    </div>
    <b-skeleton type="input" v-if="loading.first" class="mb-1 mt-1" />
    <div class="table-render-skeleton" v-if="loading.first">
      <b-skeleton-table :rows="pagination.limit || 10" :columns="schema.length || 10" :table-props="{}" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'products',
  props: ['formTab', 'openModal'],
  data() {
    return {
      schema: [],
      rows: [],
      actions: [],
      loading: {
        first: false,
        products: false
      }
    }
  },
  mounted () {
    this.setInitialData()
  },
  computed : {
    ...mapGetters({
      carrierProducts : 'getCarrierProducts',
      carrier: 'getCarrier'
    })
  },
  watch : {
    carrierProducts() {
      this.rows = this.carrierProducts.map(value => {
        const isDefault = `<i class='fa fa-${value.is_default ? 'check-circle text-success' : 'times-circle text-danger'}'></i>`
        return { ...value, default_product: isDefault }
      })
    }
  },
  methods: {
    setInitialData () {
      this.schema = [
        {label: 'Código', sortable: true, key: 'code'},
        {label: 'Nombre', sortable: true, key: 'name'},
        {label: 'Producto por defecto', key: 'default_product', class: ['text-center'], style: { width: '15%'}},
        {label: 'Acciones', key: 'actions', class: ['text-center']}
      ]
      this.actions = [
        {action: id => this.openUpdateModal(id), icon: 'Edit2Icon', color:'success', text: 'Editar'},
        {action: id => this.confirmDeleteProduct(id), icon: 'TrashIcon', color: 'danger', text: 'Eliminar'}
      ]
      this.getProducts()
    },
    getProducts () {
      this.loading.products = true
      console.log('getProducts')
      this.$store.dispatch('fetchService', { name: 'getCarrierProducts',  queryParams: { carrier_id: this.$route.params.id } })
      console.log('getProducts end')
      this.loading.products = false
    },
    openUpdateModal (_id) {
      this.openModal(this.rows.filter(({id}) => id === _id)[0])
    },
    confirmDeleteProduct (id) {
      this.$yesno(this.$t('msg-pregunta-eliminar-seleccionados'), this.deleteProduct(id))
    },
    deleteProduct(id) {
      this.$store.dispatch('fetchService', { name: 'deleteCarrierProducts',  params: { carrier_type_id: id}, showPackSuccess: true, onSuccess: this.successDeleteProduct })
    },
    successDeleteProduct() {
      this.getProducts()
      this.$success(this.$t('msg-exito-eliminar-elemento'))
    }
  }
}
</script>

<style lang='scss'>

.products-button {
  top: -3.5rem !important;
  right: 0rem !important;
  position: absolute !important;
  z-index: 9;
}
</style>
