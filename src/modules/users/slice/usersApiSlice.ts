import { globalApi } from '../../../store/globalApi'
import mainApi from '../../../utils/AxiosService'
import { CompaniesResponse } from '../interfaces/compnaies.inteface'
import { RolesResponse } from '../interfaces/roles.inteface'
import { UsersResponse } from '../interfaces/users.interface'

const apiUsersTags = globalApi.enhanceEndpoints({
  addTagTypes: ['Users', 'Roles', 'Companies']
})

export const usersApiSlice = apiUsersTags.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, void>({
      queryFn: async () => {
        try {
          const { data } = await mainApi('users')
          return { data }
        } catch (error: any) {
          return {
            error
          }
        }
      },
      providesTags: (data) => data?.data ? [...data?.data.map(({ id }) => ({ type: 'Users' as const, id })), 'Users'] : ['Users']
    }),
    getRoles: builder.query<RolesResponse, void>({
      queryFn: async () => {
        try {
          const { data } = await mainApi('roles')
          return { data }
        } catch (error: any) {
          return {
            error
          }
        }
      },
      providesTags: (data) => data?.data ? [...data?.data.map(({ id }) => ({ type: 'Roles' as const, id })), 'Roles'] : ['Roles']
    }),
    getCompanies: builder.query<CompaniesResponse[], void>({
      queryFn: async () => {
        try {
          const { data } = await mainApi('companies')
          return { data }
        } catch (error: any) {
          return {
            error
          }
        }
      },
      providesTags: (data) => data ? [...data?.map(({ id }) => ({ type: 'Companies' as const, id })), 'Companies'] : ['Companies']
    }),
    createUser: builder.mutation<void, { name:string, email:string, active: boolean, role: number, company?: string }>(
      {
        queryFn: async (params) => {
          try {
            const { data } = await mainApi.post('users', { ...params })
            return { data }
          } catch (error: any) {
            return {
              error
            }
          }
        },
        invalidatesTags: ['Users']
      }
    )
  })
})

export const {
  useGetUsersQuery,
  useGetRolesQuery,
  useGetCompaniesQuery,
  useCreateUserMutation
} = usersApiSlice
