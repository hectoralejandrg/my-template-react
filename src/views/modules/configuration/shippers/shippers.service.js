import { environment } from '@/environments/environment'
import useJwt from '@/auth/jwt/useJwt'

const services = [
  { name: 'getAdminShippers', url: `${environment.dubaiApiUrl}/shippers`, method: 'get' },
  { name: 'saveShippers', url: `${environment.dubaiApiUrl}/shippers`, method: 'post' },
  { name: 'getShipper', url: `${environment.dubaiApiUrl}/shippers/{shipper_id}`, method: 'get' },
  { name: 'deleteShippers', url: `${environment.dubaiApiUrl}/shippers/{shipper_id}`, method: 'delete', notCancel: true },
  { name: 'updateShippers', url: `${environment.dubaiApiUrl}/shippers/{shipper_id}`, method: 'put' },

  { name: 'getAddressShipper', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/addresses/{id}`, method: 'get'},
  { name: 'saveAddressShipper', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/addresses`, method: 'post' },
  { name: 'updateAddressShipper', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/addresses/{id}`, method: 'put' },
  { name: 'getCountries', url: `${environment.dubaiApiUrl}/countries`, method: 'get', notCancel: true },
  { name: 'getLevels', url: `${environment.dubaiApiUrl}/countries/{country}/levels`, method: 'get'},
  { name: 'getOrganizations', url: `${environment.dubaiApiUrl}/organizations`, method: 'get' },
  { name: 'getOrganization', url: `${environment.dubaiApiUrl}/organizations/{id}`, method: 'get' },
  { name: 'getGoogleAddress', url: `${environment.madagascarApiUrl}/maps`, method: 'get', notCancel: true},
  { name: 'getWarehousesByShipper', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/addresses?type=warehouse`, method: 'get'}
]

export default class ShipperService {
  constructor (context) {
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
}