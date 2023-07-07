export interface NotificationState {
  message: string | null
  type: 'success' | 'error' | 'info' | ''
  open: boolean
}
