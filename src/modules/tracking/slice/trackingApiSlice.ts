import { globalApi } from '../../../store/globalApi'
import mainApi from '../../../utils/AxiosService'
import { Status, StatusResponse } from '../interfaces/statusses.interface'

export type keyStatus = keyof Status

const apiTrackingTags = globalApi.enhanceEndpoints({
  addTagTypes: []
})

export const trackingApiSlice = apiTrackingTags.injectEndpoints({
  endpoints: (builder) => ({
    getStatuses: builder.query<StatusResponse, void>({
      queryFn: async () => {
        try {
          const { data } = await mainApi('statuses')
          return { data }
        } catch (error: any) {
          return {
            error
          }
        }
      }
    }),
    updateTracking: builder.mutation<
      void,
      {
        id: number
        status_id?: number
        user_id?: number
        evidence?: { comment?: string; name?: string; rut?: string; images?: string[] }
      }
    >({
      queryFn: async (params) => {
        try {
          const { data } = await mainApi.put('delivery', {
            ...params
          })
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

export const { useGetStatusesQuery, useUpdateTrackingMutation } =
  trackingApiSlice
