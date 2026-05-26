export type ToastType = 'success' | 'error' | 'info' | 'warning'
 
export interface Toast {
  id: string
  type: ToastType
  message: string
}
 
export interface ToastContextValue {
  success: (msg: string) => void
  error:   (msg: string) => void
  info:    (msg: string) => void
  warning: (msg: string) => void
}