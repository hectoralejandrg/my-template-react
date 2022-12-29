import { environment } from '@/environments/environment'
export default [
  { name: 'getCountriesRatesQuoter', url: `${environment.newyorkApiUrl}/v3/coverage/countries`, method: 'get', notCancel: true},
  { name: 'getPlacesRatesQuoter', url: `${environment.newyorkApiUrl}/v3/coverage/countries/{country_id}/places`, method: 'get', notCancel: true},
  { name: 'getCarriersRatesQuoter', url: `${environment.newyorkApiUrl}/v3/coverage/countries/{country_id}/places/{place_id}/carriers`, method: 'get', notCancel: true},
  { name: 'getServicesNY', url: `${environment.newyorkApiUrl}/v3/coverage/countries/{country_id}/carriers/{carrier_id}/services`, method: 'get', notCancel: true},
  { name: 'getCategoryServiceRatesQuoter', url: `${environment.newyorkApiUrl}/v3/coverage/countries/{country_id}/places/{place_id}/carriers/{carrier_id}/service-types`, method: 'get', notCancel: true},
  { name: 'getRatesRatesQuoter', url: `${environment.newyorkApiUrl}/v3/coverage/carriers/{carrier_id}/services/{service_id}/rates`, method: 'get' },
  { name: 'getServiceRatesQuoter', url: `${environment.newyorkApiUrl}/v3/coverage/countries/{country_id}/places/{place_id}/carriers/{carrier_id}/service-types/{service_type_id}/services`, method: 'get', notCancel: true},
  { name: 'getPricesRatesQuoter', url: `${environment.newyorkApiUrl}/v3/coverage/carriers/{carrier_id}/services/{service_id}/rates/{rate_id}/from-places/{place_id}/prices`, method: 'get', notCancel: true},
  { name: 'getCostsRatesQuoter', url: `${environment.newyorkApiUrl}/v3/coverage/carriers/{carrier_id}/services/{service_id}/rates/{rate_id}/from-places/{place_id}/costs`, method: 'get', notCancel: true},
  { name: 'getFileRatesQuoter', url: `${environment.newyorkApiUrl}/v3/coverage/carriers/{carrier_id}/services/{service_id}/rates/{rate_id}/from-places/{place_id}/{pricesOrCosts}/generate-file`, method: 'get', notCancel: true, responseType: 'blob' },
  { name: 'getOriginsNY', url: `${environment.newyorkApiUrl}/v3/coverage/countries/{country_id}/carriers/{carrier_id}/services/{service_id}/rates/{rate_id}/origins`, method: 'get', notCancel: true },
  { name: 'getDestinationsNY', url: `${environment.newyorkApiUrl}/v3/coverage/countries/{country_id}/carriers/{carrier_id}/services/{service_id}/rates/{rate_id}/destinations`, method: 'get', notCancel: true }
]