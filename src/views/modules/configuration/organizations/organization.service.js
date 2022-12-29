import { environment } from '@/environments/environment'
import useJwt from '@/auth/jwt/useJwt'

const services = [
  { name: 'getAllOrganizations', url: `${environment.dubaiApiUrl}/organizations`, method: 'get'},
  { name: 'getOrganizations', url: `${environment.dubaiApiUrl}/organizations/{id}`, method: 'get'},
  { name: 'saveOrganization', url: `${environment.dubaiApiUrl}/organizations`, method: 'post' },
  { name: 'updateOrganization', url: `${environment.dubaiApiUrl}/organizations/{id}`, method: 'put' },
  { name: 'deleteOrganization', url: `${environment.dubaiApiUrl}/organizations/{id}`, method: 'delete', notCancel: true },
  
  { name: 'getCountries', url: `${environment.dubaiApiUrl}/countries`, method: 'get', notCancel: true},
  { name: 'getOrganizationTypes', url: `${environment.dubaiApiUrl}/organization-types`, method: 'get'}
]

export default class OrganizationService {
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