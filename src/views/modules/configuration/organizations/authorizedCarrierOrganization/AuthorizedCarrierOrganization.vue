<template>
  <div>
    <div v-show="!loading.first">
      <table-render
        id="table-authorized-carrier"
        :schema="schema"
        :rows="rows"
        :actions="actions"
        :loading="loading.authorizedCarrier"
      >
      </table-render>
    </div>
    <b-skeleton type="input" v-if="loading.first" class="mb-1 mt-1" />
    <div class="table-render-skeleton" v-if="loading.first">
      <b-skeleton-table
        :rows="10"
        :columns="schema.length || 10"
        :table-props="{}"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'carrier-authorized-organizations',
  props: ['openModal'],
  data() {
    return {
      buttons: [],
      schema: [],
      rows: [],
      actions: [],
      loading: {
        first: false,
        services: false
      }
    }
  },
  computed: {
    ...mapGetters({
      authorizedCarriersOrganization: 'getAuthorizedCarriersOrganizations',
      carrier: 'getCarrier'
    })
  },
  watch: {
    authorizedCarriersOrganization() {
      this.rows = this.authorizedCarriersOrganization.filter(value => value.organization.id === parseInt(this.$route.params.id))
      this.loading.first = false
      this.loading.services = false
    }
  },
  mounted() {
    this.setInitialData()

  },
  methods: {
    setInitialData() {

      this.$store.dispatch('fetchService', { name: 'getContractType' })
      this.$store.dispatch('fetchService', { name: 'getServicesCarrier' })
      this.$store.dispatch('fetchService', { name: 'getCarriers' })
      this.schema = [
        { label: 'Carrier', sortable: true, key: 'carrier_name' },
        { label: 'Servicios', sortable: true, key: 'service_name' },
        { label: 'Contrato', key: 'contract_types' },
        { label: 'Acciones', key: 'actions', class: ['text-center'] }
      ]
      this.actions = [
        { action: id => this.openUpdateModal(id), icon: 'Edit2Icon', color: 'success', text: 'Editar' },
        { action: id => this.confirmDeleteAuthorizedOrganization(id), icon: 'TrashIcon', color: 'danger', text: 'Eliminar' }
      ]
      this.getAuthorizedCarriers()
    },
    getAuthorizedCarriers() {
      this.loading.first = true
      this.loading.services = true
      this.$store.dispatch('fetchService', { name: 'getAuthorizedCarriersOrganizations' })
    },
    openUpdateModal(_id) {
      this.openModal(this.rows.filter(({ id }) => id === _id)[0])
    },
    confirmDeleteAuthorizedOrganization(_id) {
      this.$yesno(this.$t('msg-pregunta-eliminar-seleccionados'), () => this.deleteAuthotizedCarriers(_id))
    },
    deleteAuthotizedCarriers(id) {
      this.$store.dispatch('fetchService', { name: 'deleteAuthorizedCarriersOrganization', params: {  id }, onSuccess: this.successDeleteAuthorizedCarriers })
    },
    successDeleteAuthorizedCarriers() {
      this.getAuthorizedCarriers()
      this.$success(this.$t('msg-exito-eliminar-elemento'))
    }
  }
}
</script>

<style lang='scss'>
.authorized-organization-button {
  top: -3.5rem !important;
  right: 0rem !important;
  position: absolute !important;
  z-index: 9;
}
</style>
