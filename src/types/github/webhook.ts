export interface WebHookParamType {
  /** WebHook 的 secret */
  secret?: string;
  /** 签名内容 */
  sign_body: string;
  /** GitHub 发送的签名头 */
  signature: string;
}
