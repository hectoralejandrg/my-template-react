import { environment } from '@/environments/environment'
import useJwt from '@/auth/jwt/useJwt'
const services = [
  { name: 'validateRecaptcha', url: `${environment.madagascarApiUrl}/recaptcha?response={response}&expectedAction={expectedAction}`, method: 'post' }
]

export default class Login {
  constructor (context) {
    this.context = context
  }
  
  async callService (name, queryParams = {}, params = {}) {
    const service = services.filter(service => service.name === name)[0]
    return useJwt.genericService(service, queryParams, params)
  }
}