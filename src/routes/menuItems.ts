import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'

interface MenuItems {
  link: string;
  name: string;
  icon: any;
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
  }
]
