import { environment } from '@/environments/environment'

export default [
  { name: 'getTickets', url: `${environment.torontoApiUrl}/tickets`, method: 'get' },
  { name: 'exportTickets', url: `${environment.torontoApiUrl}/delivery-tickets-export`, method: 'get' },
  {
    name: 'postFileRespondTickets', url: `${environment.torontoApiUrl}/delivery-tickets/bulk/excel`, method: 'post', headers: {
      'Content-Type': 'multipart/form-data'
    }
  },
  { name: 'getOrganization', url: `${environment.dubaiApiUrl}/organizations/{organization_id}`, method: 'get' },
  { name: 'getMarketplaces', url: `${environment.dubaiApiUrl}/organizations`, method: 'get' },
  { name: 'getShipper', url: `${environment.dubaiApiUrl}/organizations/{organization_id}/shippers`, method: 'get' }
]