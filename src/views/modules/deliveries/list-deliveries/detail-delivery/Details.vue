<template>
  <div v-show="loading.tabs">
    <b-card no-body>
      <b-card-body class="statistics-body">
        <div class="row">
          <div class="col-sm-4 col-md-2" v-for="(item, index) in headerInfo" :key="index" :class="item.customClass">
            <media-info v-bind="item"></media-info>
          </div>
        </div>
      </b-card-body>
    </b-card>
    <b-card>
      <div class="push-right">
        <b-button variant="light" class="mr-1">Ver comprobrante de entrega</b-button>
        <b-button variant="info" class="mr-1">Eliminar tracking</b-button>
        <b-button variant="warning" class="mr-1" disabled>Reinyectar envío</b-button>
        <b-button variant="danger" class="mr-1"><feather-icon icon="PlusIcon" />Forzar tracking</b-button>
      </div>
    </b-card>
    <b-card>
      <tabs :currentDelivery="currentDelivery" :statusTrackings.sync="statusTrackings" :countries.sync="countries" :organizations.sync="organizations" :statusAllowEditDelivery="statusAllowEditDelivery"></tabs>
    </b-card>
  </div>
</template>

<script>

import Tabs from './Tabs.vue'
import DeliveriesListService from '../deliveriesList.service'
import { dataTool } from 'echarts/lib/echarts'

