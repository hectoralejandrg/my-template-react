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
    })
  })
})

export const { useGetStatusesQuery } = trackingApiSlice
