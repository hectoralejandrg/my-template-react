export default [
  { id: 'tickets', title: 'Tickets', icon: 'ticket-alt', description: 'Manejo múltiple de estados y asuntos de ticket' },
  { id: 'sellers', title: 'Sellers', icon: 'building', description: 'Ingreso múltiple de identificadores de vendedores y bodegas' },
  // { id: 'couriers', title: 'Couriers', icon: 'truck-moving', description: 'Manejo múltiple de couriers, servicios y canales de distribución' },
  { id: 'dates', title: 'Fechas', icon: 'calendar-alt', description: 'Manejo de rangos para diferentes tipos de fechas' },
  { id: 'status', title: 'Estados', icon: 'ellipsis-h', description: 'Manejo de comentarios de estado y manejo múltiple de estados de tracking' },
  { id: 'label', title: 'Etiqueta', icon: 'digital-tachograph', description: 'Opciones de agrupación para todos los campos relativos a las etiquetas' },

  { id: 'ticket_type', title: 'Asuntos ticket', icon: 'tag', parent: 'tickets', type: 'list', fx: 'getTicketSubjects',
    description: 'Lista de posibles asuntos de tickets a agrupar. Puede seleccionar uno o varios'
  },
  { id: 'ticket_status', title: 'Estados ticket', icon: 'clipboard-check', parent: 'tickets', type: 'list', fx: 'getTicketStatuses',
    description: 'Lista de posibles estados de tickets a agrupar. Puede seleccionar uno o varios'
  },
  { id: 'ticket_reading_status', title: 'Estado de lectura ticket', icon: 'envelope', parent: 'tickets', type: 'list', data: [{id: 1, text: 'Leido'}, {id: 2, text: 'No leido'}],
    description: 'Selección especifica de ticket leido o no leido'
  },

  { id: 'id_seller', title: 'Seller ID', icon: 'building', parent: 'sellers', type: 'number-splitted',
    description: 'Ingreso de múltiples identificadores de sellers separados por coma (,).'
  },
  { id: 'id_warehouse', title: 'Bodega ID', icon: 'warehouse', parent: 'sellers', type: 'number-splitted',
    description: 'Ingreso de múltiples identificadores de bodegas separados por coma (,)'
  },

  // { id: 'courier', title: 'Courier', icon: 'box', parent: 'couriers', type: 'list',
  //   description: 'Lista de couriers a agrupar. Puede seleccionar uno o varios'
  // },
  // { id: 'service', title: 'Servicio', icon: 'cogs', parent: 'couriers', type: 'list',
  //   description: 'Lista de servicios a agrupar. Puede seleccionar uno o varios'
  // },
  // { id: 'distribution_channel', title: 'Canal de Distribución', icon: 'project-diagram', parent: 'couriers', type: 'list',
  //   description: 'Lista de los canales de distribución. Puede seleccionar uno o varios'
  // },

  { id: 'delivery_created_at', title: 'Fecha creación', icon: 'calendar-plus', parent: 'dates', type: 'date',
    description: 'Selección de rango de fecha para la creación de tickets'
  },
  { id: 'status_date', title: 'Fecha estado', icon: 'calendar-alt', parent: 'dates', type: 'date',
    description: 'Selección de rango de fechas para el cambio de estado de tickets'
  },
  { id: 'commitment_date', title: 'Fecha compromiso', icon: 'calendar-check', parent: 'dates', type: 'date',
    description: 'Selección de rango de fechas para agrupar por fecha de compromiso'
  },
  { id: 'first_status_carrier_date', title: 'Fecha primer estado carrier', icon: 'calendar-week', parent: 'dates', type: 'date',
    description: 'Selección de rango de fecha para el primer estado del ticket'
  },
  { id: 'last_incident_date', title: 'Fecha última incidencia', icon: 'calendar-day', parent: 'dates', type: 'date',
    description: 'Selección de rango de fecha para agrupar por la última fecha de incidencia'
  },

  { id: 'status_tracking', title: 'Estados tracking', icon: 'truck-loading', parent: 'status', type: 'list', fx: 'getTrackingStatuses',
    description: 'Lista de los posibles estados de tracking. Puede seleccionar uno o varios'
  },
  { id: 'status_comment', title: 'Comentario estado', icon: 'comments', parent: 'status', type: 'text-large',
    description: 'Ingreso de uno o más textos para los comentarios ingresados en el estado'
  },

  { id: 'client_name', title: 'Nombre cliente', icon: 'user', parent: 'label', type: 'text',
    description: 'Ingreso de uno o más nombres de clientes para agrupación'
  },
  { id: 'cellphone', title: 'Celular', icon: 'mobile-alt', parent: 'label', type: 'text',
    description: 'Ingreso de múltiples números de celular'
  },
  { id: 'email', title: 'E-mail', icon: 'at', parent: 'label', type: 'text',
    description: 'Ingreso de uno o más emails para agrupación'
  },
  { id: 'address', title: 'Dirección', icon: 'address-card', parent: 'label', type: 'text',
    description: 'Ingreso de uno o más emails para agrupación'
  },
  { id: 'commune', title: 'Place_level3', icon: 'map-marker-alt', parent: 'label', type: 'list',
    description: 'Lista de las comunas a agrupar. Puede seleccionar una o varias'
  },
  { id: 'packages', title: 'Bultos', icon: 'boxes', parent: 'label', type: 'number-range',
    description: 'Rango de bultos que se agruparán. Debe ingresar un mínimo y un máximo'
  },
  { id: 'products', title: 'Producto', icon: 'shopping-cart', parent: 'label', type: 'text',
    description: 'Ingreso de uno más productos para agrupación'
  },
  { id: 'product_value', title: 'Valor producto', icon: 'money-bill-wave', parent: 'label', type: 'number-range',
    description: 'Rango del valor de productos que se agruparán. Debe ingresar un mínimo y un máximo'
  },
  { id: 'comments', title: 'Observaciones', icon: 'comment-dots', parent: 'label', type: 'text',
    description: 'Ingreso de una o más observaciones para agrupación'
  },
  { id: 'delivery_weight', title: 'Peso', icon: 'weight', parent: 'label', type: 'number-range',
    description: 'Rango de pesos que se agruparán. Debe ingresar un mínimo y un máximo'
  },
  { id: 'delivery_volume', title: 'Volumen', icon: 'balance-scale', parent: 'label', type: 'number-range',
    description: 'Rango de volumen que se agrupará. Debe ingresar un mínimo y un máximo'
  },
  { id: 'address_drop', title: 'Dirección retiro', icon: 'address-book', parent: 'label', type: 'text',
    description: 'Ingreso de una o más direcciones de retiro para agrupación'
  },
  { id: 'commune_drop', title: 'Place_level3_pickup', icon: 'map-marked-alt', parent: 'label', type: 'list',
    description: 'Lista de las comunas de retiro a agrupar. Puede seleccionar una o varias'
  }
]