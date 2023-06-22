import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import PersonIcon from '@mui/icons-material/Person'

export interface MenuItems {
  link: string
  name: string
  icon: any
  permissions: number[]
}

export const menuItems: MenuItems[] = [
  {
    link: '/tracking',
    name: 'Actualizar tracking',
    icon: AddLocationAltOutlinedIcon,
    permissions: [1, 2, 3]
  },
  {
    link: '/deliveries',
    name: 'Listado de envíos',
    icon: FormatListBulletedIcon,
    permissions: [1, 2, 3]
  },
  {
    link: '/summaries',
    name: 'Manifiestos',
    icon: ContentPasteIcon,
    permissions: [1, 2, 3]
  },
  {
    link: '/users',
    name: 'Usuarios',
    icon: PersonIcon,
    permissions: [1, 2]
  }
]
