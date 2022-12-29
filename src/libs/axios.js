import Vue from 'vue'

// axios
import axios from 'axios'

const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  // baseURL: 'https://some-domain.com/api/',
  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
})
axiosIns.CancelToken = axios.CancelToken
axiosIns.isCancel = axios.isCancel

Vue.prototype.$http = axiosIns

export default axiosIns
