export default [{
  title: 'Dashboard',
  icon: 'HomeIcon',
  route: 'dashboard',
  resource: 'Dashboard',
  action: 'access'
},
{
  title: 'menu-deliveries',
  icon: 'SendIcon',
  children: [{
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
    // {
    //   title: 'Lista devoluciones',
    //   route: 'return-deliveries'
    // }
  ]
},
{
  title: 'menu-returns',
  icon: 'CornerUpLeftIcon',
  children: [
    {
      title: 'menu-returns-create',
      route: 'returns-create',
      resource: 'returns',
      action: 'create'
    },
    {
      title: 'menu-returns-list',
      route: 'returns-list',
      resource: 'returns',
      action: 'list'
    }
  ]
},
{
  title: 'menu-pickups',
  icon: 'TruckIcon',
  roles: ['admin', 'superadmin'],
  route: 'pickups',
  resource: 'menu',
  action: 'pickups'
},
{
  title: 'menu-config',
  icon: 'SettingsIcon',
  children: [{
    title: 'menu-config-users',
    route: 'config-users',
    resource: 'config',
    action: 'users'
  },
  {
    title: 'menu-config-tracking',
    route: 'config-tracking',
    resource: 'config',
    action: 'tracking'
  },
  {
    title: 'menu-config-notifications',
    route: 'config-notifications',
    resource: 'config',
    action: 'notifications'
  },
  {
    title: 'menu-config-folders',
    route: 'config-folders',
    resource: 'config',
    action: 'folders'
  },
  {
    title: 'menu-config-addresses',
    route: 'config-addresses',
    resource: 'config',
    action: 'addresses'
  },
  {
    title: 'menu-config-organizations',
    route: 'config-organizations',
    resource: 'config',
    action: 'organizations'
  },
  {
    title: 'menu-config-shippers',
    route: 'config-shippers',
    resource: 'config',
    action: 'shippers'
  },
  {
    title: 'menu-config-carriers',
    route: 'config-carriers',
    resource: 'config',
    action: 'carriers'
  }
  ]
},
{
  title: 'menu-ticketManagement',
  icon: 'ClipboardIcon',
  name: 'tm',
  children: [{
    title: 'menu-ticketManagement-groupCreate',
    route: 'tm-group-create',
    resource: 'ticketManagement',
    action: 'groupCreate'
  },
  {
    title: 'menu-ticketManagement-groupList',
    route: 'tm-group-list',
    resource: 'ticketManagement',
    action: 'groupList'
  },
  {
    title: 'menu-ticketManagement-ruleCreate',
    route: 'tm-rule-create',
    resource: 'ticketManagement',
    action: 'ruleCreate'
  },
  {
    title: 'menu-ticketManagement-ruleList',
    route: 'tm-rule-list',
    resource: 'ticketManagement',
    action: 'ruleList'
  }
  ]
},
{
  title: 'menu-tickets',
  icon: 'FileTextIcon',
  name: 'tickets',
  children: [{
    title: 'menu-tickets-all',
    route: 'tickets-list',
    resource: 'tickets',
    action: 'list'
  },
  {
    title: 'menu-tickets-pending',
    route: 'tickets-pending',
    resource: 'tickets',
    action: 'pending'
  },
  {
    title: 'menu-tickets-admin',
    route: 'tickets-admin',
    resource: 'tickets',
    action: 'admin'
  }
  ]
},
{
  title: 'menu-default-answer',
  route: 'default-answer',
  resource: 'tickets',
  action: 'list'
},
{
  title: 'menu-billing',
  icon: 'FileIcon',
  children: [{
    title: 'menu-billing-contacts',
    route: 'billing-manage',
    resource: 'menu',
    action: 'pricing' //billing
  }]
},
{
  title: 'menu-pricing',
  icon: 'DollarSignIcon',
  children: [{
    title: 'menu-pricing-simple',
    route: 'pricing-simple',
    resource: 'menu',
    action: 'pricing'
  },
  {
    title: 'menu-pricing-universal',
    route: 'pricing-universal',
    resource: 'menu',
    action: 'pricing'
  }
  ]
},
{
  title: 'menu-support',
  icon: 'HelpCircleIcon',
  route: 'support',
  resource: 'menu',
  action: 'support'
},
{
  title: 'menu-advanced-rules',
  icon: 'SlidersIcon',
  children: [
    // {
    //   title: 'menu-advanced-rules-create',
    //   route: 'advanced-rules-create',
    //   resource: 'advanced-rules',
    //   action: 'create'
    // },
    {
      title: 'menu-advanced-rules-list',
      route: 'advanced-rules-list',
      resource: 'advanced-rules',
      action: 'list'
    }
  ]
},
{
  title: 'menu-materials',
  icon: 'ArchiveIcon',
  route: 'materials',
  resource: 'menu',
  action: 'dashboard'
},
{
  title: 'menu-personalize',
  icon: 'EditIcon',
  route: 'personalize',
  resource: 'menu',
  action: 'personalize'
},
{
  title: 'menu-integrations',
  icon: 'LogInIcon',
  children: [{
    title: 'menu-integrations-list',
    route: 'integrations-list',
    resource: 'integrations',
    action: 'list'
  }]
},
{
  title: 'menu-config-aliases',
  icon: 'ArchiveIcon',
  route: 'config-aliases',
  resource: 'menu',
  action: 'dashboard'
}
]
