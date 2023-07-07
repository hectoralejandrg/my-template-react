import { globalApi } from '../../../store/globalApi'
import mainApi from '../../../utils/AxiosService'
import { CompaniesResponse } from '../interfaces/companies.interface'

const apiCompaniesTags = globalApi.enhanceEndpoints({
  addTagTypes: ['Companies']
})

export const companiesApiSlice = apiCompaniesTags.injectEndpoints({
  endpoints: (builder) => ({
    getCompanies: builder.query<
      CompaniesResponse,
      {
        page?: number
        perPage?: number
        paginate?: boolean
      }
    >({
      queryFn: async (params) => {
        try {
          const { data } = await mainApi('companies', { params: { ...params, page: params.page ? params.page + 1 : undefined } })
          return { data }
        } catch (error: any) {
          return {
            error
          }
        }
      },
      providesTags: (data) => data ? [...data?.companies?.data?.map(({ id }) => ({ type: 'Companies' as const, id })), 'Companies'] : ['Companies']
    }),
    postCompany: builder.mutation<void, { name:string, carrier_code:string }>(
      {
        queryFn: async (params) => {
          try {
            const { data } = await mainApi.post('companies', { ...params })
            return { data }
          } catch (error: any) {
            return {
              error
            }
          }
        },
        invalidatesTags: ['Companies']
      }
    ),
    putCompany: builder.mutation<void, { id:string, name:string, carrier_code:string }>(
      {
        queryFn: async ({ id, ...params }) => {
          try {
            const { data } = await mainApi.put(`companies?id=${id}`, { ...params })
            return { data }
          } catch (error: any) {
            return {
              error
            }
          }
        },
        invalidatesTags: ['Companies']
      }
    )
  })
})

export const { useGetCompaniesQuery, usePostCompanyMutation, usePutCompanyMutation } =
  companiesApiSlice
