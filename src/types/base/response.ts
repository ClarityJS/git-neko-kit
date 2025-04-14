/** 是否响应成功类型 */
export type ResponseSuccessType = boolean

/** 状态码响应类型 */
export type ResponseStatusCodeType = number

/** 消息响应类型 */
export type ResponseMsgType = string

/** 响应类型 */
export interface ResponseType<D = any> {
  success: ResponseSuccessType
  statusCode: ResponseStatusCodeType
  msg: ResponseMsgType
  data: D
}

/** API响应类型 */
export interface ApiResponseType<D = any> extends Omit<ResponseType<D>, 'success'> {
  status: 'ok' | 'error'
}
