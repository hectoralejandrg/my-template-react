import axios from 'axios'

const mainApi = axios.create({
  baseURL: ''
})

mainApi.interceptors.request.use(function (config) {
  const tokenSaved: string | null = localStorage.getItem('token')
  if (tokenSaved) config.headers.set('Authorization', `Bearer ${tokenSaved}`)
  return config
})

export default mainApi
