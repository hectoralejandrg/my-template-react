import BaseServices from '@/store/services/index'
const baseService = new BaseServices()

export default {
  state: {
    getCountriesRatesQuoter: [],
    getPlacesRatesQuoter: [],
    getCarriersRatesQuoter: [],
    getServicesNY: [],
    getCategoryServiceRatesQuoter: [],
    getRatesRatesQuoter: [],
    getServiceRatesQuoter: [],
    getPricesRatesQuoter: [],
    getCostsRatesQuoter: [],
    getCarriersForCountry: [],
    getOriginsNY: [],
    getDestinationsNY: []
  },

  getters: {
    getCountriesRatesQuoter: state => state.getCountriesRatesQuoter,
    getPlacesRatesQuoter: state => state.getPlacesRatesQuoter,
    getCarriersRatesQuoter: state => state.getCarriersRatesQuoter,
    getServicesNY: state => state.getServicesNY,
    getCategoryServiceRatesQuoter: state => state.getCategoryServiceRatesQuoter,
    getRatesRatesQuoter: state => state.getRatesRatesQuoter,
    getServiceRatesQuoter: state => state.getServiceRatesQuoter,
    getPricesRatesQuoter: state => state.getPricesRatesQuoter,
    getCostsRatesQuoter: state => state.getCostsRatesQuoter,
    getCarriersForCountry: state => state.getCarriersForCountry,
    getOriginsNY: state => state.getOriginsNY,
    getDestinationsNY: state => state.getDestinationsNY
  },

  mutations: {
    setCountriesRatesQuoter(state, val) {
      state.getCountriesRatesQuoter = {
        rows: val.rows.map(el => ({...el, text: el.name}))
      }
    },
    setPlacesRatesQuoter(state, val) {
      if (val) {
        state.getPlacesRatesQuoter = {
          rows: val.places.map(el => ({...el, text: el.name}))
        }
      } else {
        state.getPlacesRatesQuoter = {
          rows: []
        }
      }
    },
    setCarriersRatesQuoter(state, val) {
      if (val) {
        state.getCarriersRatesQuoter = {
          rows: val.data.map(el => ({...el, text: el.name}))
        }
      } else {
        state.getCarriersRatesQuoter = {
          rows: []
        }
      }
    },
    setServicesNY(state, val) {
      if (val) {
        state.getServicesNY = {
          rows: val.data.map(el => ({...el, text: el.name}))
        }
      } else {
        state.getServicesNY = {
          rows: []
        }
      }
    },
    setCategoryServiceRatesQuoter(state, val) {
      if (val) {
        state.getCategoryServiceRatesQuoter = {
          rows: val.data.map((el) => ({...el, id: el.id, text: el.name, code: el.type}))
        }
      } else {
        state.getCategoryServiceRatesQuoter = {
          rows: []
        }
      }
    },
    setRatesRatesQuoter(state, val) {
      if (val) {
        state.getRatesRatesQuoter = {
          rows: val.data
        }
      } else {
        state.getRatesRatesQuoter = {
          rows: []
        }
      }
    },
    setServiceRatesQuoter(state, val) {
      if (val) {
        state.getServiceRatesQuoter = {
          rows: val.data.map((el) => ({...el, text: el.name}))
        }
      } else {
        state.getServiceRatesQuoter = {
          rows: []
        }
      }
    },
    setPricesRatesQuoter(state, val) {
      if (val) {
        state.getPricesRatesQuoter = {
          rows: val.data
        }
      } else {
        state.getPricesRatesQuoter = {
          rows: []
        }
      }
    },
    setCostsRatesQuoter(state, val) {
      if (val) {
        state.getCostsRatesQuoter = {
          rows: val.data
        }
      } else {
        state.getCostsRatesQuoter = {
          rows: []
        }
      }
    },
    setCarriersForCountry(state, val) {
      if (val) {
        state.getCarriersForCountry = {
          rows: val.data.map((el) => ({...el, text: el.name}))
        }
      } else {
        state.getCarriersForCountry = {
          rows: []
        }
      }
    },
    setOriginsNY(state, val) {
      if (val) {
        state.getOriginsNY = {
          rows: val.data.map((el) => ({...el, text: el.name})),
          meta: val.meta
        }
      } else {
        state.getOriginsNY = {
          rows: []
        }
      }
    },
    setDestinationsNY(state, val) {
      if (val) {
        state.getDestinationsNY = {
          rows: val.data.map((el) => ({...el, text: el.name})),
          meta: val.meta
        }
      } else {
        state.getDestinationsNY = {
          rows: []
        }
      }
    }
  },
  actions: {
    getFileRatesQuoter ({commit}, { params, queryParams = {}, onSuccess = null}) {
      baseService.callService('getFileRatesQuoter', queryParams, params, { fullResponse: true })
        .then(({ data }) => {
          const fileName = `Pricing ${1}.xls`
          try {            
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(data, fileName)
            } else {
              const objectUrl = URL.createObjectURL(data)
              window.open(objectUrl)
            }
          } catch (exc) {
            commit('setMessage', { text: 'msg-problema-cargar-datos', code: exc, type: 'alert' })
          }
          if (onSuccess) onSuccess()
        })
        .catch(err => {
          commit('setMessage', { text: 'msg-problema-cargar-datos', code: err, type: 'alert' })
        })
    }
  }
}
