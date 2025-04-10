import jwt from 'jsonwebtoken'

import { ApiBaseUrl, BaseUrl } from '@/models/base/common'
import Request from '@/models/base/request'
import { App } from '@/models/github/app'
import { Auth } from '@/models/github/auth'
import { Commit } from '@/models/github/commit'
import { Repo } from '@/models/github/repo'
import { User } from '@/models/github/user'
import type {
  ApiResponseType,
  GitHubAuthType,
  ProxyParamsType,
  RequestConfigType
} from '@/types'

const type = 'github'

/**
 * Github API 基础类，发送请求，生成jwtToken 等操作
 * @class GitHub
 * @property {string} BaseUrl - GitHub API基础URL
 * @property {string} ApiUrl - GitHub API端点URL
 * @property {string} jwtToken - 认证令牌
 * @property {string} Client_ID - GitHub App 的 Client ID
 * @property {string} Client_Secret - GitHub App 的 Client Secret
 * @property {Function} get - 封装的GET请求方法
 * @property {Function} post - 封装的POST请求方法
 *
 */
export class GitHub {
  public app: App
  public repo: Repo
  public auth: Auth
  public user: User
  public commit: Commit

  public BaseUrl: string = BaseUrl(type)
  public ApiUrl: string = ApiBaseUrl(type)
  public jwtToken: string
  public userToken: string | null
  public APP_ID: string
  public Private_Key: string
  public Client_ID: string
  public Client_Secret: string
  private currentRequestConfig: RequestConfigType
  private proxy?: ProxyParamsType

  /**
   * GitHub API 基础类，发送请求，生成jwtToken 等操作
   * @param options - 初始化参数
   * @param options.APP_ID - GitHub App ID
   * @param options.Private_Key - GitHub App 的 Private Key
   * @param options.Client_ID - GitHub App 的 Client ID
   * @param options.Client_Secret - GitHub App 的 Client Secret
   *
   */
  constructor (options: GitHubAuthType) {
    this.BaseUrl = BaseUrl(type)
    this.ApiUrl = ApiBaseUrl(type)
    this.APP_ID = options.APP_ID
    this.Private_Key = options.Private_Key
    this.Client_ID = options.Client_ID
    this.Client_Secret = options.Client_Secret
    this.jwtToken = this.generate_jwt()
    this.repo = new Repo(this)
    this.auth = new Auth(this)
    this.app = new App(this)
    this.user = new User(this)
    this.commit = new Commit(this)

    this.currentRequestConfig = {
      url: this.ApiUrl,
      token: null,
      tokenType: 'Bearer'
    }
    this.userToken = null
  }

  /**
   * 初始化方法
   */
  private init (): void {
    this.repo = new Repo(this)
    this.auth = new Auth(this)
    this.app = new App(this)
    this.user = new User(this)
    this.commit = new Commit(this)
  }

  /**
   * 设置代理配置
   * @param proxy - 代理配置对象
   * @param proxy.type - 代理类型，可选值为 'common' | 'http' | 'https' | 'socks' @example 'http
   * @param proxy.address - 代理地址 @example 'http://127.0.0.1:7890'
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

    this.init()
  }

  /**
   * 设置 token
   * @param token 传入的 token
   */
  public setToken (token: string): void {
    if (!token.startsWith('ghu_')) {
      this.userToken = null
      throw new Error('token 格式错误')
    }
    this.userToken = token

    this.init()
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
 * @param config.url 请求的 URL @default ApiUrl
 * @param config.token 请求的 token @default jwtToken
 * @param config.tokenType token 类型 @default Bearer
 */
  public setRequestConfig (config: RequestConfigType): void {
    if (config.url) this.currentRequestConfig.url = config.url
    if (config.token) this.currentRequestConfig.token = config.token
    if (config.tokenType) this.currentRequestConfig.tokenType = config.tokenType
  }

  /**
   * 创建一个请求实例，使用当前的 token
   * @returns 返回一个配置好的 Request 实例
   */
  private createRequest (): Request {
    const { url, token, tokenType } = this.currentRequestConfig
    const proxyConfig = this.proxy?.type !== 'common' ? this.proxy : undefined
    return new Request(url ?? this.ApiUrl, tokenType, token ?? undefined, proxyConfig)
  }

  /**
   * Github GET 请求方法
   * @param path - 请求路径
   * @param parms - 请求参数
   * @param customHeaders - 请求头，选项
   * @returns 请求结果
   */
  public async get (path: string, parms?: any, customHeaders?: Record<string, string>): Promise<ApiResponseType> {
    const request = this.createRequest()
    const req = await request.get(path, parms, customHeaders)
    return {
      status: req.success ? 'ok' : 'error',
      statusCode: req.statusCode,
      msg: req.msg,
      data: req.data
    }
  }

  /**
   * Github POST 请求方法
   * @param path - 请求路径
   * @param data - 请求数据
   * @param customHeaders - 请求头，选项
   * @returns 请求结果
   */
  public async post (path: string, data: any, customHeaders?: Record<string, string>): Promise<ApiResponseType> {
    const request = this.createRequest()
    const req = await request.post(path, data, customHeaders)
    return {
      status: req.success ? 'ok' : 'error',
      statusCode: req.statusCode,
      msg: req.msg,
      data: req.data
    }
  }
}
