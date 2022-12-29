import { environment } from '@/environments/environment'
import useJwt from '@/auth/jwt/useJwt'
import deliveries from './deliveries'
import organizations from './organizations'
import global from './global'
import shippers from './shippers'
import integrations from './integrations'
import tickets from './tickets'
import ratesQuoter from './ratesQuoter'

const services = [
  // Global

  ...organizations,
  ...deliveries,
  ...global,
  ...shippers,
  ...integrations,
  ...tickets,
  ...ratesQuoter,

  { name: 'getCarriers', url: `${environment.madagascarApiUrl}/carriers`, method: 'get' },
  { name: 'getCarriersByShipper', url: `${environment.nippurApiUrl}/shippers/{shipper_id}/carriers`, method: 'get' },
  { name: 'getCarriersByOrganization', url: `${environment.nippurApiUrl}/organizations/{organization_id}/carriers`, method: 'get' },
  { name: 'getTrackingCarriers', url: `${environment.madagascarApiUrl}/tracking-carriers`, method: 'get' },
  { name: 'getAddresses', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/addresses`, method: 'get' },
  { name: 'getManageBillingData', url: `${environment.newyorkApiUrl}/v1/billing/companies`, method: 'get' },
  { name: 'openNewTicket', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/tickets`, method: 'post' },
  { name: 'getShippersByOrganization', url: `${environment.dubaiApiUrl}/organizations/{organization_id}/shippers`, method: 'get' },
  { name: 'getTrackingCarriers', url: `${environment.madagascarApiUrl}/tracking-carriers`, method: 'get' },
  { name: 'getAddresses', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/addresses`, method: 'get' },
  { name: 'openNewTicket', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/tickets`, method: 'post' },
  { name: 'getShippersByOrganization', url: `${environment.madagascarApiUrl}/organizations/{organization_id}/shippers`, method: 'get' }
]

export default class BaseServices {
  async callService(name, queryParams = {}, params = {}, config = {}) {
    const service = services.filter(service => service.name === name)[0]
    return useJwt.genericService(service, queryParams, params, config)
  }

  async callMultipleServices(callArray, byName = false) {
    const servicesArray = callArray.map(call => ({ service: services.filter(service => service.name === call.name)[0], ...call }))
    return useJwt.genericMultipleService(servicesArray, byName)
  }
  async callSpecialUploadFile (name, file, params = {}, user = {}) {
    let formData = new FormData()
    formData = useJwt.genericDataUser(formData, user)
    formData.append('file', file)
    const service = services.filter(service => service.name === name)[0]
    return useJwt.genericUploadFile(service, formData, params, true)
  }
  async callUploadFile (name, data, params = {}, user = {}) {
    let formData = new FormData()
    formData = useJwt.genericDataUser(formData, user)
    if (data.file) formData.append('file', data.file)
    if (data.new_date) formData.append('new_date', data.new_date)
    if (data.user_id) formData.append('user_id', data.user_id)
    if (data.validity_date) formData.append('validity_date', data.validity_date)
    const service = services.filter(service => service.name === name)[0]
    return useJwt.genericUploadFile(service, formData, params, true)
  }
}
