import jwtDefaultConfig from './jwtDefaultConfig'
import * as fb from '@/firebase'
import store from '@/store'
import Cookies from 'js-cookie'

export default class JwtService {
  // Will be used by this service for making API calls
  axiosIns = null

  // jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig }

  // For Refreshing Token
  isAlreadyFetchingAccessToken = false

  // For Refreshing Token
  subscribers = []
  allMethods = ['GET', 'POST', 'DELETE', 'PUT']
  detectRelevantPermissions = ['shippers', 'organizations']
  
  objRelevantPermissions = {}

  calls = []
  count = 0
  constructor(axiosIns, jwtOverrideConfig) {
    this.detectRelevantPermissions.map(el => {
      this.objRelevantPermissions[el] = {}
      this.allMethods.map(method => {
        this.objRelevantPermissions[el][method] = {}
      })
    })
    this.axiosIns = axiosIns
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }
    
    // Request Interceptor
    this.axiosIns.interceptors.request.use(
      config => {
        // Get token from localStorage
        const accessToken = this.getToken()
        // If token is present add it to request's Authorization Header
        if (accessToken) {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
        }
        return config
      },
      error => Promise.reject(error)
    )

    // Add request/response interceptor
    this.axiosIns.interceptors.response.use(
      response => {
        // console.log({...response}.config)
        return response
      },
      error => {
        // const { config, response: { status } } = error
        const { config, response } = error
        const originalRequest = config
        // if (status === 401) {
        if (this.count < 10) {
          // console.log(this.count)
          if (response && response.status === 401) {
            if (!response.data.user) {
              if (!this.isAlreadyFetchingAccessToken) {
                this.isAlreadyFetchingAccessToken = true
                this.refreshToken().then(accessToken => {
                  this.isAlreadyFetchingAccessToken = false

                  // Update accessToken in localStorage
                  this.setToken(accessToken)
                  // this.setRefreshToken(refreshToken)

                  this.onAccessTokenFetched(accessToken)
                })
              }
              const retryOriginalRequest = new Promise(resolve => {
                this.addSubscriber(accessToken => {
                  // Make sure to assign accessToken according to your response.
                  // Check: https://pixinvent.ticksy.com/ticket/2413870
                  // Change Authorization header
                  originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
                  resolve(this.axiosIns(originalRequest))
                })
              })
              this.count++
              return retryOriginalRequest
            } else {
              console.log('error aqui', 1)
              return Promise.reject(response?.data || response || 'Generic error')
            }
          } else {
            console.log('error aqui', 2)
            return Promise.reject(response?.data || response || error || 'Generic error')
          }
        }
        console.log('error aqui', 3)
        return Promise.reject(response?.data || response || error || 'Generic error')
      }
    )
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter(callback => callback(accessToken))
  }

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }

  getToken() {
    // console.log(this.jwtConfig.storageTokenKeyName, localStorage.getItem(this.jwtConfig.storageTokenKeyName))  
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName)
  }

  setToken(value, origin = '') {
    // console.log(this.jwtConfig.storageTokenKeyName, value)
    if (localStorage.getItem('session_id')) {
      const session = localStorage.getItem('session_id').split('##') || []

      localStorage.setItem('session_id', `${session[0]}##${value}`)
      
      Cookies.set('session_id', `${session[0]}##${value}`)
    }
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)    
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value)
  }

  login(...args) {
    return this.axiosIns.post(this.jwtConfig.loginEndpoint, ...args)
  }

  register(...args) {
    return this.axiosIns.post(this.jwtConfig.registerEndpoint, ...args)
  }

  parseJwt (token) {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return `%${  (`00${  c.charCodeAt(0).toString(16)}`).slice(-2)}`
    }).join(''))

    return JSON.parse(jsonPayload)
  }
  setCookie (cname, cvalue, exdays) {
    const d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    const expires = `expires=${  d.toUTCString()}`
    document.cookie = `${cname  }=${  cvalue  };${  expires  };path=/`
  }
  findGetParameter(parameterName) {
    let result = null,
      tmp = []
    location.search
      .substr(1)
      .split('&')
      .forEach(function (item) {
        tmp = item.split('=')
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1])
      })
    return result
  }
  refreshToken() {
    if (fb.auth?.currentUser) {
      return fb.auth.currentUser.getIdToken(true)
    } else {
      let myToken = this.findGetParameter('token') || null
      if (!myToken) {
        myToken = localStorage.getItem('session_id').split('##')[1] || null
      }
      if (!myToken) {
        myToken = Cookies.get('session_id').split('##')[1] || null
      }
      let loggedUser = {}
      return fb.auth.signInWithCustomToken(myToken)
        .then((data) => {
          // this.$root.$data.auth.setPersistence(this.$root.$data.fb.auth.Auth.Persistence.LOCAL)
          loggedUser = data.user
          return data.user.getIdToken()
        })
        .then((token) => {
          store.dispatch('fetchUserData', {id: loggedUser.uid, token, from: 'external', remember: true})
          // this.goto(this.$route.params, 'mounted')
          return token
        })
        .catch(err => {
          console.error(err)
        })
    }
    // return this.axiosIns.post(this.jwtConfig.refreshEndpoint, {
    //   refreshToken: this.getRefreshToken()
    // })
  }

  generateExtraMenuAbility (permissions, prevKey) {
    let totalAbilities = []
    Object.keys(permissions).map(key => {
      if (key !== '*') {
        totalAbilities.push({action: key, subject: prevKey })
        if (permissions[key]) {
          totalAbilities = totalAbilities.concat(this.generateExtraMenuAbility(permissions[key], key))
        }
      }
    })
    return totalAbilities
  }

  generateEntityAbility (permission, key, entity) {
    const currentKey = !!entity ? `${key}.${entity}` : key
    const methods = permission.methods.includes('*') ? this.allMethods : permission.methods
    const totalAbilities = []
    // console.log(currentKey)
    // const objRelevantPermissions = {}
    methods.map(method => {
      const keyPermission =  this.detectRelevantPermissions.findIndex(el => key === el) !== -1 ? 'base' : key
      const indexRelevant = this.detectRelevantPermissions.findIndex(el => key.indexOf(`${el}.`) === 0 || key === el)
      if (indexRelevant !== -1) {
        const keyRelevantEntity = this.detectRelevantPermissions[indexRelevant]
        if (!this.objRelevantPermissions[keyRelevantEntity][method][keyPermission]) {
          this.objRelevantPermissions[keyRelevantEntity][method][keyPermission] = []
        }
        let newArrayEntity = []
        if (!!entity) {
          newArrayEntity = [...(this.objRelevantPermissions[keyRelevantEntity][method][keyPermission] || []).concat(entity)]
          if (newArrayEntity.includes('all')) newArrayEntity = ['all']
        } else {
          newArrayEntity = ['all']
        }
        this.objRelevantPermissions[keyRelevantEntity][method] = {
          ...this.objRelevantPermissions[keyRelevantEntity][method],
          [keyPermission]: [... new Set(newArrayEntity)]
        }
      }
      totalAbilities.push({ action: method, subject: currentKey})
    })
    return totalAbilities
  }

  generateExtraServicesAbility (currentBasePermissions, prevKey, permission) {
    let totalAbilities = []
    Object.keys(currentBasePermissions).map(key => {
      const newKey = `${prevKey}.${key}`
      if (key !== '*') {
        if (!permission.entities.includes('*')) {
          permission.entities.map(entity => {
            totalAbilities = totalAbilities.concat(this.generateEntityAbility(permission, newKey, entity))
          })
        } else {
          totalAbilities = totalAbilities.concat(this.generateEntityAbility(permission, newKey, null))
        }

        if (currentBasePermissions[key]) {
          const services = this.generateExtraServicesAbility(currentBasePermissions[key], newKey, permission)
          totalAbilities = totalAbilities.concat(services)
        }
      } else if (!permission.entities.includes('*')) {
        permission.entities.map(entity => {
          totalAbilities = totalAbilities.concat(this.generateEntityAbility(permission, prevKey, entity))
        })
      } else {
        totalAbilities = totalAbilities.concat(this.generateEntityAbility(permission, prevKey, null))
      }
    })
    return totalAbilities
  }

  generateServicesAbility (permissions, basePermissions) {
    let totalAbilities = []
    Object.keys(permissions).map(key => {
      if (key.indexOf('menu.') === -1) {
        const menuParts = key.split('.')
        permissions[key].map(permission => {
          if (menuParts[menuParts.length - 1] === '*') {
            const currentBase = this.getCurrentBasePermissions(menuParts, basePermissions)
            const service = this.generateExtraServicesAbility(currentBase, key.substring(0, key.length - 2), permission)
            totalAbilities = totalAbilities.concat(service)
          }
          
          if (!permission.entities.includes('*')) {
            permission.entities.map(entity => {
              totalAbilities = totalAbilities.concat(this.generateEntityAbility(permission, key, entity))
            })
          } else {
            totalAbilities = totalAbilities.concat(this.generateEntityAbility(permission, key, null))
          }
        })
      }
    })
    return totalAbilities
  }
  uniq_fast(a) {
    const seen = {}
    const out = []
    const len = a.length
    let j = 0
    for (let i = 0; i < len; i++) {
      const item = a[i]
      if (seen[item] !== 1) {
        seen[item] = 1
        out[j++] = item
      }
    }
    return out
  }

  generateAbility (permissions, basePermissions) {
    const services = this.generateServicesAbility(permissions, basePermissions)
    const totalAbilities = this.generateMenuAbility(permissions, basePermissions).concat(services)
    store.commit('setRelevantEntities', this.objRelevantPermissions)
    // console.log(services.shippers)
    // console.log(services.organizations)
    // totalAbilities.push({action: 'manage', subject: 'all'})
    totalAbilities.push({action: 'manage', subject: 'Auth'})
    totalAbilities.push({action: 'manage', subject: 'Dashboard'})
    totalAbilities.push({action: 'manage', subject: 'common'})
    const uniqAbilities = []
    totalAbilities.map(el => {
      if (uniqAbilities.findIndex(ua => ua.action === el.action && el.subject === ua.subject) === -1) {
        uniqAbilities.push(el)
      }
    })
    // return [...new Set(totalAbilities.sort((a, b) => `${a.action}${a.subject}` < `${b.action}${b.subject}` ? -1 : 0))]
    return uniqAbilities
    // if (permissions)
  }

  generateMenuAbility (permissions, basePermissions) {
    const indexMenuDefined = Object.keys(permissions).findIndex(el => el.indexOf('menu.') !== -1)
    let totalAbilities = []
    if (indexMenuDefined !== -1) {
      if (typeof permissions['menu.*'] !== 'undefined') {
        totalAbilities = totalAbilities.concat(this.generateExtraMenuAbility(basePermissions['menu'], 'menu'))
      } else {
        Object.keys(permissions).map(key => {
          if (key.indexOf('menu.') !== -1) {
            const menuParts = key.split('.')
            if (menuParts[menuParts.length - 1] === '*') {
              const currentBase = this.getCurrentBasePermissions(menuParts, basePermissions)
              totalAbilities.push({action: 'manage', subject: menuParts[menuParts.length - 2]})
              totalAbilities = totalAbilities.concat(this.generateExtraMenuAbility(currentBase, menuParts[menuParts.length - 2]))
            } else {
              menuParts.slice(1, menuParts.length).map((part, index) => {
                totalAbilities.push({action: part, subject: menuParts[index] })
              })
            }
          }
        })
      }
    }
    return totalAbilities
  }

  getCurrentBasePermissions (menuParts, basePermissions) {
    let curr = basePermissions[menuParts[0]]
    let lastPart = ''
    menuParts.map((part, index) => {
      if (index !== 0 && part !== '*') {
        curr = curr[part]
        lastPart = part
      }
    })
    return curr
  }

  validateService (service, queryParams, params) {
    let hasErrors = false
    let url = service.url
    let auxUrl = url
    if (params && Object.keys(params).length > 0) {
      let count = 0
      while (auxUrl.indexOf('{') !== -1 && auxUrl.indexOf('}') !== -1 && count < 20) {
        const index = [auxUrl.indexOf('{'), auxUrl.indexOf('}')]
        //reemplazo el {campo} por el valor del atributo campo dentro de params
        if (params[auxUrl.substring(index[0] + 1, index[1])]) {
          url = url.toString().replace(auxUrl.substring(index[0], index[1] + 1), params[auxUrl.substring(index[0] + 1, index[1])])
        } else {
          console.error(`-Missing param: ${auxUrl.substring(index[0] + 1, index[1])}`)
          hasErrors = true
        }
        auxUrl = auxUrl.substring(auxUrl.indexOf('}') + 1, auxUrl.length)
        count++
      }
    } else {
      let count = 0
      //Para mostrar los campos faltantes en params
      while (auxUrl.indexOf('{') !== -1 && auxUrl.indexOf('}') !== -1 && count < 20) {
        const index = [service.url.indexOf('{'), service.url.indexOf('}')]
        auxUrl = service.url.substring(service.url.indexOf('}') + 1, service.url.length)
        url = service.url.toString().replace(service.url.substring(index[0], index[1] + 1), '')
        console.error(`-Missing param: ${service.url.substring(index[0] + 1, index[1])}`)
        hasErrors = true
        count++
      }
    }
    const urlQuery = !!queryParams && Object.keys(queryParams).length > 0 ? new URL(url) : url
    if (queryParams && Object.keys(queryParams).length > 0 && service.method === 'get') Object.keys(queryParams).map(key => urlQuery.searchParams.append(key, queryParams[key]))
    return { urlQuery, hasErrors }
  }
  genericUploadFile (service, formData, params, waitingErrors = false) {
    service.headers = {
      ...(service.headers || {})
    }
    const { urlQuery, hasErrors } = this.validateService(service, null, params)
    return this.axiosIns({
      method: service.method,
      url: urlQuery,
      data: formData,
      headers: {...service.headers } || {'Content-type': 'application/json'},
      body: params
    })
      .then((response) => {
        return response.data
      })
      .catch((err) => {
        if (waitingErrors) {
          throw err
        } else if (err.response && err.response.data && err.response.data.data) {
          throw err.response.data.data 
        } else if (err.response && err.response.data && err.response.data.errors) {
          throw err.response.data.errors 
        } else {
          throw err
        }
      })
  }
  genericService(service, queryParams, params, config = {}) {
    const { urlQuery, hasErrors } = this.validateService(service, queryParams, params)
    if (hasErrors) {
      throw new Error('Servicio con errores')
    } else {
      
      const CancelToken = this.axiosIns.CancelToken
      const source = CancelToken.source()
      // this.calls.push(config.url.pathname)
      const indexCall = this.calls.findIndex(el => el.url === service.url)
      if (indexCall !== -1 && !service.notCancel) {
        this.calls[indexCall].executeCancel()
        this.calls = this.calls.filter((el, index) => index !== indexCall)
      }
      this.calls.push({url: service.url, cancel: source.token, executeCancel: source.cancel})
      // this.calls = this.calls.map(el => el !== response.config.url.pathname)
      return this.axiosIns({
        method: service.method,
        url: urlQuery,
        data: queryParams,
        headers: {...service.headers } || {'Content-type': 'application/json'},
        cancelToken: source.token,
        responseType: service?.responseType || 'json'
      })
        .then((response) => {
          this.calls = this.calls.filter(el => el.url !== `${response.config.url}`)
          return config?.fullResponse ? response : response.data
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.data) {
            throw err.response.data
          } else if (err?.constructor?.name !== 'Cancel') {
            if (err?.errors && err.errors.length && err.errors[0].message) {
              throw new Error(err.errors[0].message)
            } else if (err.message) {
              throw new Error(err.message)
            } else if (err.data) {
              throw new Error(err.data)
            } else {
              throw new Error(JSON.stringify(err))
            }
          } else throw err
        })
    }
  }
  genericMultipleService(callArray, byName) {
    const finalCallArray = []
    let hasErrors = false
    callArray.map(call => {
      const { service, queryParams, params } = call
      const validation = this.validateService(service, queryParams, params)
      const urlQuery = validation.urlQuery
      hasErrors |= validation.hasErrors
      const CancelToken = this.axiosIns.CancelToken
      const source = CancelToken.source()
      // this.calls.push(config.url.pathname)
      const indexCall = this.calls.findIndex(el => el.url === service.url)
      if (indexCall !== -1 && !service.notCancel) {
        this.calls[indexCall].executeCancel()
        this.calls = this.calls.filter((el, index) => index !== indexCall)
      }
      this.calls.push({url: service.url, cancel: source.token, executeCancel: source.cancel})
      finalCallArray.push(this.axiosIns({
        method: service.method,
        url: urlQuery,
        data: queryParams,
        headers: {...service.headers } || {'Content-type': 'application/json'},
        cancelToken: source.token
      }))
    })
    if (hasErrors) {
      throw new Error('Servicio con errores')
    } else {
      return Promise.all(finalCallArray)
        .then(responses => {
          if (byName) {
            const myObject = {}
            responses.map((resp, index) => {
              this.calls = this.calls.filter(el => el.url !== `${resp.config.url.origin}${resp.config.url.pathname}`)
              myObject[callArray[index].id || callArray[index].name] = resp?.data || {}
            })
            return myObject
          } else {
            return responses.map(resp => {
              this.calls = this.calls.filter(el => el.url !== `${resp.config.url.origin}${resp.config.url.pathname}`)
              return resp?.data || {}
            })
          }
        })
        .catch((errors) => {
          console.error(errors)
          if (errors?.constructor?.name !== 'Cancel') {
            if (errors?.errors && errors.errors.length && errors.errors[0].message) {
              throw new Error(errors.errors[0].message)
            } else if (errors.message) {
              throw new Error(errors.message)
            } else {
              throw new Error(JSON.stringify(errors))
            }
          } else return byName ? {} : []
        })
    }
  }
  genericDataUser (formData, dataUser) {
    formData.append('email', dataUser.email ?? '')
    formData.append('first_name', dataUser.fullName ? dataUser.fullName.split(' ')[0] : dataUser.first_name ?? '')
    formData.append('last_name', dataUser.fullName ? dataUser.fullName.split(' ')[0] : dataUser.last_name ?? '')
    formData.append('role', dataUser.role ?? '')
    return formData
  }
}
