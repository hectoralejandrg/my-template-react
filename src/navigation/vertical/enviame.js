export default [
  {
    title: 'Dashboard',
    icon: 'HomeIcon',
    route: 'dashboard',
    resource: 'Dashboard',
    action: 'access'
  },
  {
    title: 'menu-deliveries',
    icon: 'SendIcon',
    children: [
      {
        title: 'menu-deliveries-create',
        route: 'deliveries-create',
        resource: 'deliveries',
        action: 'create'
      },
      {
        title: 'menu-deliveries-list',
        route: 'deliveries-list',
        resource: 'deliveries',
        action: 'list'
      }
    ]
  }
]
