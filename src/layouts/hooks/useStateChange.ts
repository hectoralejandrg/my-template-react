import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { auth } from '../../firebase'
import {
  setProfile,
  setToken,
  setUser
} from '../../modules/auth/slice/authSlice'
import { useAppDispatch, useAppSelector } from '../../store/useRedux'

export const useStateChange = () => {
  const [loading, setLoading] = useState(true)
  const dispatch = useAppDispatch()
  const { token } = useAppSelector((state) => state.auth)
  useEffect(() => {
    const unsubuscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        dispatch(setUser(currentUser))
        console.log('newtoken', token, currentUser)
        currentUser.getIdToken().then((token) => {
          dispatch(setToken(token))
          localStorage.setItem('token', token)
        })
        currentUser.getIdTokenResult().then((claims) => {
          console.log('claims', claims)
          dispatch(
            setProfile({
              role: claims.claims.role,
              companyId: claims.claims.company,
              email: claims.claims.email,
              user_entity_id: claims.claims.user_entity_id,
              user_id: claims.claims.user_id
            })
          )
        })
      }
      setLoading(false)
    })
    return () => unsubuscribe()
  }, [])
  return { token, loading }
}
