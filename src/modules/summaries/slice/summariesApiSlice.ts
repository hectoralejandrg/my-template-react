import { Dayjs } from 'dayjs'
import { globalApi } from '../../../store/globalApi'
import mainApi from '../../../utils/AxiosService'
import { SummariesResponse } from '../interfaces/summaries.interface'
import { PayloadSummaries } from '../interfaces/payloadSummaries.interface'

export interface ParamsSummaries {
  id?: string
  carrier_id?: string
  page?: number
  limit?: number
  sort?: string
  start_date?: string | Dayjs | null
  end_date?: string | Dayjs | null
}

const apiSummariesTags = globalApi.enhanceEndpoints({
  addTagTypes: ['Summaries']
})

export const summariesApiSlice = apiSummariesTags.injectEndpoints({
  endpoints: (builder) => ({
    getSummaries: builder.query<SummariesResponse, ParamsSummaries>({
      queryFn: async (params) => {
        try {
          const { data } = await mainApi('summaries', { params })
          return { data }
        } catch (error: any) {
          return {
            error
          }
        }
      },
      providesTags: (data) =>
        data?.data ? [...data?.data.map(({ id }) => ({ type: 'Summaries' as const, id })), 'Summaries'] : ['Summaries']
    }),
    changeStatusesSummaries: builder.mutation<SummariesResponse, PayloadSummaries>(
      {
        queryFn: async (params) => {
          try {
            const { data } = await mainApi.put('summaries', { ...params })
            return { data }
          } catch (error: any) {
            return {
              error
            }
          }
        },
        invalidatesTags: ['Summaries']
      }
    )
  })
})

export const {
  useGetSummariesQuery,
  useChangeStatusesSummariesMutation
} = summariesApiSlice
