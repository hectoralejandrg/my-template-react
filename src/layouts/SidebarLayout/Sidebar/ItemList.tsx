import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  useTheme
} from '@mui/material'
import { menuItems } from '../../../routes/menuItems'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../../store/useRedux'
import { setPageName } from '../../../modules/auth/slice/authSlice'
import { usePageName } from '../../hooks/usePageName'

const ItemList = ({ open }: { open: boolean }) => {
  const dispatch = useAppDispatch()
  const { pageName } = usePageName()
  const theme = useTheme()
  const navigate = useNavigate()
  const handleNavigate = (link: string, name: string, index: number) => {
    localStorage.setItem('pageName', name)
    dispatch(setPageName(name))
    navigate(link)
  }

  return (
    <List>
      {menuItems.map(({ icon: Icon, name, link }, index) => (
        <ListItem
          key={`${name}-${index}`}
          disablePadding
          sx={{ display: 'block' }}
        >
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              '&:hover': {
                background: '#1B8ACE',
                '.MuiListItemIcon-root': {
                  color: 'white'
                },
                '.MuiListItemText-root': {
                  color: 'white'
                }
              }
            }}
            selected={pageName === name}
            onClick={() => handleNavigate(link, name, index)}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
                color: `${theme.palette.primary.main}`
              }}
            >
              {<Icon />}
            </ListItemIcon>
            <ListItemText
              primary={name}
              sx={{
                opacity: open ? 1 : 0,
                color: `${theme.palette.primary.main}`
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}

export default ItemList
