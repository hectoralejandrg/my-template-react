import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import PersonIcon from '@mui/icons-material/Person'

interface MenuItems {
  link: string
  name: string
  icon: any
}

export const menuItems: MenuItems[] = [
  {
    link: '/tracking',
    name: 'Actualizar tracking',
    icon: AddLocationAltOutlinedIcon
  },
  {
    link: '/deliveries',
    name: 'Listado de envíos',
    icon: FormatListBulletedIcon
  },
  {
    link: '/summaries',
    name: 'Manifiestos',
    icon: ContentPasteIcon
  },
  {
    link: '/users',
    name: 'Usuarios',
    icon: PersonIcon
  }
]
