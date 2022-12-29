import axios from 'axios'

// export default class BaseService {
export default function (Vue) {
  
  function validateService (service, queryParams, params) {
    let hasErrors = false
    let url = service.url
    let auxUrl = url
    if (params && Object.keys(params).length > 0) {
      // while (auxUrl.indexOf('{') !== -1 && auxUrl.indexOf('}') !== -1) {
      //   const index = [service.url.indexOf('{'), service.url.indexOf('}')]
      //   auxUrl = service.url.substring(service.url.indexOf('}') + 1, service.url.length)
      //   //reemplazo el {campo} por el valor del atributo campo dentro de params
      //   if (params[service.url.substring(index[0] + 1, index[1])]) {
      //     url = service.url.toString().replace(service.url.substring(index[0], index[1] + 1), params[service.url.substring(index[0] + 1, index[1])])
      //   } else {
      //     console.error(`-Missing param: ${service.url.substring(index[0] + 1, index[1])}`)
      //     hasErrors = true
      //   }                    
      // }
    } else {
      //Para mostrar los campos faltantes en params
      while (auxUrl.indexOf('{') !== -1 && auxUrl.indexOf('}') !== -1) {
        const index = [service.url.indexOf('{'), service.url.indexOf('}')]
        auxUrl = service.url.substring(service.url.indexOf('}') + 1, service.url.length)
        url = service.url.toString().replace(service.url.substring(index[0], index[1] + 1), '')
        console.error(`-Missing param: ${service.url.substring(index[0] + 1, index[1])}`)
        hasErrors = true
      }
    }
    const urlQuery = !!queryParams && Object.keys(queryParams).length > 0 ? new URL(url) : url
    if (queryParams && Object.keys(queryParams).length > 0 && service.method === 'get') Object.keys(queryParams).map(key => urlQuery.searchParams.append(key, queryParams[key]))
    return { urlQuery, hasErrors }
  }
  Vue.prototype.$genericService = (service, queryParams, params) => {
    const { urlQuery, hasErrors } = validateService(service, queryParams, params)
    if (hasErrors) {
      throw new Error('Servicio con errores')
    } else {
      return axios({
        method: service.method,
        url: urlQuery,
        data: queryParams,
        headers: {...service.headers } || {'Content-type': 'application/json'}
      })
        .then((response) => {
          return response.data
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.data) {
            throw err.response.data
          } else {
            throw new Error(err)
          }
        })
    }
  }
  Vue.prototype.$genericMultipleService = (callArray, byName) => {
    const finalCallArray = []
    let hasErrors = false
    callArray.map(call => {
      const { service, queryParams, params } = call
      const validation = validateService(service, queryParams, params)
      const urlQuery = validation.urlQuery
      hasErrors |= validation.hasErrors
      finalCallArray.push(axios({
        method: service.method,
        url: urlQuery,
        data: queryParams,
        headers: service.headers || {'Content-type': 'application/json'}
      }))
    })
    if (hasErrors) {
      throw new Error('Servicio con errores')
    } else {
      return axios.all(finalCallArray).then(axios.spread((...responses) => {
        if (byName) {
          const myObject = {}
          responses.map((resp, index) => {
            myObject[callArray[index].name] = resp.data
          })
          return myObject
        } else {
          return responses.map(resp => resp.data)
        }
      })).catch((errors) => {
        throw new Error(errors)
      })
    }
  }
}