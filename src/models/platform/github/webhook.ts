import crypto from 'node:crypto'

import {
  isNotWebHookSignatureMsg,
  NotParamMsg,
  NotWebHookSignatureMsg,
  WebHookSignatureSuccessMsg
} from '@/common'
import { Base } from '@/models/platform/github/base'
import type { ApiResponseType, WebHookParamType } from '@/types'

/**
 * GitHub WebHook 处理类，提供WebHook相关操作功能
 *
 * 该类继承自Base类，主要用于处理GitHub WebHook的签名验证等操作。
 * 支持验证WebHook请求的签名有效性，确保请求来源可信。
 *
 * @class WebHook
 * @extends Base
 */
export class WebHook extends Base {
  constructor (base: Base) {
    super(base)
    this.userToken = base.userToken
    this.ApiUrl = base.ApiUrl
    this.BaseUrl = base.BaseUrl
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
    return {
      status,
      statusCode,
      msg,
      data
    }
  }
}
