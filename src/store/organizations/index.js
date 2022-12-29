import BaseServices from '@/store/services/index'
const baseService = new BaseServices()

export default {
  state: {
    organization: {},
    organizations: [],
    organizationTypes: [],
    authorizedCarriersOrganizations: []
  },
  getters: {
    getOrganization: state => state.organization,
    getOrganizations: state => state.organizations,
    getOrganizationTypes: state => state.organizationTypes,
    getAuthorizedCarriersOrganizations: state => state.authorizedCarriersOrganizations
  },
  mutations: {
    setOrganization(state, val) {
      state.organization = val
    },
    setOrganizations(state, val) {
      state.organizations = {
        rows: val.rows.map(organization => {
          if (organization.country && organization.organization_type) {
            return {
              ...organization,
              country: organization.country.name,
              country_id: organization.country.id,
              organization_type: organization.organization_type.name,
              organization_type_id: organization.organization_type.id,
              text: organization.name
            }
          } else {
            return {
              ...organization,
              text: organization.name
            }
          }
        }),
        meta: val.meta || {},
        total: val.total
      }
    },
    setOrganizationTypes(state, val) {
      state.organizationTypes = val.rows.map(el => ({...el, text: el.name }))
    },
    setAuthorizedCarriersOrganizations(state, val) {
      state.authorizedCarriersOrganizations = val.data.map(organization => (
        {
          ...organization, 
          carrier_name: organization.carrier.name, 
          service_name : organization.services.map(service => service.name).join('-'),
          contract_types: organization.contract_type.name
        }
      ))
    }
  },
  actions: {
    fetchAuthorizedCarriersOrganizations({ commit }, { queryParams, params } = {}) {
      baseService
        .callService('getAuthorizedCarriersOrganizations', queryParams, params)
        .then(response => {
          const data = response.data.data
          commit('setAuthorizedCarriersOrganizations', data)
        })
        .catch(err => {
          console.error(err)
          commit('setMessage', {
            text: 'msg-problema-cargar-datos',
            code: err,
            type: 'alert'
          })
        })
    }
  }
}
