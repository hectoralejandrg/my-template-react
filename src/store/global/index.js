/*
####################################################################################
###################### Lasciate ogni speranza voi ch'entrate #######################
####################################################################################
#### Que los dioses se apiaden de la pobre alma que deba modificar este archivo ####
####################################################################################

Author: Pablo Sepúlveda A.K.A. (por nadie más que por mi) MrLooper
Date: 19-11-2021
Comments: Honestly, when I did this, I didn't really know how to use Vuex. 
So it's 40% knowledge, 30% improvisation and 30% luck that some things worked the 
way I thought they worked. 

####################################################################################
*/
import { getCurrentInstance } from '@vue/composition-api'



import * as fb from '@/firebase'
import * as globals from '@/utils/globals'
import useJwt from '@/auth/jwt/useJwt'
import { getTimeZones } from '@vvo/tzdb'
import BaseServices from '@/store/services/index'
const baseService = new BaseServices()

export default {
  state: {
    globalData: {},
    countries: [],
    organizationsGlobal: [],
    message: {},
    levels: [],
    formattedLevels: {},
    // Estos son loadings para servicios que debo volver a cargar al hacer guardados, actualizaciones o eliminaciones
    loading: {
      getCountries: true,
      getOrganizationsGlobal: true,
      globalData: true
    },
    session: {},
    modularPermissions: {}
  },
  getters: {
    getLoading: state => state.loading,
    getSession: state => state.session,
    getGlobalData: state => state.globalData,
    getCountries: state => state.countries,
    getMessage: state => state.message,
    getLevels: state => state.levels,
    getOrganizationsGlobal: state => state.organizationsGlobal,
    getFormattedLevels: state => state.formattedLevels,
    getModularPermissions: state => state.modularPermissions
  },
  mutations: {
    setSession (state, val) {
      state.session = val
    },
    setLevels (state, val) {
      state.levels = val?.level1 || []
    },
    setFormattedLevels (state, val) {
      state.formattedLevels = val
    },
    setOrganizationsGlobal (state, data) {
      state.organizationsGlobal = data.map(el => ({...el, text: el.name}))
    },
    setLoading(state, data) {
      const loading = state.loading
      loading[data.name] = data.status
      state.loading = {...loading}
    },
    setGlobalData(state, val) {
      const globalData = state.globalData
      globalData[val.id] = val.data
      state.globalData = {...globalData}

      const curr = JSON.parse(localStorage.getItem('globalData') || '{}')
      curr[val.id] = val.data
      localStorage.setItem('globalData', JSON.stringify(curr))
    },
    setCountries(state, val) {
      state.countries = val
    },
    setMessage(state, val) {
      state.message = val
    },
    setModularPermissions (state, val) {
      state.modularPermissions = val
    }
  },
  actions: {
    reloadService ({getters, dispatch, state}, reload) {
      const serviceReload = { 
        name: reload,
        queryParams: getters[reload]?.meta?.queryParams || null,
        params: getters[reload]?.meta?.params || null,
        total: getters[reload]?.meta?.total || 0
      }
      dispatch('fetchService', serviceReload)
    },
    generateResponse ({commit, state, dispatch, getters}, { service, response }) {
      // console.log({...service})
      const { name, id, queryParams = {}, params = {}, showSuccess = false, hideAlert = false, msg, reload, onSuccess } = service
      if (Object.keys(response).length > 0) {
        if (name.indexOf('get') === 0) {
          let data = null
          // Cuando el servicio get es de tipo listado, almacena la información relevante a la consulta del mismo; como los params, queryParams y el total de registros
          if (Array.isArray(response.data)) {
            data = {
              ...response,
              rows: response.data,
              meta: {
                ...response.meta,
                queryParams,
                params,
                current_page: response.meta?.current_page,
                pages: response.meta?.pages,
                rows_on_page: response.meta?.rows_on_page,
                total_rows: response.meta?.total_rows
              },
              total: response.links?.meta?.data_count || response.pagination?.total_items || response.meta?.total || null
            }
          } else {
            if (response.meta) {
              response.data ? response.data.meta = response.meta : response.data = response.meta
            }
            data = response.data
          }
          // Convierte todas las llamadas tipo get en un nombre de mutation.
          // es decir, getAlgo => setAlgo (reemplaza la g por una s namas)
          const setName = `s${(id || name).substr(1)}`
          // Todo lo anterior funciona gracias a la estandarización de llamadas
          commit(setName, data)
        }
        // Automatización de alertas generales en caso de exito si asi se desea
        const alertType = [
          { type: 'delete', word: 'eliminar-elemento' },
          { type: 'save', word: 'guardar' },
          { type: 'create', word: 'guardar' },
          { type: 'update', word: 'actualizar' }
        ]
        const word = alertType.filter(el => name.indexOf(el.type) === 0)[0]?.word || 'generico'
        if (showSuccess) {
          commit('setMessage', { text: `msg-exito-${msg || word}`, type: 'success' })
        }
        // Si al terminar la operación actual, debe recargar alguna información
        if (reload) {
          commit('setLoading', { name: reload, status: true })
          dispatch('reloadService', reload)
        }
        if (onSuccess) onSuccess(response)
      }
    },
    fetchMultipleServices ({commit, state, getters, dispatch}, { services, byName = false, showPackSuccess = false, hidePackAlert = false, packMsg, reload, onSuccess, onError }) {
      // Habilita el "cargando" de todos los elementos asociadas a la llamada y el return
      if (reload) commit('setLoading', { name: reload, status: true })
      if (byName) {
        services.map(service => {
          commit('setLoading', { name: service.id || service.name, status: true })
        })
      }
      // Verifica si es un paquete de llamadas identicas (como el caso de los delete)
      //falta validar que cuando sea byName = true, no haya 2 ids iguales
      const name = services[0].id || services[0].name
      const isPack = services.every(service => (name === (service.id || service.name)))

      baseService.callMultipleServices(services, byName)
        .then(response => {
          if ((byName && !!Object.keys(response)?.length) || (!byName && !!response?.length)) {
            // El listado de responses siempre viene en el mismo orden de la llamada
            services.map((service, index) => {
              const nameService = service.id || service.name
              // Se crea el nombre de las mutations
              const setName = `s${(nameService).substr(1)}`
              const identifier = byName ? nameService : index
              let data = response[identifier].data
              commit('setLoading', { name: (nameService), status: false })
              
              if (nameService.indexOf('get') === 0) {
                // Cuando el servicio get es de tipo listado, almacena la información relevante a la consulta del mismo como los params, queryParams y el total de registros
                if (Array.isArray(response[identifier]?.data)) {
                  data = {
                    rows: response[identifier].data,
                    meta: {
                      total: response[identifier].links?.meta?.data_count || null,
                      queryParams: service.queryParams,
                      params: service.params
                    }
                  }
                } 
                commit(setName, data)
              }
              if (service.onSuccess) service.onSuccess(data)
              // Si el servicio no es de tipo get, normalmente no nos interesa la respuesta más que saber si fue exitosa o no
              // Pero es posible que a futuro esto deba cambiar
            })

            // Se genera alerta de paquete si así se desea
            if (isPack && showPackSuccess) {
              const alertType = [
                { type: 'delete', word: 'eliminar-multiple' },
                { type: 'save', word: 'guardar-multiple' },
                { type: 'update', word: 'actualizar-multiple' },
                { type: 'get', word: 'cargar' }
              ]
              const word = alertType.filter(el => name.indexOf(el.type) === 0)[0]?.word || 'generico-multiple'
              commit('setMessage', { text: `msg-exito-${packMsg || word}`, type: 'success' })
            }
            // Faltaría generar alerta para llamadas que no sean tipo paquete

            // Si al terminar la operación actual, debe recargar alguna información
            if (reload) {
              commit('setLoading', { name: reload, status: true })
              dispatch('reloadService', reload)
            }
            if (onSuccess) onSuccess(response)
          // if (response.getCarriers) commit('setCarriers', response.getCarriers.data.map(carrier => ({ ...carrier, text: carrier.name })))
          // if (response.getDeliveryStatuses) commit('setDeliveryStatuses', response.getDeliveryStatuses.data.map(status => ({ ...status, text: status.name })))
          // if (response.getDeliveryTypes) commit('setDeliveryTypes', response.getDeliveryTypes.data.delivery_types.map(type => ({ id: type, text: type })))
          }
        })
        .catch(err => {
          if (reload) commit('setLoading', { name: reload, status: false })
          if (onError) onError(err)
          console.error(err)
          // Automatización de alertas generales en caso de error
          if (isPack || !hidePackAlert) {
            const alertType = [
              { type: 'delete', word: 'eliminar-multiple' },
              { type: 'save', word: 'guardar-multiple' },
              { type: 'update', word: 'actualizar-multiple' },
              { type: 'get', word: 'cargar' }
            ]
            const word = alertType.filter(el => name.indexOf(el.type) === 0)[0]?.word || 'generico-multiple'
            commit('setMessage', { text: `msg-problema-${packMsg || word}`, code: err, type: 'alert' })
          }
        })
    },
    fetchService ({ commit, dispatch }, service) {
      if (service.reload) commit('setLoading', { name: service.reload, status: true })
      commit('setLoading', { name: service.id || service.name, status: true })
      // Llamada común y silvestre de servicio
      baseService.callService(service.name, service.queryParams, service.params)
        .then(response => {
          commit('setLoading', { name: service.id || service.name, status: false })
          // Dispatch genérico para tratar con las respuestas
          dispatch('generateResponse', {service, response})
        })
        .catch(err => {
          if (service.reload) commit('setLoading', { name: service.reload, status: false })
          if (service.onError) service.onError(err)
          console.error(err)
          // Automatización de alertas generales en caso de error
          const alertType = [
            { type: 'delete', word: 'eliminar-elemento' },
            { type: 'save', word: 'guardar' },
            { type: 'create', word: 'guardar' },
            { type: 'update', word: 'actualizar' },
            { type: 'get', word: 'cargar' }
          ]
          const word = alertType.filter(el => service.name.indexOf(el.type) === 0)[0]?.word || 'generico'
          if (!service.hideAlert) {
            commit('setMessage', { text: `msg-problema-${service.msg || word}`, code: err, type: 'alert' })
          }
        })
    },





    fetchCountries ({ commit }, data) {
      baseService.callService('getCountries')
        .then(response => {
          commit('setCountries', response.data.map(el => ({...el, text: el.name})))
        })
        .catch(err => {
          console.error(err)
          commit('setMessage', { text: 'msg-problema-cargar-datos', code: err, type: 'alert' })
        })
    },
    fetchGlobalData({ commit, state, dispatch }, data) {
      useJwt.setToken(data.user.token)
      const services = [
        { name: 'getCountries'}
      ]
      commit('setLoading', { name: 'getCountries', status: true })
      commit('setLoading', { name: 'getGlobalData', status: true })
      if (['admin', 'superadmin'].includes(data.user.role)) {
        // services.push({ name: 'getOrganizationsGlobal', queryParams: { simplified: true }})
        // services.push({ name: 'getShippers', queryParams: { simplified: true, paginate_by: 99999, page: 1 }})
        commit('setLoading', { name: 'getOrganizationsGlobal', status: true })
        // commit('setLoading', { name: 'getShippers', status: true })
        baseService.callMultipleServices([{ name: 'getOrganizationsGlobal', queryParams: { simplified: true }}], true)
          .then(response => {
            commit('setLoading', { name: 'getOrganizationsGlobal', status: false })
            if (response.getOrganizationsGlobal?.data) {
              commit('setOrganizationsGlobal', response.getOrganizationsGlobal.data)
            }
          })
          .catch(err => {
            commit('setLoading', { name: 'getGlobalData', status: false })
            console.error(err)
            // commit('setMessage', { text: 'msg-problema-cargar-datos', code: err, type: 'alert' })
          })
      } else {
        commit('setLoading', { name: 'getOrganizationsGlobal', status: false })
        commit('setLoading', { name: 'getGlobalData', status: false })
      }

      baseService.callMultipleServices(services, true)
        .then(response => {
          commit('setLoading', { name: 'getCountries', status: false })
          // commit('setLoading', { name: 'getOrganizationsGlobal', status: false })
          const countries = response.getCountries.data.map(el => ({...el, text: el.name}))
          commit('setCountries', countries)

          data.user.country = countries.filter(country => {
            const myCountry = data.user.shipper?.country_id || data.user.shipper?.country?.id || 
            data.user.organization?.country?.id || data.user.organization?.country_id || 
            data.user.country?.id || data.user.country_id || 1
            return country.id === myCountry
          })[0]
          data.user.country._id = data.user.country.id
          if (!data.user.timezone) {
            data.user.timezone = getTimeZones().filter(tz => {
              return tz.currentTimeOffsetInMinutes === data.user.country.main_time_zone * 60 && tz.countryCode === data.user.country.code
            })[0]?.name || 'America/Santiago'
          }
          // if (response.getOrganizationsGlobal?.data) {
          //   commit('setOrganizationsGlobal', response.getOrganizationsGlobal.data)
          // }
          commit('setGlobalData', { id: 'countries', data: countries})
          commit('setIniUser', data.user)
          commit('setLoading', { name: 'getGlobalData', status: false })
          setTimeout(() => {
            document.getElementById('loading-bg').style.display = 'none'
            document.getElementById('loading-text').innerHTML = ''
          }, 500)
          if (data.onSuccess) data.onSuccess()
        })
        .catch(err => {
          commit('setLoading', { name: 'getGlobalData', status: false })
          console.error(err)
          commit('setMessage', { text: 'msg-problema-cargar-datos', code: err, type: 'alert' })
        })
    },
    fetchPermissions({ commit, state, dispatch }, data) {
      // console.log('fetchPermissions')
      commit('setLoading', { name: 'getGlobalData', status: true })
      const appLoading = document.getElementById('loading-text')
      appLoading.innerHTML = 'Configurando su cuenta'
      fb.resourcesPermissionsCollection.doc('default')
        .get()
        .then(resp => {
          useJwt.setToken(data.user.token, 'global state')
          // console.log(data.user.permissions, resp.data())
          data.user.ability = useJwt.generateAbility(data.user.permissions, resp.data())
          dispatch('fetchGlobalData', data)
        })
    },
    fetchSession({ commit }, data) {
      commit('setSession', data)
    }
  }
}