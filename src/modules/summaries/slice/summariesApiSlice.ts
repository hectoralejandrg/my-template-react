import { Dayjs } from 'dayjs'
import { globalApi } from '../../../store/globalApi'
import mainApi from '../../../utils/AxiosService'
import { SummariesResponse } from '../interfaces/summaries.interface'
import { PayloadSummaries } from '../interfaces/payloadSummaries.interface'
import { SummaryToDeliveriesResponse } from '../interfaces/deliveries.interface'

const apiSummariesTags = globalApi.enhanceEndpoints({
  addTagTypes: ['Summaries', 'DetailsSummary']
})

export const summariesApiSlice = apiSummariesTags.injectEndpoints({
  endpoints: (builder) => ({
    getSummaries: builder.query<SummariesResponse, {
      id?: string
      carrier_id?: string
      page?: number
      limit?: number
      sort?: string
      start_date?: string | Dayjs | null
      end_date?: string | Dayjs | null
    }>({
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
        data ? [...data?.summaries?.map(({ id }) => ({ type: 'Summaries' as const, id })), 'Summaries'] : ['Summaries']
    }),
    getDeliveriesToSummaries: builder.query<SummaryToDeliveriesResponse[], { summaryId?: string }>({
      queryFn: async ({ summaryId }) => {
        try {
          const { data } = await mainApi(`/deliveries-from-summary?summary_id=${summaryId}`)
          return { data }
        } catch (error: any) {
          return {
            error
          }
        }
      },
      providesTags: (data) =>
        data ? [...data?.map(({ id }) => ({ type: 'DetailsSummary' as const, id })), 'DetailsSummary'] : ['DetailsSummary']
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
  useGetDeliveriesToSummariesQuery,
  useChangeStatusesSummariesMutation
} = summariesApiSlice
