import { environment } from '@/environments/environment'
import useJwt from '@/auth/jwt/useJwt'

const services = [
  { name: 'getOrganizations', url: `${environment.dubaiApiUrl}/organizations`, method: 'get'},
  { name: 'getCarriers', url: `${environment.madagascarApiUrl}/carriers`, method: 'get'},
  { name: 'getCountry', url: `${environment.dubaiApiUrl}/countries/{id}`, method: 'get'},
  { name: 'getShippers', url: `${environment.madagascarApiUrl}/shippers`, method: 'get'},
  { name: 'getOrganizations', url: `${environment.dubaiApiUrl}/organizations`, method: 'get'},
  { name: 'getShippersByOrganization', url: `${environment.dubaiApiUrl}/organizations/{organization_id}/shippers`, method: 'get'},
  { name: 'getDeliveries', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/deliveries`, method: 'get'},
  { name: 'getAdminDeliveries', url: `${environment.madagascarApiUrl}/deliveries`, method: 'get'},
  { name: 'getLevels', url: `${environment.dubaiApiUrl}/countries/{country}/levels`, method: 'get'},
  { name: 'getLevelsByLevelId', url: `${environment.dubaiApiUrl}/levels/{level_id}`, method: 'get'},
  { name: 'getDeliveryStatuses', url: `${environment.apiUrl}/delivery-statuses`, method: 'get'},
  { name: 'getAddresses', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/addresses`, method: 'get'},
  { name: 'getPudos', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/addresses?type=pudo`, method: 'get'},
  { name: 'getWarehouses', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/addresses?type=warehouse`, method: 'get'},
  { name: 'getDeliveryTypes', url: `${environment.madagascarApiUrl}/delivery-types`, method: 'get'},
  { name: 'getCarriersByShipper', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/carriers`, method: 'get', notCancel: true},

  
  { name: 'deleteDelivery', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/deliveries/{id}`, method: 'delete', notCancel: true},
  { name: 'updateDelivery', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/deliveries/{id}`, method: 'put' },
  { name: 'postDelivery', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/deliveries`, method: 'post'},
  { name: 'dispatchDelivery', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/deliveries/{delivery_id}/dispatcher`, method: 'post', notCancel: true},
  { name: 'getGoogleAddress', url: `${environment.madagascarApiUrl}/maps`, method: 'get', notCancel: true}
]

export default class DeliveryService {
  constructor(context) {
    this.context = context
  }
  async callService (name, queryParams = {}, params = {}) {
    const service = services.filter(service => service.name === name)[0]
    return useJwt.genericService(service, queryParams, params)
  }
  
  async callMultipleServices (callArray, byName = false) {
    const servicesArray = callArray.map(call => ({ service: services.filter(service => service.name === call.name)[0], ...call }))
    return useJwt.genericMultipleService(servicesArray, byName)
  }

  getDeliveriesByStatusId (arrServices) {
    return this.callMultipleServices(arrServices, true)
      .then(response => {
        const obj = {}
        arrServices.map(el => {
          if (el.id === 'getDeliveries' && response.getDeliveries) {
            obj[el.id || el.name] = this.parseRowsDeliveries(response[el.id || el.name].data)
            obj.total = response[el.id || el.name].links.meta.data_count
          }
          if (el.id === 'getShippers' && response.getShippers) obj[el.id || el.name] = response.getShippers.data.map(c => ({...c, text: c.name1}))
          if (el.id === 'getOrganizations' && response.getOrganizations) obj[el.id || el.name] = response.getOrganizations.data.map(c => ({...c, text: c.name}))
        })
        return obj
      })
      .catch(err => {
        console.error(err)
        this.context.$alert(this.context.$t('msg-problema-cargar-datos', {code: err}))
        return []
      })
  }
  
  parseRowsDeliveries (list) {
    return list.map(el => {
      return {
        ...el,
        id: el.order.id,
        shipper_name: el.shipper?.name1 || '',
        carrier_name: el.carrier?.code || '',
        status_name: `<span class="badge badge-light-warning">${el.order?.status?.status || el.order?.status?.name || ''}</span>`, //el.order.status.status,
        imported_id: el.order?.imported_id || '',
        tracking_number: el.order?.identifiers?.tracking_number || '',
        level4: el.destination?.address?.level4 || '',
        level3: el.destination?.address?.level3 || '',
        level2: el.destination?.address?.level2 || '',
        level1: el.destination?.address?.level1 || '',
        created_at: el.order?.status?.date ? this.context.$options.filters.dbDateToFormat(el.order.status.date, 'D T') : null,
        deadline_date: el.extra_fields ? el.extra_fields['fecha retiro'] : '',
        booleanNewTicket: el.order?.service_type === 'Pasarela' || el.shipper?.ticket_force_creation
      }
    })
  }
}
