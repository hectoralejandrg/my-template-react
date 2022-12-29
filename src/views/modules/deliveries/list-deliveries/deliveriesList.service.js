import { environment } from '@/environments/environment'
import useJwt from '@/auth/jwt/useJwt'

const services = [
  { name: 'getCarriers', url: `${environment.madagascarApiUrl}/carriers`, method: 'get'},
  { name: 'getShippers', url: `${environment.dubaiApiUrl}/shippers`, method: 'get'},
  { name: 'getCountries', url: `${environment.dubaiApiUrl}/countries`, method: 'get', notCancel: true},
  { name: 'getOrganizations', url: `${environment.dubaiApiUrl}/organizations`, method: 'get'},
  { name: 'getDeliveryStatus', url: `${environment.shanghaiApiUrl}/delivery-status`, method: 'get'},
  { name: 'getDeliveries', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/deliveries`, method: 'get'},
  { name: 'getAdminDeliveries', url: `${environment.madagascarApiUrl}/deliveries`, method: 'get'},
  { name: 'getShippersByOrganization', url: `${environment.dubaiApiUrl}/organizations/{organization_id}/shippers`, method: 'get'},
  { name: 'getDelivery', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/deliveries/{id}`, method: 'get'},
  { name: 'deleteDelivery', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/deliveries/{id}`, method: 'delete', notCancel: true},
  { name: 'updateDelivery', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/deliveries/{id}`, method: 'put' },
  { name: 'saveDelivery', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/deliveries`, method: 'post'},
  { name: 'openNewTicket', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/tickets`, method: 'post'},
  { name: 'getDeliveryStatuses', url: `${environment.shanghaiApiUrl}/delivery-statuses`, method: 'get'},
  { name: 'getDeliveryTypes', url: `${environment.madagascarApiUrl}/delivery-types`, method: 'get'},
  { name: 'getAddresses', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/addresses`, method: 'get'},
  
  { name: 'dispatchDelivery', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/deliveries/{delivery_id}/dispatcher`, method: 'post', notCancel: true},
  { name: 'deleteDelivery', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/deliveries/{id}`, method: 'delete', notCancel: true},
  { name: 'getTicketTypesByDelivery', url: `${environment.shanghaiApiUrl}/delivery-statuses/{code}/ticket-types`, method: 'get'}
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
          if ((el.id === 'getDeliveries' || el.name === 'getDeliveries') && response[el.id || el.name]) {
            obj[el.id || el.name] = this.parseRowsDeliveries(response[el.id || el.name].data)
            obj.total = response[el.id || el.name].links.meta.data_count
          }
          if ((el.id === 'getShippers' || el.name === 'getShippers') && response.getShippers) obj[el.id || el.name] = response.getShippers.data.map(c => ({...c, text: c.name1}))
          if ((el.id === 'getOrganizations' || el.name === 'getOrganizations') && response.getOrganizations) obj[el.id || el.name] = response.getOrganizations.data.map(c => ({...c, text: c.name}))
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
        status_name: `<span class="badge badge-light-warning">${el.order?.status?.status_name || el.order?.status?.status || el.order?.status?.name || ''}</span>`, //el.order.status.status,
        imported_id: el.order?.imported_id || '',
        tracking_number: el.order?.identifiers?.tracking_number || '',
        level4: el.destination?.address?.level4 || '',
        level3: el.destination?.address?.level3 || '',
        level2: el.destination?.address?.level2 || '',
        level1: el.destination?.address?.level1 || '',
        created_at: el.order?.status?.date ? this.context.$options.filters.dbDateToFormat(el.order.status.date, 'D T') : null,
        deadline_date: el.extra_fields ? el.extra_fields['fecha retiro'] : '',
        booleanNewTicket: el.order?.service_type === 'Pasarela' || el.shipper?.ticket_force_creation,
        booleanDelete: el.order?.status?.id && ![1, 4, 5, 12].includes(el.order?.status?.id),
        boolGenerateLabels: !el?.order?.status || ![1, 4].includes(el.order.status.status_id)
      }
    })
  }
}
