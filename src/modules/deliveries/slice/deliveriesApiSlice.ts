import { globalApi } from '../../../store/globalApi'
import mainApi from '../../../utils/AxiosService'
import { DeliveriesResponse } from '../interfaces/deliveries.interfaces'

const apiDeliveriesTags = globalApi.enhanceEndpoints({
  addTagTypes: ['Deliveries']
})

export const deliveriesApiSlice = apiDeliveriesTags.injectEndpoints({
  endpoints: (builder) => ({
    getDeliveries: builder.query<DeliveriesResponse,
    {page: number,
    perPage?: number,
    sort?: string,
    paginate?: boolean,
    terminal?: string,
    imported_id?: string}>({
      queryFn: async (params) => {
        try {
          const { data } = await mainApi('deliveries', { params: { ...params, page: params.page + 1 } })
          return { data }
        } catch (error: any) {
          return {
            error
          }
        }
      },
      providesTags: (data) =>
        data ? [...data?.data?.map(({ id }) => ({ type: 'Deliveries' as const, id })), 'Deliveries'] : ['Deliveries']
    }),
    updateStatusDeliveries: builder.mutation<
      void,
      {
        delivery_ids: number[]
        status_id?: number
        user_id?: number
        evidence?: { comment?: string; name?: string; rut?: string }
      }
    >({
      queryFn: async (params) => {
        try {
          const { data } = await mainApi.put('deliveries', {
            ...params
          })
          return { data }
        } catch (error: any) {
          return {
            error
          }
        }
      },
      invalidatesTags: ['Deliveries', 'DetailsSummary']
    })
  })
})

export const { useGetDeliveriesQuery, useUpdateStatusDeliveriesMutation } =
  deliveriesApiSlice
