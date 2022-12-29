import { environment } from '@/environments/environment'
export default [
  { name: 'getOrganizationsGlobal', url: `${environment.dubaiApiUrl}/organizations?simplified=true`, method: 'get'},
  { name: 'getOrganizations', url: `${environment.dubaiApiUrl}/organizations`, method: 'get'},
  { name: 'getOrganization', url: `${environment.dubaiApiUrl}/organizations/{id}`, method: 'get'},
  { name: 'saveOrganization', url: `${environment.dubaiApiUrl}/organizations`, method: 'post' },
  { name: 'updateOrganization', url: `${environment.dubaiApiUrl}/organizations/{id}`, method: 'put' },
  { name: 'deleteOrganization', url: `${environment.dubaiApiUrl}/organizations/{id}`, method: 'delete', notCancel: true },
  { name: 'getOrganizationTypes', url: `${environment.dubaiApiUrl}/organization-types`, method: 'get' },
  { name: 'getAuthorizedCarriersOrganizations', url: `${environment.tokyoApiUrl}/v1/carriers/carriers-organizations`, method: 'get' },
  { name: 'createAuthorizedCarriersOrganization', url: `${environment.tokyoApiUrl}/v1/carriers/carriers-organizations`, method: 'post' },
  { name: 'createAuthorizedCarriersOrganizationServices', url: `${environment.tokyoApiUrl}/v1/carriers/carriers-organizations-services`, method: 'post' },
  { name: 'updateAuthorizedCarriersOrganization', url: `${environment.tokyoApiUrl}/v1/carriers/carriers-organizations/{id}`, method: 'put' },
  { name: 'updateAuthorizedCarriersOrganizationServices', url: `${environment.tokyoApiUrl}/v1/carriers/carriers-organizations`, method: 'put' },
  { name: 'deleteAuthorizedCarriersOrganization', url: `${environment.tokyoApiUrl}/v1/carriers/carriers-organizations/{id}`, method: 'delete', notCancel: true },
  { name: 'getOrganizationAuthorized', url: `${environment.dubaiApiUrl}/organizations`, method: 'get' }
]
