export default {
  state: {
    order: {},
    ordersByShipper: {}
  },
  getters: {
    getOrdersByShipper: state => state.ordersByShipper,
    getOrder: state => state.order
  }, 
  mutations: {
    setOrdersByShipper(state, val) {
      state.ordersByShipper = {
        ...val,
        rows: val.orders?.map(el => {
          return {
            id: el.imported_id,
            company_id: val.company_id,
            ecommerce: val.ecommerce,
            imported_id: el.imported_id,
            response: el.response,
            detailIntegrationBoolean: !(el.response.length === 0)
          }
        })
      }
    },

    setOrder (state, val) {
      state.order = val
    }
  },
  actions: {}
}