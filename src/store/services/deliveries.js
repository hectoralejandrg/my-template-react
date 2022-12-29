import { environment } from '@/environments/environment'
export default [

  { name: 'getDeliveryStatus', url: `${environment.shanghaiApiUrl}/delivery-status`, method: 'get'},
  { name: 'getDeliveryTypes', url: `${environment.madagascarApiUrl}/delivery-types`, method: 'get'},
  { name: 'getDeliveryStatuses', url: `${environment.shanghaiApiUrl}/delivery-statuses`, method: 'get'},
  { name: 'getTicketTypesByDelivery', url: `${environment.shanghaiApiUrl}/delivery-statuses/{code}/ticket-types`, method: 'get'},


  { name: 'getDeliveries', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/deliveries`, method: 'get'},
  { name: 'getAdminDeliveries', url: `${environment.madagascarApiUrl}/deliveries`, method: 'get'},
  { name: 'getDelivery', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/deliveries/{id}`, method: 'get'},
  { name: 'getDeliveryWebTracking', url: `${environment.santiagoApiUrl}/companies/{shipper_id}/deliveries/{id}/web-tracking`, method: 'get'},
  { name: 'deleteDelivery', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/deliveries/{id}`, method: 'delete', notCancel: true},
  { name: 'updateDelivery', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/deliveries/{id}`, method: 'put' },
  { name: 'saveDelivery', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/deliveries`, method: 'post'},
  
  { name: 'dispatchDelivery', url: `${environment.madagascarApiUrl}/shippers/{shipper_id}/deliveries/{delivery_id}/dispatcher`, method: 'post', notCancel: true}
]