import { globalApi } from '../../../store/globalApi'
import { signInWithEmailAndPassword, getIdToken } from 'firebase/auth'
import { auth } from '../../../firebase'
import { setLogout, setToken, setUser } from './authSlice'

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
    })
  })
})
export const { useLoginMutation, useLogoutMutation } = authApiSlice
