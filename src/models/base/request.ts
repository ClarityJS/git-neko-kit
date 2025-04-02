import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { HttpProxyAgent } from 'http-proxy-agent'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { SocksProxyAgent } from 'socks-proxy-agent'

import { pkg } from '@/common'
import type { ProxyParamsType, RequestTokenType, ResponseType } from '@/types'

class Request {
  private baseUrl: string
  private tokenType: RequestTokenType
  private authorization?: string
  private proxy?: ProxyParamsType

  constructor (
    baseUrl: string,
    tokenType: RequestTokenType = 'Bearer',
    authorization?: string,
    proxy?: ProxyParamsType
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
    this.authorization = authorization
    this.proxy = proxy
    this.tokenType = tokenType
  }

  private async request (
    method: 'get' | 'post',
    path: string,
    data?: any,
    params?: any,
    customHeaders?: Record<string, string>
  ): Promise<ResponseType> {
    const url = `${this.baseUrl}/${path}`.replace(/\/+/g, '/')
    const config: AxiosRequestConfig = {
      headers: this.createHeaders(customHeaders),
      params,
      validateStatus: () => true
    }

    /** 代理配置 */
    if (this.proxy) {
      const httpAddress = this.proxy.type === 'http' ? this.proxy.address : undefined
      const httpsAddress = this.proxy.type === 'https' ? this.proxy.address : undefined
      const socksAddress = this.proxy.type === 'socks' ? this.proxy.address : undefined

      /** HTTP代理配置 */
      if (httpAddress) {
        config.httpAgent = new HttpProxyAgent(httpAddress)
        config.httpsAgent = new HttpsProxyAgent(httpAddress)
      }
      /** HTTPS代理配置 */
      if (httpsAddress) {
        config.httpsAgent = new HttpsProxyAgent(httpsAddress)
      }
      /** SOCKS代理配置 */
      if (socksAddress) {
        const socksAgent = new SocksProxyAgent(socksAddress)
        config.httpAgent = socksAgent
        config.httpsAgent = socksAgent
      }
    }
    try {
      const response = method === 'get'
        ? await axios.get(url, config)
        : await axios.post(url, data, config)

      return {
        success: true,
        statusCode: response.status,
        data: response.data,
        msg: response.status >= 200 && response.status < 300 ? '请求成功' : '请求异常'
      }
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        msg: (error as AxiosError).message || '网络连接失败',
        data: null
      }
    }
  }

  async get (path: string, params?: any, customHeaders?: Record<string, string>): Promise<ResponseType> {
    return this.request('get', path, undefined, params, customHeaders)
  }

  async post (path: string, data?: any, customHeaders?: Record<string, string>): Promise<ResponseType> {
    return this.request('post', path, data, undefined, customHeaders)
  }

  /**
   * 创建请求头
   * @returns 请求头对象
   */
  private createHeaders (customHeaders?: Record<string, string>) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': pkg.name
    }

    if (this.authorization) {
      if (this.tokenType === 'Basic') {
        const basicToken = Buffer.from(this.authorization).toString('base64')
        headers['Authorization'] = `Basic ${basicToken}`
      } else if (this.tokenType === 'Bearer') {
        headers['Authorization'] = `Baerer ${this.authorization}`
      } else {
        headers['Authorization'] = `${this.tokenType} ${this.authorization}`
      }
    }

    if (customHeaders) {
      Object.assign(headers, customHeaders)
    }

    return headers
  }
}

export default Request
