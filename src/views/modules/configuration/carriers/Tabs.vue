<template>
  <div>
    <b-card>
      <div class="button-open-modal" v-show="[1, 2, 3, 5].includes(tabIndex)">
        <b-button variant="warning" class="push-right" @click="() => openModal(null)" :disabled="loading.button"><feather-icon icon="PlusIcon"/> Nuevo </b-button>
      </div>
      <b-tabs align="left" class="tab-primary" v-model="tabIndex">
        <b-tab>
          <template #title>
            <div class="tab-title">
              <feather-icon icon="SendIcon" />
              <span> {{$t('Datos generales')}} </span>
            </div>
          </template>
          <generals></generals>
        </b-tab>
        <b-tab lazy>
          <template #title>
            <div>
              <feather-icon icon="FileTextIcon" />
              <span> {{$t('Productos')}} </span>
            </div>
          </template>
          <products :formTab="form" :openModal="openModal"></products>
        </b-tab>
        <b-tab lazy>
          <template #title>
            <div>
              <feather-icon icon="FileTextIcon" />
              <span> {{$t('Servicios')}} </span>
            </div>
          </template>
          <services :formTab="form" :openModal="openModal"></services>
        </b-tab>
        <b-tab lazy>
          <template #title>
            <div>
              <feather-icon icon="PrinterIcon" />
              <span> {{$t('Atributos')}} </span>
            </div>
          </template>
          <attributes></attributes>
        </b-tab>
        <b-tab lazy>
          <template #title>
            <div class="tab-title">
              <feather-icon icon="FileIcon" />
              <span> {{$t('Configuración')}} </span>
            </div>
          </template>
          <configuration></configuration>
        </b-tab>
        <b-tab lazy>
          <template #title>
            <div class="tab-title">
              <feather-icon icon="FileIcon" />
              <span> {{$t('Configuración de solicitudes')}} </span>
            </div>
          </template>
          <configuration-request></configuration-request>
        </b-tab>
        <b-tab lazy>
          <template #title>
            <div class="tab-title">
              <feather-icon icon="TruckIcon" />
              <span> {{$t('Bitacora')}} </span>
            </div>
          </template>
          <logbook></logbook>
        </b-tab>
      </b-tabs>
      <modal-products :formTab="form" @result="modalResult"></modal-products>
      <modal-carrier-services :formTab="form" @result="modalResult"></modal-carrier-services>
    </b-card>
  </div>
</template>
<script>
import Generals from './generals/Generals.vue'
import Products from './products/Products.vue'
import ModalProducts from './products/ModalProducts.vue'
import Services from './carrier-services/CarrierServices.vue'
import ModalCarrierServices from './carrier-services/ModalCarrierServices.vue'
import Attributes from './attributes/Attributes.vue'
import Configuration from './configuration/Configuration.vue'
import ConfigurationRequest from './configuration-request/ConfigurationRequest.vue'
import Logbook from './logbook/Logbook.vue'
import CarriersService from './carriers.service'

export default {
  components: {
    Generals,
    Products,
    ModalProducts,
    Services,
    ModalCarrierServices,
    Attributes,
    Configuration,
    ConfigurationRequest,
    Logbook
  },
  data () {
    return {
      form: {},
      tabIndex: 0,
      modalStatus: false,
      loading: {
        button: false,
        initial: true
      },
      carriersService: new CarriersService(this)
    }
  },
  watch: {
    tabIndex () {
      this.form = {}
    }
  },
  mounted () {
    this.getAllServices()
  },
  methods: {
    getAllServices () {
      const services = []
      // services.push({ name: 'getCountries' })
      // this.$store.dispatch('fetchCountries')
      // this.carriersService.callMultipleServices(services, true)
      //   .then(response => {
      //     if (response?.getCountries) {
      //       this.carriers = response.getCountries.data.map(el => ({...el, id: el.code, text: el.name}))
      //     }
      //   })
    },
    openModal (data) {
      if (data) this.form = data
      else this.form = {}
      switch (this.tabIndex) {
      case 1:
        this.$bvModal.show('modalProducts')
        break
      case 2:
        this.$bvModal.show('modalCarrierServices')
        break
      default:
        break
      }
    },
    modalResult (data) {
      switch (this.tabIndex) {
      case 1:
        // save
        break
      case 2:
        // save
        break
      default:
        break
      }
    }
  }
}
</script>

<style lang="scss">
  .button-open-modal {
    top: -3.4rem !important;
    right: 0rem !important;
    position: absolute !important;
  }
</style>
