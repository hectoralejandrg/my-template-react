import { environment } from '@/environments/environment'
export default [
  { name: 'getCountries', url: `${environment.dubaiApiUrl}/countries`, method: 'get', notCancel: true},
  { name: 'getLevels', url: `${environment.dubaiApiUrl}/countries/{country}/levels`, method: 'get', notCancel: false},
  { name: 'getLevel', url: `${environment.dubaiApiUrl}/countries/{country}/level/1`, method: 'get', notCancel: false}

]