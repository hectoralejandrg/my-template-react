import { globalApi } from '../../../store/globalApi'
import { signInWithEmailAndPassword, getIdToken } from 'firebase/auth'
import { auth } from '../../../firebase'
import { setLogout, setToken, setUser } from './authSlice'
import mainApi from '../../../utils/AxiosService'
import { DecodeResponse } from '../interfaces/decode.interface'

const apiAuthTags = globalApi.enhanceEndpoints({
  addTagTypes: ['Auth']
})

export const authApiSlice = apiAuthTags.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      queryFn: async (
        { email, password },
        { dispatch },
        _extraOptions,
        _fetchWithBQ
      ) => {
        try {
          const { user } = await signInWithEmailAndPassword(
            auth,
            email,
            password
          )
          dispatch(setToken(await getIdToken(user)))
          dispatch(setUser(user))
          return { data: user }
        } catch (error) {
          return { error }
        }
      }
    }),
    logout: builder.mutation<void, void>({
      queryFn: async (_args, { dispatch }) => {
        try {
          const data = await auth.signOut()
          dispatch(setLogout())
          return { data }
        } catch (error) {
          return { error }
        }
      }
    }),
    resetPasswordEmail: builder.mutation<void, { email: string }>({
      queryFn: async (params) => {
        try {
          const { data } = await mainApi.post('reset-password-email', {
            ...params
          })
          return { data }
        } catch (error: any) {
          return {
            error
          }
        }
      }
    }),
    decodeToken: builder.query<DecodeResponse, { token: string | null }>({
      queryFn: async ({ token }) => {
        try {
          const { data } = await mainApi(`decode-token/${token}`)
          return { data }
        } catch (error: any) {
          return {
            error
          }
        }
      }
    }),
    resetPassword: builder.mutation<void, { uid: string | undefined, newPassword: string }>({
      queryFn: async (params) => {
        try {
          const { data } = await mainApi.put('reset-password', {
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
export const {
  useLoginMutation,
  useLogoutMutation,
  useResetPasswordEmailMutation,
  useDecodeTokenQuery,
  useResetPasswordMutation
} = authApiSlice
