import { environment } from '@/environments/environment'
import useJwt from '@/auth/jwt/useJwt'

const services = [
  { name: 'getAllUsers', url: `${environment.apiUrl}/users`, method: 'get'},
  { name: 'getUser', url: `${environment.apiUrl}/admin-users/{id}`, method: 'get'},
  { name: 'saveUser', url: `${environment.apiUrl}/admin-users`, method: 'post' },
  { name: 'updateUser', url: `${environment.apiUrl}/admin-users/{id}`, method: 'put' },
  { name: 'deleteUser', url: `${environment.apiUrl}/admin-users/{id}`, method: 'delete', notCancel: true },

  { name: 'getShippers', url: `${environment.dubaiApiUrl}/shippers`, method: 'get'},
  { name: 'getOrganizations', url: `${environment.dubaiApiUrl}/organizations`, method: 'get', notCancel: true},
  { name: 'getCountries', url: `${environment.dubaiApiUrl}/countries`, method: 'get', notCancel: true},
  { name: 'getAddressesTypes', url: `${environment.madagascarApiUrl}/address-types`, method: 'get'},
  { name: 'getOrganizationTypes', url: `${environment.dubaiApiUrl}/organization-types`, method: 'get'},
  { name: 'getOwnerTypes', url: `${environment.madagascarApiUrl}/owner-types`, method: 'get'},
  { name: 'getFolders', url: `${environment.madagascarApiUrl}/folders`, method: 'get'}
]

export default class UsersService {
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
  async fbAddUser (This, data) {
    const fb = await This.$root.$data.fb()
    return fb.db.collection('accounts').add({...data}).then(() => {
      return 'ok'
    }).catch((error) => {
      throw error
    })
  }
  async fbUpdateUser (This, data, id) {
    const fb = await This.$root.$data.fb()
    return fb.db.collection('accounts').doc(id).update({...data}).then(() => {
      return 'ok'
    }).catch((error) => {
      throw error
    })
  }
  async fbDeleteUser (This, id) {
    const fb = await This.$root.$data.fb()
    return fb.db.collection('accounts').doc(id).delete().then(() => {
      return 'ok'
    }).catch((error) => {
      throw error
    })
  }
  async fbDeleteMultipleUsers (This, elements) {
    const fb = await This.$root.$data.fb()
    const batch = fb.db.batch()
    elements.map(doc => {
      const docRef = fb.db.collection('accounts').doc(doc)
      batch.delete(docRef)
    })
    return batch.commit()
      .then(resp => resp)
      .catch(err => err)
  }
}