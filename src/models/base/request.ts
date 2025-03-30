import axios, { AxiosRequestConfig } from 'axios'

import { pkg } from '@/common'
import { ResponseType } from '@/types'

class Request {
  private baseUrl: string
  private authorization?: string

  constructor (baseUrl: string, authorization?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
    this.authorization = authorization
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
    } catch (error: any) {
      let statusCode = 500
      let errorMsg = '请求失败'

      if (error.response) {
        statusCode = error.response?.status ?? 500
        errorMsg = error.response?.data?.message ?? error.message
        /** 后续处理 */
      //   if (statusCode === 401) {
      //     errorMsg = '认证失败，请检查 token'
      //   }
      // } else if (error.request) {
      //   errorMsg = '网络错误：服务器没有响应'
      // } else {
      //   errorMsg = error.message ?? '请求失败'
      }

      return {
        success: false,
        statusCode,
        msg: errorMsg,
        data: error.response?.data
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
