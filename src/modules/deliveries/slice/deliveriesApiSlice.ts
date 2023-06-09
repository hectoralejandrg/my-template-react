import { globalApi } from '../../../store/globalApi'
import mainApi from '../../../utils/AxiosService'
import { ObjectDeliveries } from '../interfaces/deliveries.interfaces'

export interface Params {
  id: number
  page: string
  sort: string
  terminal: boolean
}

const apiDeliveriesTags = globalApi.enhanceEndpoints({
  addTagTypes: []
})

export const deliveriesApiSlice = apiDeliveriesTags.injectEndpoints({
  endpoints: (builder) => ({
    getDeliveries: builder.query<ObjectDeliveries, Params | void>({
      queryFn: async (params) => {
        try {
          const { data } = await mainApi('deliveries', { params })
          return { data }
        } catch (error: any) {
          return {
            error
          }
        }
      }
    })
  })
})

export const { useGetDeliveriesQuery } = deliveriesApiSlice
