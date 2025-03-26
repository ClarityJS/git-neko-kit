export interface ResponseType<T = any> {
  success: boolean
  statusCode: number
  data?: T
  msg?: string
}
