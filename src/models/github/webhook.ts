import crypto from 'node:crypto'

import { isNotWebHookSignatureMsg, NotParamMsg, NotWebHookSignatureMsg, WebHookSignatureSuccessMsg } from '@/common'
import { GitHub } from '@/models/github/github'
import type { ApiResponseType, WebHookParamType } from '@/types'

/**
 * WebHook类, 用于进行WebHook相关操作
 * 如获取WebHook信息等
 * @class WebHook
 * @property {Function} get - 封装的GET请求方法
 * @property {string} ApiUrl - GitHub API端点URL
 * @property {string} jwtToken - 认证令牌
 *
 */
export class WebHook {
  private readonly WebHook_Secret: string
  constructor (private readonly options: GitHub) {
    this.WebHook_Secret = this.options.WebHook_Secret
  }

  /**
   * 检查WebHook签名是否正确
   * @param options - WebHook参数对象，必须包含以下参数：
   * - secret: WebHook的密钥
   * - payload: 要验证的签名主体
   * - signature: 要验证的签名
   * @returns 验证结果
   */
  public check_webhook_signature (options: WebHookParamType): ApiResponseType<boolean> {
    const secret = options.secret ?? this.WebHook_Secret
    if (!secret || !options.payload || !options.signature) throw new Error(NotParamMsg)
    if (!options.signature.startsWith('sha256=')) throw new Error(isNotWebHookSignatureMsg)

    let status: 'ok' | 'error' = 'error'
    let statusCode = 400
    let msg = NotWebHookSignatureMsg
    let data: boolean = false

    try {
      const hmac = crypto.createHmac('sha256', secret)
      const payloadString = typeof options.payload === 'string'
        ? options.payload
        : JSON.stringify(options.payload)
      hmac.update(payloadString, 'utf8')
      const calculatedSignature = hmac.digest('hex')
      const receivedSignature = options.signature.replace('sha256=', '')

      const isValid = crypto.timingSafeEqual(
        Buffer.from(calculatedSignature),
        Buffer.from(receivedSignature)
      )

      if (isValid) {
        status = 'ok'
        statusCode = 200
        msg = WebHookSignatureSuccessMsg
        data = true
      } else {
        status = 'error'
        statusCode = 403
        msg = NotWebHookSignatureMsg
        data = false
      }
    } catch (error) {
      throw new Error(`请求验证WebHook签名失败: ${(error as Error).message}`)
    }
    return { status, statusCode, msg, data }
  }
}
