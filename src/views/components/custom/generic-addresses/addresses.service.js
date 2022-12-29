import { environment } from '@/environments/environment'
import useJwt from '@/auth/jwt/useJwt'

const services = [
  { name: 'getAllAddressesShipper', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/addresses`, method: 'get'},
  { name: 'getAddressShipper', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/addresses/{id}`, method: 'get'},
  { name: 'saveAddressShipper', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/addresses`, method: 'post' },
  { name: 'updateAddressShipper', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/addresses/{id}`, method: 'put' },
  { name: 'deleteAddressShipper', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/addresses/{id}`, method: 'delete', notCancel: true },

  { name: 'getAddressesTypes', url: `${environment.madagascarApiUrl}/address-types`, method: 'get'},
  { name: 'getShippers', url: `${environment.madagascarApiUrl}/shippers`, method: 'get'},
  { name: 'getCarriers', url: `${environment.madagascarApiUrl}/carriers`, method: 'get'},
  { name: 'getCountries', url: `${environment.dubaiApiUrl}/countries`, method: 'get', notCancel: true},
  { name: 'getOwnerTypes', url: `${environment.madagascarApiUrl}/owner-types`, method: 'get'},
  { name: 'getLevels', url: `${environment.dubaiApiUrl}/countries/{country}/levels`, method: 'get'},
  { name: 'getLevelsByLevelId', url: `${environment.dubaiApiUrl}/levels/{level_id}`, method: 'get'},
  { name: 'getGoogleAddress', url: `${environment.madagascarApiUrl}/maps`, method: 'get', notCancel: true}

]

export default class AddressesService {
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

  getAttributesField (id) {
    switch (id) {
    case 'shipper':
      return { service: 'getShippers', queryParams: { simplified: true } }
      // return { searchOnType: { fx: this.searchShipper, nChars: 3, debounce: 300}}
    default: 
      return { service: 'getCarriers', queryParams: { simplified: true } }
    }
  }

  formatSelect (id, data) {
    switch (id) {
    case 'getShippers':
      return data.map(el => ({...el, text: el.name1}))
    case 'getCarriers':
      return data.map(el => ({...el, text: el.name}))
      // return { searchOnType: { fx: this.searchShipper, nChars: 3, debounce: 300}}
    default: 
      return data
    }
  }

  // i18nImport (country) {
  //   const locales = require.context('./locales', true, `${country.toLowerCase()}.json`)
  //   console.log(locales)
  //   const messages = {}
  //   // locales.keys().forEach(key => {
  //   //   const matched = key.match(/([A-Za-z0-9-_.]+)\./i)
  //   //   if (matched && matched.length > 1) {
  //   //     if (matched[1].indexOf('-') !== -1) {
  //   //       const keyMatch = matched[1].split('-').map(k => `./${k}.json`)
  //   //       messages[matched[1].split('-')[0]] = {
  //   //         ...locales(key),
  //   //         ...locales(keyMatch[1])
  //   //       }
  //   //     } else {
  //   //       const locale = matched[1]
  //   //       messages[locale] = locales(key)
  //   //     }
  //   //   }
  //   // })
  //   return messages
  // }
}