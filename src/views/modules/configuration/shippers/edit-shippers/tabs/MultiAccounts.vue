<template>
  <div>
    <b-card>
      <div v-show="!loading.first">
        <table-render :schema="schema" :rows="rows" :loading="loading.account" :actions="actions"
        id="MultiAccount">
          <template #estado="scope">
            <feather-icon v-if="scope.rowdata.coverage" icon="ToggleLeftIcon" v-on:click="activeAccount" class="text-success"/>
            <feather-icon v-if="!scope.rowdata.coverage" icon="ToggleRightIcon" v-on:click="activeAccount" class="text-danger"/>
          </template>
        </table-render>
      </div>
      <b-skeleton
        height="40px"
        width="100%"
        class="mt-2 mb-2 spacing-label-field"
        v-show="loading.first"
      />
      <div class="table-render-skeleton" v-show="loading.first">
        <b-skeleton-table
          :columns="schema.length || 10"
          :table-props="{}"
        />
      </div>
    </b-card>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
export default {
  name: 'multi-accounts',
  props: ['openModal'],
  data() {
    return {
      buttons: [],
      selectedRows: [],
      schema: [],
      rows: [],
      actions: [],
      loading: {
        first: true,
        account: true
      },
      keyFormRender: 0
    }
  },
  computed: {
    ...mapGetters({
      accounts: 'getShipperAccounts'
    })
  },
  mounted() {
    this.setInitialData()
  },
  watch: {
    accounts() {
      this.rows = this.accounts.map(acount => ({
        ...acount,
        status: `<i class='fa fa-${Boolean(Math.random() < 0.1) ? 'check-circle text-success' : 'times-circle text-danger'}'></i>`
      }))
      this.loading.first = false
      this.loading.account = false
    }
  },
  methods: {
    setInitialData() {
      this.schema = [
        { label: 'Nombre de la cuenta', key: 'account_code' },
        {label: 'Estado',  key: 'estado', useSlot: true, class: ['text-center']},
        { label: 'Acciones', key: 'actions', class: ['text-center'] }
      ]
      this.actions = [
        { action: id => this.openUpdateModal(id), icon: 'Edit2Icon', color: 'success', text: 'Editar Cuenta' },
        { action: id => this.confirmDeleteAccount(id), icon: 'TrashIcon', color: 'danger', text: 'Eliminar' }]
      this.getAllInitialData()
    },
    getAllInitialData() {
      this.$store.dispatch('fetchService', { name: 'getCarriers' })
      this.getAccounts()
    },
    showAccountDetail(_id) {
      console.log(_id)
      console.log('Active')
    },
    activeAccount(_id) {
      this.$bvModal.show('modal-active-account')
    },
    getAccounts() {
      this.loading.account = true
      const queryParams = {
        company_id : parseInt(this.$route.params.id)
      }
      this.$store.dispatch('fetchService', { name: 'getShipperAccounts', queryParams })
    },
    openUpdateModal(_id) {
      this.openModal(this.rows.filter(({ id }) => id === _id)[0])
    },
    confirmDeleteAccount(_id) {
      this.$yesno(this.$t('msg-pregunta-eliminar-seleccionados'), () => this.deleteAccount(_id))
    },
    deleteAccount(id) {
      this.$store.dispatch('fetchService', { name: 'deleteShipperAccounts', params: { account_id: id }, onSuccess: this.successDeleteAccount })
    },
    successDeleteAccount() {
      this.getAccounts()
      this.$success(this.$t('msg-exito-eliminar-elemento'))
    },
    confirmDeleteMultipleAccounts() {
      this.$yesno(this.$t('msg-pregunta-eliminar-seleccionados'), this.deleteMultipleAccounts)
    }
  }
}
</script>

<style lang='scss'>
.account-button {
  top: -3.5rem !important;
  right: 0 !important;
  position: absolute !important;
  z-index: 9;
}
</style>
