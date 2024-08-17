// import { onIdTokenChanged } from 'firebase/auth'
import { useEffect } from 'react'
// import {
//   setToken,
//   setUser
// } from '../../modules/auth/slice/authSlice'
import { useAppSelector } from '../../store/useRedux'

export const useStateChange = () => {
  // const [loading, setLoading] = useState(true)
  // const dispatch = useAppDispatch()
  const { token } = useAppSelector((state) => state.auth)
  useEffect(() => {
    // const unsubuscribe = onIdTokenChanged(auth, (currentUser) => {
    //   if (currentUser) {
    //     dispatch(setUser(currentUser))
    //     console.log('newtoken', token, currentUser)
    //     currentUser.getIdToken().then((token) => {
    //       dispatch(setToken(token))
    //       localStorage.setItem('token', token)
    //     })
    //   }
    //   setLoading(false)
    // })
    // return () => unsubuscribe()
  }, [])
  return { token }
}
