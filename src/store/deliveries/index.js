
import useJwt from '@/auth/jwt/useJwt'
import BaseServices from '@/store/services/index'
const baseService = new BaseServices()

export default {
  state: {
    deliveries: [],
    deliveryTypes: [],
    deliveryStatuses: [],
    deliveryWebTracking: {},
    lastQuery: {}
  },
  getters: {
    getDeliveries: state => state.deliveries,
    getDeliveryTypes: state => state.deliveryTypes,
    getDeliveryStatuses: state => state.deliveryStatuses,
    getDeliveryWebTracking: state => state.deliveryWebTracking
  },
  mutations: {
    setDeliveryWebTracking (state, val) {
      state.deliveryWebTracking = val
    },
    setDeliveries(state, val) {
      state.deliveries = {
        rows: val.rows.map(delivery => {
          return {
            ...delivery,
            id: delivery.order.id,
            shipper_name: delivery.shipper?.name1 || '',
            carrier_name: delivery.carrier?.code || '',
            status_name: `<span class="badge badge-light-warning">${delivery.order?.status?.status || delivery.order?.status?.name || delivery.order?.status?.status_name || ''}</span>`, //delivery.order.status.status,
            imported_id: delivery.order?.imported_id || '',
            tracking_number: delivery.order?.identifiers?.tracking_number || '',
            level4: delivery.destination?.address?.level4 || '',
            level3: delivery.destination?.address?.level3 || '',
            level2: delivery.destination?.address?.level2 || '',
            level1: delivery.destination?.address?.level1 || '',
            // created_at: delivery.order?.status?.date ? this.context.$options.filters.dbDateToFormat(delivery.order.status.date, 'D T') : null,
            deadline_date: delivery.extra_fields ? delivery.extra_fields['fecha retiro'] : '',
            booleanNewTicket: delivery.order?.service_type === 'Pasarela' || delivery.shipper?.ticket_force_creation,
            booleanDelete: delivery.order?.status && [1, 4, 5, 12].includes(delivery.order?.status?.status_id),
            booleanGenerateLabel: delivery?.order?.status && [1, 4].includes(delivery.order.status.status_id)
          }
        }),
        meta: val.meta || {},
        total: val.total
      }
    },
    setDeliveryTypes(state, val) {
      state.deliveryTypes = val.delivery_types.map(el => ({id: el, text: el}))
    },
    setDeliveryStatuses(state, val) {
      state.deliveryStatuses = val.rows.map(el => ({...el, text: el.name}))
    }
  },
  actions: {
    fetchDeliveries ({ commit }, {queryParams, params} = {}) {
      baseService.callService('getDeliveries', queryParams, params)
        .then(response => {
          const data = {
            rows: response.data.map(delivery => {
              return {
                ...delivery
              }
            }),
            total: response.links.meta.data_count
          }
          commit('setDeliveries', data)
        })
        .catch(err => {
          console.error(err)
          commit('setMessage', { text: 'msg-problema-cargar-datos', code: err, type: 'alert' })
        })
    },
    fetchSaveDelivery ({ commit, state, dispatch }, {queryParams, params} = {}) {
      const words = !!params?.id ? ['update', 'actualizar'] : ['save', 'guardar']
      baseService.callService(`${words[0]}Delivery`, queryParams, params)
        .then(response => {
          dispatch('fetchDeliveries', { ...state.lastQuery })
          commit('setMessage', { text: `msg-exito-${words[1]}`, type: 'success' })
        })
        .catch(err => {
          console.error(err)
          commit('setMessage', { text: `msg-problema-${words[1]}`, code: err, type: 'alert' })
        })
    },
    fetchDeleteDelivery ({ commit, state, dispatch }, {queryParams, params} = {}) {
      baseService.callService('deleteDelivery', queryParams, params)
        .then(response => {
          dispatch('fetchDeliveries', { ...state.lastQuery })
          commit('setMessage', { text: 'msg-exito-eliminar-elemento', type: 'success' })
        })
        .catch(err => {
          console.error(err)
          commit('setMessage', { text: 'msg-problema-eliminar-elemento', code: err, type: 'alert' })
        })
    }
  }
}