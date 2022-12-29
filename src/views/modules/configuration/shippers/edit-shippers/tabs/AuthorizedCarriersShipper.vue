 <template>
  <div>
    <div v-show="!loading.first">
      <table-render
        id="table-authorized-carriers"
        :schema="schema"
        :rows="rows"
        :actions="actions"
        :loading="loading.authorizedCarriers"
      >
      </table-render>
    </div>
    <b-skeleton type="input" v-if="loading.first" class="mb-1 mt-1" />
    <div class="table-render-skeleton" v-if="loading.first">
      <b-skeleton-table
        :table-props="{}"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'carrier-authorized-shipper',
  props: ['openModal'],
  data() {
    return {
      schema: [],
      rows: [],
      actions: [],
      loading: {
        first: false,
        authorizedCarriers: false
      }
    }
  },
  computed: {
    ...mapGetters({
      carrierAuthorized: 'getAuthorizedCarriersShippers',
      carrier: 'getCarrier'
    })
  },
  watch: {
    carrierAuthorized() {
      console.log('XD XD XD')
      this.rows = this.carrierAuthorized.filter(value => value.shipper.id === parseInt(this.$route.params.id))
      this.loading.authorizedCarriers = false
      this.loading.first = false
    }
  },
  mounted() {
    this.setInitialData()
  },
  methods: {
    setInitialData() {
      this.$store.dispatch('fetchService', { name: 'getServicesCarrier' })
      this.$store.dispatch('fetchService', { name: 'getCarriers' })
      this.schema = [
        { label: 'Carrier', sortable: true, key: 'carrier_name' },
        { label: 'Servicios', sortable: true, key: 'service_name' },
        { label: 'Acciones', key: 'actions', class: ['text-center'] }
      ]
      this.actions = [
        { action: id => this.openUpdateModal(id), icon: 'Edit2Icon', color: 'success', text: 'Editar' },
        { action: id => this.confirmDeleteAuthorizeCarrierShipper(id), icon: 'TrashIcon', color: 'danger', text: 'Eliminar' }
      ]
      this.getAuthorizedCarrier()
    },
    getAuthorizedCarrier() {
      this.loading.first = true
      this.loading.authorizedCarriers = true
      this.$store.dispatch('fetchService', { name: 'getAuthorizedCarriersShippers' })
    },
    openUpdateModal(_id) {
      this.openModal(this.rows.filter(({ id }) => id === _id)[0])
    },
    confirmDeleteAuthorizeCarrierShipper(_id) {
      this.$yesno(this.$t('msg-pregunta-eliminar-seleccionados'), () => this.deleteAuthotizedCarriers(_id))
    },
    deleteAuthotizedCarriers(id) {
      this.$store.dispatch('fetchService', { name: 'deleteAuthorizedCarriersShipper', params: {  id }, onSuccess: this.successDeleteAuthorizedCarriers })
    },
    successDeleteAuthorizedCarriers() {
      this.getAuthorizedCarriers()
      this.$success(this.$t('msg-exito-eliminar-elemento'))
    }
  }
}
</script>

<style lang='scss'>
</style>
