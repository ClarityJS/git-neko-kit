import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { HttpProxyAgent } from 'http-proxy-agent'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { SocksProxyAgent } from 'socks-proxy-agent'

import { pkg } from '@/common'
import { ResponseType } from '@/types'

class Request {
  private baseUrl: string
  private authorization?: string
  private proxy?: {
    http?: string
    https?: string
    socks?: string
  }

  constructor (baseUrl: string, authorization?: string, proxy?: { http?: string, https?: string, socks?: string }) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
    this.authorization = authorization
    this.proxy = proxy
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
      params
    }

    /** 代理配置 */
    if (this.proxy) {
      const { http, https, socks } = this.proxy
      /** HTTP代理配置 */
      if (http) {
        config.httpAgent = new HttpProxyAgent(http)
        config.httpsAgent = new HttpsProxyAgent(http)
      } else if (https) {  /** HTTPS代理配置 */
        config.httpsAgent = new HttpsProxyAgent(https)
      }
      /** SOCKS代理配置 */
      if (socks) {
        const socksAgent = new SocksProxyAgent(socks)
        config.httpAgent = socksAgent
        config.httpsAgent = socksAgent
      }
    }
    try {
      const response = method === 'get'
        ? await axios.get(url, { ...config, params })
        : await axios.post(url, data, { ...config })
      return {
        success: true,
        statusCode: response.status,
        data: response.data,
        msg: '请求成功'
      }
    } catch (error) {
      let statusCode = 500
      let errorMsg = '请求失败'
      if (error instanceof AxiosError) {
        if (error.response) {
          statusCode = error.response.status ?? 500
          errorMsg = error.response.data?.message ?? error.message

        /** 后续处理 */
          //   if (statusCode === 401) {
          //     errorMsg = '认证失败，请检查 token'
          //   }
          // } else if (error.request) {
          //   errorMsg = '网络错误：服务器没有响应'
          // } else {
          //   errorMsg = error.message ?? '请求失败'
        }
      }

      return {
        success: false,
        statusCode,
        msg: errorMsg,
        data: (error instanceof AxiosError) ? error.response?.data : error
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
      headers['Authorization'] = `Bearer ${this.authorization}`
    }

    if (customHeaders) {
      Object.assign(headers, customHeaders)
    }

    return headers
  }
}

export default Request
