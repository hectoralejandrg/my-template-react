<template>
  <div>
    <b-card>
      <div class="button-create-pickup" v-show="tabIndex === 5">
        <b-button variant="warning" class="push-right" @click="() => openModalPickups()" :disabled="loading.button"><feather-icon icon="PlusIcon"/> Crear nuevo retiro </b-button>
      </div>
      <b-tabs align="left" class="tab-primary" v-model="tabIndex">
        <b-tab>
          <template #title>
            <div class="tab-title">
              <feather-icon icon="SendIcon" />
              <span> {{$t('Crear envío')}} </span>
            </div>
          </template>
          <create-deliveries :carriers="listCarriers"></create-deliveries>
        </b-tab>
        <b-tab lazy>
          <template #title>
            <div>
              <feather-icon icon="FileTextIcon" />
              <span> {{$t('Generar etiquetas')}} </span>
            </div>
          </template>
          <generate-labels :getDeliveries="getDeliveries" :form.sync="form" :openModal="openModal" :cleanForm="cleanForm" :statusId="constStatus[tabIndex]" :advancedFilters.sync="filters"></generate-labels>
        </b-tab>
        <b-tab lazy>
          <template #title>
            <div>
              <feather-icon icon="FileTextIcon" />
              <span> {{$t('Con observación')}} </span>
            </div>
          </template>
          <observation :getDeliveries="getDeliveries" :form.sync="form" :openModal="openModal" :cleanForm="cleanForm" :statusId="constStatus[tabIndex]" :advancedFilters.sync="filters"></observation>
        </b-tab>
        <b-tab lazy>
          <template #title>
            <div>
              <feather-icon icon="PrinterIcon" />
              <span> {{$t('Imprimir')}} </span>
            </div>
          </template>
          <print :getDeliveries="getDeliveries" :form.sync="form" :openModal="openModal" :cleanForm="cleanForm" :statusId="constStatus[tabIndex]" :advancedFilters.sync="filters"></print>
        </b-tab>
        <b-tab lazy>
          <template #title>
            <div class="tab-title">
              <feather-icon icon="FileIcon" />
              <span> {{$t('Manifiesto')}} </span>
            </div>
          </template>
          <filter-manifest :carriers="listCarriers"></filter-manifest>
        </b-tab>
        <b-tab lazy>
          <template #title>
            <div class="tab-title">
              <feather-icon icon="TruckIcon" />
              <span> {{$t('Retiros')}} </span>
            </div>
          </template>
          <list-pickups :carriers="listCarriers"></list-pickups>
        </b-tab>
        <b-tab lazy>
          <template #title>
            <div>
              <feather-icon icon="FileTextIcon" />
              <span> {{$t('Impresos')}} </span>
            </div>
          </template>
          <printed :getDeliveries="getDeliveries" :form.sync="form" :openModal="openModal" :cleanForm="cleanForm" :statusId="constStatus[tabIndex]" :advancedFilters.sync="filters"></printed>
        </b-tab>
      </b-tabs>
      <modal-extended-filter :form.sync="form" @result="collectFullFilter"></modal-extended-filter>
    </b-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import CreateDeliveries from './new-delivery/CreateDelivery.vue'
import GenerateLabels from './generate-labels/GenerateLabels.vue'
import Observation from './observation/Observation.vue'
import Print from './print/Print.vue'
import Printed from './printed/Printed.vue'
import ModalExtendedFilter from '../ModalExtendedFilter.vue'
import ListPickups from './pickups/ListPickups.vue'
import FilterManifest from './manifest/FilterManifest.vue'
import DeliveryService from './delivery.service'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'


export default {
  components: { CreateDeliveries, GenerateLabels, Observation, Print, Printed, ModalExtendedFilter, ListPickups, FilterManifest },
  data () {
    return {
      form: {},
      filters: {},
      tabIndex: 0,
      listCarriers: [],
      loading: {
        button: false,
        initial: true
      },
      listDeliveryStatuses: [],
      listDeliveryTypes: [],
      constStatus: [-1, 1, 4, 5, -1, -1, 26],
      deliveryService: new DeliveryService(this)
    }
  },
  computed: {
    ...mapGetters({
      organizations: 'getOrganizationsGlobal',
      generalLoading: 'getLoading',
      shippers: 'getShippersByOrganization'
    }),
    permissionList() {
      return this.$store.getters.getRelevantEntities
    }
  },
  mounted () {
  },
  watch: {
    tabIndex () {
      this.form = {}
    }
  },

  methods: {
    getDeliveries (queryParams) {
      console.log(queryParams)
      if (['admin', 'superadmin'].includes(this.$session.get('cas_user').role)) {
        this.$store.dispatch('fetchService', {name: 'getAdminDeliveries', queryParams, id: 'getDeliveries'})
      } else if (this.$session.get('cas_user').role === 'marketplace') {
        this.$store.dispatch('fetchService', {name: 'getDeliveries', queryParams, params: {shipper_id: this.$session.get('cas_user').shipper.id}}) // getDeliveriesByMarketPlace
      } else if (this.$session.get('cas_user').role === 'company' || this.$session.get('cas_user').role === 'seller' || this.$session.get('cas_user').role === 'pudo') {
        this.$store.dispatch('fetchService', {name: 'getDeliveries', queryParams, params: {shipper_id: this.$session.get('cas_user').shipper.id}})
      } else {
        this.$alert(this.$t('msg-error-permission'))
        return null
      }
    },
    openModal () {
      // this.$toast({
      //   component: ToastificationContent,
      //   props: {
      //     title: 'Este filtro está actualmente deshabilitado',
      //     icon: 'BellIcon'
      //   }
      // })
      this.$bvModal.show('modalExtendedFilter')
    },
    collectFullFilter (data) {
      const filters = {}
      Object.keys(data).map(key => {
        filters[key] = data[key]
      })
      this.filters = {...filters}
      this.$bvModal.hide('modalExtendedFilter')
    },
    cleanForm (e) {
      this.form = {}
      this.filters = {}
    },
    openModalPickups () {
      this.$bvModal.show('modalPickups')
    }
  }
}
</script>

<style lang="scss">
  .button-create-pickup {
    top: -3.4rem !important;
    right: 0rem !important;
    position: absolute !important;
  }
</style>
