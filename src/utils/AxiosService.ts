import axios from 'axios'

const mainApi = axios.create({
  baseURL: 'https://stage.api.enviatrack.enviame.io/v1'
})

export default mainApi
