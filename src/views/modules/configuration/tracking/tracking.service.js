import { environment } from '@/environments/environment'
import useJwt from '@/auth/jwt/useJwt'

const services = [
  { name: 'getAllDeliveryStatuses', url: `${environment.shanghaiApiUrl}/delivery-statuses?page=1&limit=9999`, method: 'get' },
  { name: 'getDeliveryStatuses', url: `${environment.shanghaiApiUrl}/delivery-statuses`, method: 'get' },
  { name: 'getDeliveryStatus', url: `${environment.shanghaiApiUrl}/delivery-statuses/{id}`, method: 'get'},
  { name: 'saveDeliveryStatus', url: `${environment.shanghaiApiUrl}/delivery-statuses`, method: 'post' },
  { name: 'updateDeliveryStatus', url: `${environment.shanghaiApiUrl}/delivery-statuses/{id}`, method: 'put' },
  { name: 'deleteDeliveryStatus', url: `${environment.shanghaiApiUrl}/delivery-statuses/{id}`, method: 'delete', notCancel: true },

  { name: 'getAllCarrierStatuses', url: `${environment.shanghaiApiUrl}/delivery-carrier-statuses`, method: 'get'},
  { name: 'getCarrierStatus', url: `${environment.shanghaiApiUrl}/delivery-carrier-statuses/{id}`, method: 'get'},
  { name: 'saveCarrierStatus', url: `${environment.shanghaiApiUrl}/delivery-carrier-statuses`, method: 'post' },
  { name: 'updateCarrierStatus', url: `${environment.shanghaiApiUrl}/delivery-carrier-statuses/{id}`, method: 'put' },
  { name: 'deleteCarrierStatus', url: `${environment.shanghaiApiUrl}/delivery-carrier-statuses/{id}`, method: 'delete', notCancel: true },

  { name: 'getAllTranslations', url: `${environment.shanghaiApiUrl}/translations`, method: 'get'},
  { name: 'getTranslation', url: `${environment.shanghaiApiUrl}/translations/{id}`, method: 'get'},
  { name: 'saveTranslation', url: `${environment.shanghaiApiUrl}/translations`, method: 'post' },
  { name: 'updateTranslation', url: `${environment.shanghaiApiUrl}/translations/{id}`, method: 'put' },
  { name: 'deleteTranslation', url: `${environment.shanghaiApiUrl}/translations/{id}`, method: 'delete', notCancel: true },

  { name: 'getCarriers', url: `${environment.shanghaiApiUrl}/tracking-carriers`, method: 'get'},
  { name: 'getDeliveriesStatus', url: `${environment.shanghaiApiUrl}/carrier-statuses/{status}/deliveries`, method: 'get'}
]

export default class TrackingService {
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
   
  goToPlatform (path) {
    window.open(`${environment.platformUrl}/${path}`, '_blank')
  }
}