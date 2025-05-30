import crypto from 'node:crypto'

import {
  isNotWebHookSignatureMsg,
  NotParamMsg,
  NotWebHookSignatureMsg,
  WebHookSignatureSuccessMsg
} from '@/common'
import { GitHubClient } from '@/models/platform/github/base'
import type {
  ApiResponseType,
  WebHookSignatureParamType,
  WebHookSignatureResponseType
} from '@/types'

/**
 * Base WebHook操作类
 *
 * 提供对GitHub WebHook的CRUD操作，包括：
 * - 检查webhook签名是否正确
 */
export class WebHook extends GitHubClient {
  constructor (base: GitHubClient) {
    super(base)
    this.userToken = base.userToken
    this.ApiUrl = base.ApiUrl
    this.BaseUrl = base.BaseUrl
  }

  /**
   * 检查WebHook签名是否正确
   * 权限：无需任何权限
   * @param options - WebHook参数对象，必须包含以下参数：
   * - secret: WebHook的密钥, 可以从Base类入口传递
   * - payload: 要验证的签名主体
   * - signature: 要验证的签名
   * @returns 验证结果
   * @example
   * ```ts
   * const res = await check_webhook_signature({
   *   secret: 'your_secret',
   *   payload: 'your_payload',
   *   signature: 'your_signature'
   * })
   * ```
   */
  public async check_webhook_signature (
    options: WebHookSignatureParamType
  ):Promise<ApiResponseType<WebHookSignatureResponseType>> {
    const secret = options.secret ?? this.WebHook_Secret
    if (!secret || !options.payload || !options.signature) throw new Error(NotParamMsg)
    if (!options.signature.startsWith('sha256=')) throw new Error(isNotWebHookSignatureMsg)

    let success: boolean = false
    let status: 'ok' | 'error' = 'error'
    let statusCode = 400
    let msg = NotWebHookSignatureMsg
    let WebHookdata: WebHookSignatureResponseType

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
        success = true
        status = 'ok'
        statusCode = 200
        msg = '请求成功'
        WebHookdata = {
          success,
          info: WebHookSignatureSuccessMsg
        }
      } else {
        success = false
        status = 'error'
        statusCode = 403
        msg = '请求失败'
        WebHookdata = {
          success,
          info: NotWebHookSignatureMsg
        }
      }
    } catch (error) {
      throw new Error(`请求验证WebHook签名失败: ${(error as Error).message}`)
    }
    return Promise.resolve(
      {
        success,
        status,
        statusCode,
        msg,
        data: WebHookdata
      }
    )
  }
}
