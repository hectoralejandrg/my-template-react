import { environment } from '@/environments/environment'
import useJwt from '@/auth/jwt/useJwt'

const services = [
  { name: 'getCarriers', url: `${environment.tokyoApiUrl}/v1/carriers/carriers`, method: 'get', notCancel: true },
  { name: 'getCarrierDetails', url: `${environment.tokyoApiUrl}/v1/carriers/carriers/{carrier_id}`, method: 'get' },

  { name: 'updateCarrier', url: `${environment.tokyoApiUrl}/v1/carriers/carriers/{carrier_id}`, method: 'put' }

]

export default class CarriersService {
  constructor(context) {
    this.context = context
  }
  async callService(name, queryParams = {}, params = {}) {
    const service = services.filter(service => service.name === name)[0]
    return useJwt.genericService(service, queryParams, params)
  }

  async callMultipleServices(callArray, byName = false) {
    const servicesArray = callArray.map(call => ({ service: services.filter(service => service.name === call.name)[0], ...call }))
    return useJwt.genericMultipleService(servicesArray, byName)
  }
}
