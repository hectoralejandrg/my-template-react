import { environment } from '@/environments/environment'
import useJwt from '@/auth/jwt/useJwt'

const services = [
  { name: 'getAdminFolders', url: `${environment.madagascarApiUrl}/folders`, method: 'get' },
  { name: 'saveFolders', url: `${environment.madagascarApiUrl}/folders`, method: 'post' },
  { name: 'deleteFolders', url: `${environment.madagascarApiUrl}/folders/{folder_id}`, method: 'delete', notCancel: true },
  { name: 'updateFolders', url: `${environment.madagascarApiUrl}/folders/{folder_id}`, method: 'put' },

  { name: 'getOrganizations', url: `${environment.dubaiApiUrl}/organizations`, method: 'get' }
]

export default class FolderService {
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