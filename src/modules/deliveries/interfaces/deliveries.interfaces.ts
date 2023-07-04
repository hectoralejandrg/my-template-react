export interface Company {
  id: number
  name: string
  carrier_code: string
}

export interface Destination {
  level1: string
  level2: string
  level3: string
  level4: string
}

export interface Ecommerce {
  id: number
  name: string
}

export interface Label {
  pdf: string
  zpl: string
}

export interface Origin {}

export interface Status {
  id: number
  name: string
  code: string
  terminal: boolean
}
export interface Deliveries {
  id: number
  imported_id: string
  tracking_number: string
  label: Label
  origin: Origin
  destination: Destination
  created_at: string
  updated_at: string
  status: Status
  company: Company
  ecommerce: Ecommerce
}
export interface DeliveriesResponse {
  count: number
  data: Deliveries[]
}
