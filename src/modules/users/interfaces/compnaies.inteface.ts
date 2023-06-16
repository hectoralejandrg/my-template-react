export interface Company {
  id: number
  name: string
  carrier_code: string
}

export interface CompaniesResponse {
  companies: Company[]
}
