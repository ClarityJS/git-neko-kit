import jwt from 'jsonwebtoken'

import { ApiBaseUrl, BaseUrl } from '@/models/base/common'
import Request from '@/models/base/request'
import { App } from '@/models/github/event/app'
import { Auth } from '@/models/github/event/auth'
import { Install } from '@/models/github/event/install'
import { Repo } from '@/models/github/event/repo'
import type { GitHubAuthType, ProxyParamsType } from '@/types'

const type = 'github'

/**
 * Github API 基础类，发送请求，生成jwtToken 等操作
 */
export class GitHub {
  public app: App
  public install: Install
  public repo: Repo
  public auth: Auth
  public BaseUrl: string = BaseUrl(type)
  public ApiUrl: string = ApiBaseUrl(type)
  public jwtToken: string
  public APP_ID: string
  public Private_Key: string
  public Client_ID: string
  public Client_Secret: string
  private currentRequestConfig: { url: string, token: string }
  private proxy?: ProxyParamsType

  constructor (options: GitHubAuthType) {
    this.BaseUrl = BaseUrl(type)
    this.ApiUrl = ApiBaseUrl(type)
    this.APP_ID = options.APP_ID
    this.Private_Key = options.Private_Key
    this.Client_ID = options.Client_ID
    this.Client_Secret = options.Client_Secret
    this.jwtToken = this.generate_jwt()
    this.repo = new Repo(this, this.jwtToken)
    this.auth = new Auth(this, this.jwtToken)
    this.install = new Install(this, this.jwtToken)
    this.app = new App(this, this.jwtToken)

    this.currentRequestConfig = {
      url: this.ApiUrl,
      token: ''
    }
  }

  /**
   * 设置代理配置
   * @param proxy 代理配置对象
   * @param proxy.type 代理类型，例如 'http' 或 'https' 或'socks5'
   * @param proxy.address 代理地址，例如 'http://127.0.0.1:7890'
   */
  public setProxy (proxy?: ProxyParamsType): void {
    if (proxy?.address) {
      proxy.address = proxy.address.replace(/\/+$/, '')
    }
    this.proxy = proxy

    if (proxy?.type === 'common') {
      this.BaseUrl = BaseUrl(type, proxy.address)
      this.ApiUrl = ApiBaseUrl(type, proxy.address)
    }

    const token = this.currentRequestConfig.token || this.jwtToken
    this.repo = new Repo(this, token)
    this.auth = new Auth(this, token)
    this.install = new Install(this, token)
    this.app = new App(this, token)
  }

  /**
   * 设置 token
   * @param token 传入的 token
   */
  public setToken (token: string): void {
    if (!token.startsWith('ghu_')) throw new Error('token 格式错误')
    this.currentRequestConfig.token = token

    this.repo = new Repo(this, token)
    this.auth = new Auth(this, token)
    this.install = new Install(this, token)
    this.app = new App(this, token)
    if (this.proxy) {
      this.setProxy(this.proxy)
    }
  }

  /**
   * 生成 JWT
   * @param options 生成 JWT 所需的参数
   * @param options.APP_ID GitHub App ID
   * @param options.Private_Key 私钥内容
   * @returns 返回生成的 JWT
   */
  private generate_jwt (): string {
    const Private_Key = this.Private_Key
    const payload = {
      exp: Math.floor(Date.now() / 1000) + (10 * 60),
      iat: Math.floor(Date.now() / 1000),
      iss: this.APP_ID
    }
    return jwt.sign(payload, Private_Key, { algorithm: 'RS256' })
  }

  /**
 * 设置当前的 Request 配置，包括 URL 和 token
 * @param config 配置对象，包含 url 和 token
 * @param config.url 请求的 URL, 默认为 ApiUrl
 * @param config.token 请求的 token, 默认为 jwtToken
 */
  public setRequestConfig (config: { url?: string, token?: string }): void {
    if (config.url) this.currentRequestConfig.url = config.url
    if (config.token) this.currentRequestConfig.token = config.token
  }

  /**
   * 创建一个请求实例，使用当前的 token
   * @returns 返回一个配置好的 Request 实例
   */
  private createRequest (): Request {
    const { url, token } = this.currentRequestConfig
    const proxyConfig = this.proxy?.type !== 'common'
      ? this.proxy
      : undefined

    return new Request(url, token, proxyConfig)
  }

  /**
   * Github GET 请求方法
   * @param path 请求路径
   * @param parms 请求参数
   * @param customHeaders 请求头，选项
   * @returns 请求结果
   */
  public async get (path: string, parms?: any, customHeaders?: Record<string, string>) {
    const request = this.createRequest()
    const res = await request.get(path, parms, customHeaders)
    if (res.success) {
      return res.data
    } else {
      throw new Error(res.msg)
    }
  }

  /**
   * Github POST 请求方法
   * @param path 请求路径
   * @param data 请求数据
   * @param customHeaders 请求头，选项
   * @returns 请求结果
   */
  public async post (path: string, data: any, customHeaders?: Record<string, string>) {
    const request = this.createRequest()
    const res = await request.post(path, data, customHeaders)
    if (res.success) {
      return res.data
    } else {
      throw new Error(res.msg)
    }
  }
}
