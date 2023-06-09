import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { auth } from '../../firebase'
import { setToken, setUser } from '../../modules/auth/slice/authSlice'
import { useAppDispatch, useAppSelector } from '../../store/useRedux'

export const useStateChange = () => {
  const [loading, setLoading] = useState(true)
  const dispatch = useAppDispatch()
  const { token } = useAppSelector((state) => state.auth)
  useEffect(() => {
    const unsubuscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        dispatch(setUser(currentUser))
        currentUser.getIdToken().then((token) => {
          dispatch(setToken(token))
        })
        currentUser.getIdTokenResult().then((claims) => console.log('cccc', claims.claims))
      }
      setLoading(false)
    })
    return () => unsubuscribe()
  }, [])
  return { token, loading }
}
