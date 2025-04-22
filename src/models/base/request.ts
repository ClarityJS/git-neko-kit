import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { HttpProxyAgent } from 'http-proxy-agent'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { SocksProxyAgent } from 'socks-proxy-agent'

import { pkg } from '@/common'
import type { ProxyParamsType, RequestTokenType, ResponseType } from '@/types'

/**
 * HTTP请求客户端类，支持GET/POST请求、代理配置和多种认证方式
 */
export class Request {
  private readonly baseUrl: string
  private readonly tokenType: RequestTokenType
  private readonly authorization?: string
  private readonly proxy?: ProxyParamsType

  /**
   * 创建Request实例
   * @param baseUrl - 基础URL
   * @param tokenType - 认证类型，默认为'Bearer'
   * @param authorization - 认证令牌
   * @param proxy - 代理配置
   */
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

  /**
   * 执行HTTP请求
   * @param method - HTTP方法 ('get' | 'post' | 'put')
   * @param path - 请求路径
   * @param data - POST请求体数据
   * @param params - URL查询参数
   * @param customHeaders - 自定义请求头
   * @returns 响应结果
   */
  private async request (
    method: 'get' | 'post' | 'put',
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

      if (httpAddress) {
        /** HTTP代理配置 */
        config.httpAgent = new HttpProxyAgent(httpAddress)
        config.httpsAgent = new HttpsProxyAgent(httpAddress)
      } else if (httpsAddress) {
        /** HTTPS代理配置 */
        config.httpsAgent = new HttpsProxyAgent(httpsAddress)
      } else if (socksAddress) {
        /** SOCKS代理配置 */
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
        msg: response.status >= 200 && response.status < 500 ? '请求成功' : '请求异常'
      }
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        msg: (error as AxiosError).message ?? '网络连接失败',
        data: null
      }
    }
  }

  /**
   * 发送GET请求
   * @param path - 请求路径
   * @param params - URL查询参数
   * @param customHeaders - 自定义请求头
   * @returns 响应结果
   */
  async get (path: string, params?: any, customHeaders?: Record<string, string>): Promise<ResponseType> {
    return this.request('get', path, undefined, params, customHeaders)
  }

  /**
   * 发送POST请求
   * @param path - 请求路径
   * @param data - 请求体数据
   * @param customHeaders - 自定义请求头
   * @returns 响应结果
   */
  async post (path: string, data?: any, customHeaders?: Record<string, string>): Promise<ResponseType> {
    return this.request('post', path, data, undefined, customHeaders)
  }

  /**
   * 发送PUT请求
   * @param path
   * @param data
   * @param customHeaders
   * @returns 响应结果
   */
  async put (path: string, data?: any, customHeaders?: Record<string, string>): Promise<ResponseType> {
    return this.request('put', path, data, undefined, customHeaders)
  }

  /**
   * 创建请求头
   * @param customHeaders - 自定义请求头
   * @returns 包含基础头信息和认证信息的请求头对象
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
        headers['Authorization'] = `Bearer ${this.authorization}`
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