export default {
  components: { Tabs },

  data () {
    return {
      headerInfo: [],
      currentDelivery: {},
      statusTrackings: [],
      countries: [],
      organizations: [],
      addresses: [],
      statusAllowEditDelivery: false,
      loading: {
        tabs: false
      },
      deliveriesListService: new DeliveriesListService(this)
    }
  },

  mounted() {
    this.getDelivery()
  },

  methods: {
    getDelivery () {
      const params = {
        shipper_id: this.$route.params.shipper_id, 
        id: this.$route.params.id
      }
      const arrServices = []
      if (['admin', 'superadmin'].includes(this.$session.get('cas_user').role)) { // (this.$ability.can('GET', 'deliveries') || this.$ability.can('GET', 'deliveries.*'))
        arrServices.push({name:'getDelivery', params, id: 'getDelivery'})
        arrServices.push({name:'getCarriers', id: 'getCarriers'})
        arrServices.push({name:'getAddresses', queryParams: {paginate_by: 9999, page: 1}, params: {shipper_id: this.$route.params.shipper_id}, id: 'getAddresses' })
        arrServices.push({name:'getCountries', id: 'getCountries'})
        // arrServices.push({name:'getOrganizations', queryParams: { limit: 9999, page: 1 }, id: 'getOrganizations'})
      } else {
        this.$alert(this.$t('msg-error-permission'))
        return null
      }
      this.deliveriesListService.callMultipleServices(arrServices, true)
        .then(response => {
          if (!!response) {
            if (response.getCountries) {
              this.countries = response.getCountries.data
            }
            // this.organizations = response.getOrganizations.data
            if (response.getAddresses) {
              this.addresses = response.getAddresses.data.map(el => ({...el, text: el.name}))
              console.log(this.addresses)
            }
            // this.carriers = response.getCarriers.data
            if (response.getDelivery) {
              this.setCurrentDelivery(response.getDelivery.data)
              this.setDataHeaderInfo(response.getDelivery.data)
              this.setTrackings(response.getDelivery.data)
              this.setStatusAllowEditDelivery(response.getDelivery.data)
            }
            this.loading.tabs = true
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    setDataHeaderInfo (data) {
      const carrier = { code: 'PDY', text: 'Pedidos YA'}
      // const carrier = this.carriers.filter(el => el.code === data.carrier.code)
      this.headerInfo = [
        {icon: 'TruckIcon', customClass: '', variant: 'light-light', title: 'Envio (Carrier)', content: data.carrier.code},
        {icon: 'MapPinIcon', customClass: '', variant: 'light-light', title: 'Destino', content: data.destination?.address?.level1 ? data.destination?.address?.level1 : 'No disponible' },
        {icon: 'ClockIcon', customClass: '', variant: 'light-light', title: 'Tiempo de transito', content: '3 día(s) habíl(es)'},
        {icon: 'CalendarIcon', customClass: '', variant: 'light-light', title: 'Fecha de compromiso', content: data.extra_fields ? data.extra_fields['fecha retiro'] : 'No disponible'},
        {icon: 'SendIcon', customClass: '', variant: 'light-light', title: 'Envío tipo', content: data.order?.type_status ? data.order?.type_status : 'No disponible' },
        {icon: 'FileIcon', customClass: '', variant: 'light-light', title: 'Manifiesto', content: 'Nº 12398172938'}
      ]
    },
    setTrackings(data) {
      this.statusTrackings = data.order.trackings.map(el => {
        return {
          ...el,
          status: el.status_name || el.name || el.status,
          format_date: el.date
        }
      })
    },
    setCurrentDelivery (data) {
      const infoDeliveryForm = {
        id: data.order.id,
        organization_id: data.shipper.organization_id,
        shipper_id: data.shipper.id,
        deliverysNumber: data.order.imported_id,
        dni: data.destination.contact.dni,
        email: data.destination.contact.email,
        name: data.destination.contact.name,
        phone: data.destination.contact.phone,
        level1Text: data.destination.address.level1 ? data.destination.address.level1 : '',
        level2Text: data.destination.address.level2 ? data.destination.address.level2 : '',
        level3Text: data.destination.address.level3 ? data.destination.address.level3 : '',
        level4Text: data.destination.address.level4 ? data.destination.address.level4 : '',
        level1: data.destination.address.level1 ? data.destination.address.level1 : '',
        level2: data.destination.address.level2 ? data.destination.address.level2 : '',
        level3: data.destination.address.level3 ? data.destination.address.level3 : '',
        level4: data.destination.address.level4 ? data.destination.address.level4 : '',
        autocomplete: {
          id: data.destination.address.geocode_api,
          text: `${data.destination.address.street_name}, ${data.destination.address.street_number}`,
          name: `${data.destination.address.street_name}, ${data.destination.address.street_number}`,
          formatted_address: data.destination.address.formatted_address,
          full_address: data.destination.address.full_address,
          geocode_api: data.destination.address.geocode_api,
          geocode_data: data.destination.address.geocode_data,
          location: data.destination.address.location,
          street_name: data.destination.address.street_name,
          street_number: data.destination.address.street_number
        },
        destination_code: data.destination.code,
        street_name: data.destination.address.street_name,
        street_number: data.destination.address.street_number,
        zipcode: data.destination.address.zip_code,
        addressDetail: data.destination.address.information,
        // observations: data.extra_fields?.observations || '',
        qty: data.order.packages.length,
        // packages: data.order.packages,
        distributionType: data.destination.type === 'home' ?  { id: 'address', text: this.$t('Domicilio') } : { id: 'pudo', text: this.$t('Punto de retiro') }
      }
      this.currentDelivery = {
        ...data,
        infoDeliveryForm,
        booleanNewTicket: data?.order?.service_type !== 'Pasarela' || data?.shipper?.ticket_force_creation === false
      }
      // this.currentDelivery.shipper.country = this.countries.filter(el => el.id === data.shipper.country_id)[0]
      // this.currentDelivery.shipper.organization = this.organizations.filter(el => el.id === data.shipper.organization_id)[0]
      this.currentDelivery.infoDeliveryForm.warehouse = this.addresses.filter(el => el.code === data.origin.code)[0]
      console.log(this.addresses)
    },
    setStatusAllowEditDelivery (data) {
      if (data.order.status.status_id === 1 || data.order.status.status_id === 4) {
        this.statusAllowEditDelivery = true
      } else this.statusAllowEditDelivery = false
    }
  }
}
</script>