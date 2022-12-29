import { environment } from '@/environments/environment'

export default [
  { name: 'getShippers', url: `${environment.dubaiApiUrl}/shippers`, method: 'get' },
  { name: 'getShipper', url: `${environment.dubaiApiUrl}/shippers/{shipper_id}`, method: 'get' },
  { name: 'saveShipper', url: `${environment.dubaiApiUrl}/shippers`, method: 'post' },
  { name: 'getShipper', url: `${environment.dubaiApiUrl}/shippers/{shipper_id}`, method: 'get' },
  { name: 'deleteShipper', url: `${environment.dubaiApiUrl}/shippers/{shipper_id}`, method: 'delete', notCancel: true },
  { name: 'updateShipper', url: `${environment.dubaiApiUrl}/shippers/{shipper_id}`, method: 'put' },
  { name: 'getAddressShipper', url: `${environment.dubaiApiUrl}/shippers/{shipper_id}/addresses/{id}`, method: 'get'},
  { name: 'getAuthorizedCarriersShippers', url: `${environment.tokyoApiUrl}/v1/carriers/carriers-shippers`, method: 'get' },
  { name: 'createAuthorizedCarriersShipper', url: `${environment.tokyoApiUrl}/v1/carriers/carriers-shippers`, method: 'post' },
  { name: 'createAuthorizedCarriersShipperServices', url: `${environment.tokyoApiUrl}/v1/carriers/carriers-shippers-services`, method: 'post' },
  { name: 'updateAuthorizedCarriersShipper', url: `${environment.tokyoApiUrl}/v1/carriers/carriers-shippers/{id}`, method: 'put' },
  { name: 'updateAuthorizedCarriersShipperServices', url: `${environment.tokyoApiUrl}/v1/carriers/carriers-shippers-services/{id}`, method: 'put' },
  { name: 'deleteAuthorizedCarriersShipper', url: `${environment.tokyoApiUrl}/v1/carriers/carriers-shippers/{id}`, method: 'delete', notCancel: true },
  { name: 'getShipperAccounts', url: `${environment.tokyoApiUrl}/v1/carriers/shipper-account-rules`, method: 'get' },
  { name: 'createShipperAccounts', url: `${environment.tokyoApiUrl}/v1/carriers/shipper-account-rules`, method: 'post' },
  { name: 'updateShipperAccounts', url: `${environment.tokyoApiUrl}/v1/carriers/shipper-account-rules/{account_id}`, method: 'put' },
  { name: 'deleteShipperAccounts', url: `${environment.tokyoApiUrl}/v1/carriers/shipper-account-rules/{account_id}`, method: 'delete', notCancel: true }
]
