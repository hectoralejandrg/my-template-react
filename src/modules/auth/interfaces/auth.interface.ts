export interface Role {
  id: number
  name: string
}

export interface Profile {
  role: Role
  companyId?: number
  email: string
  user_entity_id?: number
  user_id?: string
}
