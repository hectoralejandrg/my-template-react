import { environment } from '@/environments/environment'
import useJwt from '@/auth/jwt/useJwt'

const services = [
  { name: 'getWarehouse', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/addresses`, method: 'get'},
  { name: 'getPickups', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/pickups`, method: 'get'},
  { name: 'getShippers', url: `${environment.madagascarApiUrl}/shippers`, method: 'get'},
  { name: 'saveEvaluatePickup', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/pickups/{id}/evaluations`, method: 'post'},
  { name: 'getPickupsAdmin', url: `${environment.madagascarApiUrl}/pickups`, method: 'get'},
  { name: 'savePickup', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/pickups`, method: 'post'}
]

export default class CreatePickupsService {
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
}
