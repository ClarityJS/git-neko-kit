export interface WebHookParamType {
  /** WebHook 的 secret */
  secret?: string;
  /** 请求体 */
  payload: string;
  /** GitHub 发送的签名头 */
  signature: string;
}
