import { environment } from '@/environments/environment'

export default [
  { name: 'getOrdersByShipper', url: `${environment.ottawaApiUrl}/shippers/{company}/webhook/{ecommerce}/orders`, method: 'get', notCancel: true},
  { name: 'getOrder', url: `${environment.ottawaApiUrl}/shippers/{company}/webhook/{ecommerce}/{order}`, method: 'get', notCancel: true}
]