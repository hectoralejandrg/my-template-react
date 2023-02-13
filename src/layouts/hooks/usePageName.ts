import { useEffect, useState } from 'react'
import { setPageName } from '../../modules/auth/slice/authSlice'
import { menuItems } from '../../routes/menuItems'
import { useAppDispatch, useAppSelector } from '../../store/useRedux'

export const usePageName = () => {
  const [name, setName] = useState(localStorage.getItem('pageName'))
  const dispatch = useAppDispatch()
  const { pageName } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (name) dispatch(setPageName(name))
    else {
      setName(menuItems[0].name)
      localStorage.setItem('pageName', menuItems[0].name)
    }
  }, [name])

  return { pageName }
}
