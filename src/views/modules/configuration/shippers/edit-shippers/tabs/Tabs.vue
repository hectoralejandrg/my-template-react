<template>
  <div>
    <div class="button-create-pickup" v-show="tabIndex === 3">
        <b-button variant="warning" class="push-right"><feather-icon icon="PlusIcon"/> Añadir carrier </b-button>
      </div>
    <div class="authorized-carrier-button" v-show="tabIndex === 4">
      <b-button variant="warning" class="push-right" @click="() => openModal()" ><feather-icon icon="PlusIcon" />Autorizar Carrier</b-button >
    </div>
    <b-tabs align="left" class="tab-primary" v-model="tabIndex">
      <b-tab>
        <template #title>
          <div class="tab-title">
              <span> {{$t('Info de la empresa')}} </span>
          </div>
        </template>
        <div class="row">
        <shipper-info></shipper-info>
        </div>
      </b-tab>
      <b-tab v-if="true">
        <template #title>
          <div class="tab-title">
              <span> {{$t('Usuarios empleados')}} </span>
          </div>
        </template>
      </b-tab>
      <b-tab lazy>
        <template #title>
          <div class="tab-title">
            <span> {{$t('Mis cuentas')}} </span>
          </div>
        </template>
        <multi-accounts :openModal="openModal"></multi-accounts>
        <modal-multi-account :formTab="form"></modal-multi-account>
        <modal-active-account></modal-active-account>
      </b-tab>
      <b-tab>
        <template #title>
          <div class="tab-title">
              <span> {{$t('Bodegas')}} </span>
          </div>
        </template>
        <generic-addresses :owner="shipper" addressType="warehouse"/> <!-- v-if="currentShipper.id" -->
      </b-tab>
      <b-tab>
        <template #title>
          <div class="tab-title">
              <span> {{$t('Carrier / Configuración')}} </span>
          </div>
        </template>
        <carriers-config></carriers-config>
      </b-tab>
      <b-tab lazy>
        <template #title>
          <div class="tab-title">
              <span> {{$t('Autorizar Carriers')}} </span>
          </div>
        </template>
        <authorized-carriers :openModal="openModal"></authorized-carriers>
        <modal-authorized-carriers-shipper :formTab="form"></modal-authorized-carriers-shipper>
      </b-tab>
      <b-tab v-if="true">
        <template #title>
          <div class="tab-title">
              <span> {{$t('Marketplace')}} </span>
          </div>
        </template>
      </b-tab>
      <b-tab v-if="true">
        <template #title>
          <div class="tab-title">
              <span> {{$t('Integraciones')}} </span>
          </div>
        </template>
      </b-tab>
      <b-tab v-if="true">
        <template #title>
          <div class="tab-title">
              <span> {{$t('Avanzado')}} </span>
          </div>
        </template>
      </b-tab>
      <b-tab v-if="true">
        <template #title>
          <div class="tab-title">
              <span> {{$t('Notificaciones')}} </span>
          </div>
        </template>
      </b-tab>
      <b-tab  v-if="true">
        <template #title>
          <div class="tab-title">
              <span> {{$t('Campos adicionales')}} </span>
          </div>
        </template>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ShipperInfo from './ShipperInfo.vue'
import CarriersConfig from './CarriersConfig.vue'
import GenericAddresses from '@/views/components/custom/generic-addresses/GenericAddresses.vue'
import AuthorizedCarriers from './AuthorizedCarriersShipper.vue'
import ModalAuthorizedCarriersShipper from './ModalAuthorizedCarriersShipper.vue'
import MultiAccounts from './MultiAccounts.vue'
import ModalMultiAccount from './ModalMultiAccount.vue'
import ModalActiveAccount from './ModalActiveMultipleAccount.vue'


export default {
  name: 'tabs',
  components: { ShipperInfo, CarriersConfig, GenericAddresses, AuthorizedCarriers, ModalAuthorizedCarriersShipper, MultiAccounts, ModalMultiAccount, ModalActiveAccount },

  data () {
    return {
      form: {},
      tabIndex: 0,
      loading: {
        first: true
      }
    }
  },

  mounted() {
    this.getAllInitialData()
  },

  computed: {
    ...mapGetters({
      shipper: 'getShipper'
    })
  },
  watch: {
    tabIndex () {
      this.form = {}
    }
  },
  methods: {
    getAllInitialData () {
      const arrServices = []
      if (['admin', 'superadmin'].includes(this.$session.get('cas_user').role)) {
        if (this.loading.first) this.$store.dispatch('fetchService', { name: 'getOrganizations', queryParams: { simplified: true }})
        this.getShipper()
        this.loading.first = false
      } else {
        this.$alert(this.$t('msg-error-permission'))
        return null
      }
    },
    getShipper () {
      const params = { shipper_id: this.$route.params.id }
      this.$store.dispatch('fetchShipper', params)
    },
    openModal (data) {
      if (data) this.form = data
      else this.form = {}
      switch (this.tabIndex) {
      case 1:
        break
      case 2:
        this.$bvModal.show('modal-multi-account')
        break
      case 4:
        this.$bvModal.show('modalAuthorizedCarrierShipper')
        break
      default:
        break
      }
    }
  }
}
</script>
