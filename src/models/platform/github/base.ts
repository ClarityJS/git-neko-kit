import { URL } from 'node:url'

import jwt from 'jsonwebtoken'

import {
  isNotAccessTokeMsg,
  NotProxyAddressMsg,
  RateLimitMsg
} from '@/common'
import { ApiBaseUrl, BaseUrl } from '@/models/base/common'
import { Request } from '@/models/base/request'
import type { App } from '@/models/platform/github/app'
import type { Auth } from '@/models/platform/github/auth'
import type { Collaborator } from '@/models/platform/github/collaborator'
import type { Commit } from '@/models/platform/github/commit'
import type { Issue } from '@/models/platform/github/issue'
import type { Org } from '@/models/platform/github/org'
import type { Repo } from '@/models/platform/github/repo'
import type { User } from '@/models/platform/github/user'
import type { WebHook } from '@/models/platform/github/webhook'
import type {
  ApiResponseType,
  GitHubAuthType,
  ProxyParamsType,
  RequestConfigType
} from '@/types'

const type = 'github'

/**
 * GitHub API 基础服务类，提供与GitHub API交互的核心功能
 *
 * 此类作为GitHub API功能的入口点，封装了以下核心能力：
 * - JWT令牌生成与管理
 * - 请求代理配置
 * - 基础HTTP请求方法(GET/POST)
 * - 应用认证管理
 * - 模块化服务(App/Auth/Commit/Repo/User/WebHook)
 *
 * @example
 * ```ts
 * const base = new Base({
 *   APP_ID: 12345,
 *   Private_Key: '-----BEGIN PRIVATE KEY-----...',
 *   Client_ID: 'Iv1.1234567890abcdef',
 *   Client_Secret: 'abcdef1234567890abcdef1234567890abcdef12',
 *   WebHook_Secret: 'webhook_secret'
 * });
 * ```
 */
export class Base {
  // private static registry = new Map<string, new (base: Base) => any>()
  declare app: App
  declare auth: Auth
  declare commit: Commit
  declare repo: Repo
  declare user: User
  declare webhook: WebHook
  declare issue: Issue
  declare org: Org
  declare collaborator: Collaborator
  public BaseUrl: string
  public ApiUrl: string
  public jwtToken: string
  public userToken: string | null
  public readonly Private_Key: string
  public readonly Client_ID: string
  public readonly Client_Secret: string
  public readonly WebHook_Secret: string
  private currentRequestConfig: RequestConfigType
  private proxy?: ProxyParamsType | undefined

  constructor (options: GitHubAuthType) {
    this.Private_Key = options.Private_Key
    this.Client_ID = options.Client_ID
    this.Client_Secret = options.Client_Secret
    this.WebHook_Secret = options.WebHook_Secret
    this.jwtToken = this.generate_jwt()
    this.BaseUrl = BaseUrl(type)
    this.ApiUrl = ApiBaseUrl(type)
    this.userToken = null
    this.currentRequestConfig = {
      url: this.ApiUrl,
      token: null,
      tokenType: 'Bearer'
    }
  }

  /**
   * 注册模块
   * @param name 模块名称
   * @param ctor 模块构造函数
   * @example
   * ```ts
   * Base.register('app', App)
   * ```
   */
  // public static register<T extends Base> (
  //   name: string,
  //   ctor: new (base: Base) => T
  // ): void {
  //   Base.registry.set(name, ctor)
  // }

  /**
   * 获取模块实例
   * @param name 模块名称
   * @returns 模块实例
   * @example
   * ```ts
   * const app = Base.getRegister<App>('app')
   */
  // public getRegister<T> (name: string): T {
  //   const Ctor = Base.registry.get(name)
  //   if (!Ctor) {
  //     throw new Error(`未注册的服务: ${name}`)
  //   }
  //   return new Ctor(this)
  // }

  /**
   * 获取App实例
   * @returns App实例
   * @example
   * ```ts
   * const app = await base.get_app()
   * ```
   */
  public async get_app (): Promise<App> {
    const { App } = await import('@/models/platform/github/app')
    this.app = new App(this)
    return this.app
  }
  /**
   * 获取Auth实例
   * @returns Auth实例
   * @example
   * ```ts
   * const auth = await base.get_auth()
   * ```
   */

  public async get_auth (): Promise<Auth> {
    const { Auth } = await import('@/models/platform/github/auth')
    this.auth = new Auth(this)
    return this.auth
  }

  /**
   * 获取Commit实例
   * @returns Commit实例
   * @example
   * ```ts
   * const commit = await base.get_commit()
   * ```
   */
  public async get_commit (): Promise<Commit> {
    const { Commit } = await import('@/models/platform/github/commit')
    this.commit = new Commit(this)
    return this.commit
  }

  /**
   * 获取Issue实例
   * @returns Issue实例
   * @example
   * ```ts
   * const issue = await base.get_issue()
   * ```
   */
  public async get_issue (): Promise<Issue> {
    const { Issue } = await import('@/models/platform/github/issue')
    this.issue = new Issue(this)
    return this.issue
  }
  /**
   * 获取Repo实例
   * @returns Repo实例
   * @example
   * ```ts
   * const repo = await base.get_repo()
   * ```
   */

  public async get_repo (): Promise<Repo> {
    const { Repo } = await import('@/models/platform/github/repo')
    this.repo = new Repo(this)
    return this.repo
  }

  /**
   * 获取User实例
   * @returns User实例
   * @example
   * ```ts
   * const user = await base.get_user()
   * ```
   */
  public async get_user (): Promise<User> {
    const { User } = await import('@/models/platform/github/user')
    this.user = new User(this)
    return this.user
  }

  /**
   * 获取Org实例
   * @returns Org实例
   * @example
   * ```ts
   * const org = await base.get_org()
   * ```
   */
  public async get_org (): Promise<Org> {
    const { Org } = await import('@/models/platform/github/org')
    this.org = new Org(this)
    return this.org
  }

  /**
   * 获取WebHook实例
   * @returns WebHook实例
   * @example
   * ```ts
   * const webhook = await base.get_webhook()
   * ```
   */
  public async get_webhook (): Promise<WebHook> {
    const { WebHook } = await import('@/models/platform/github/webhook')
    this.webhook = new WebHook(this)
    return this.webhook
  }

  /**
   * 获取Collaborator实例
   * @returns Collaborator实例
   * @example
   * ```ts
   * const collaborator = await base.get_collaborator()
   * ```
   */
  public async get_collaborator (): Promise<Collaborator> {
    const { Collaborator } = await import('@/models/platform/github/collaborator')
    this.collaborator = new Collaborator(this)
    return this.collaborator
  }

  /**
   * 设置请求代理
   * @param proxy 代理参数
   * @example
   * ```ts
   *  base.setProxy({
   *    type: 'http',
   *    address: 'http://127.0.0.1:7890'
   * })
   * ```
   */
  public setProxy (proxy: ProxyParamsType): void {
    if (proxy?.address) {
      const url = new URL(proxy.address)
      if (!['http:', 'https:', 'socks:'].includes(url.protocol)) {
        throw new Error(NotProxyAddressMsg)
      }

      proxy.address = proxy.address.replace(/\/$/, '')
    }

    if (proxy?.type === 'common') {
      this.BaseUrl = BaseUrl(type, proxy.address)
      this.ApiUrl = ApiBaseUrl(type, proxy.address)
    }
    this.proxy = proxy
  }

  /**
   * 设置 token
   * 传入的 token 必须以 ghu_ 开头，否则会抛出错误
   * @param token 传入的 token
   * @example
   * ```ts
   * setToken('ghu_xxxx')
   * ```
   */
  public setToken (token: string): this {
    if (!token.startsWith('ghu_')) {
      console.log('token 必须以 ghu_ 开头')
      this.userToken = null
      throw new Error(isNotAccessTokeMsg)
    }
    this.userToken = token
    return this
  }

  /**
   * 生成 JWT Token
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
      iss: this.Client_ID
    }
    return jwt.sign(payload, Private_Key, { algorithm: 'RS256' })
  }

  /**
   * 设置当前请求的配置
   * @protected - 仅在类内部访问
   * @param config - 配置对象，包含以下属性:
   * - url: 请求的URL
   * - token: 认证令牌
   * - tokenType: 认证令牌类型，默认为 'Bearer'
   */
  protected setRequestConfig (config: RequestConfigType): void {
    if (config.url) this.currentRequestConfig.url = config.url
    if (config.token) this.currentRequestConfig.token = config.token
    if (config.tokenType) this.currentRequestConfig.tokenType = config.tokenType
  }

  /**
   * 创建一个新的请求实例
   * @returns 返回一个新的 Request 实例
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
    try {
      const request = this.createRequest()
      const req = await request.get(path, parms, customHeaders)
      if (req.statusCode === 403 && req.data.message.includes('API rate limit exceeded')) {
        throw new Error(RateLimitMsg)
      }
      return {
        status: req.success ? 'ok' : 'error',
        statusCode: req.statusCode,
        msg: req.msg,
        data: req.data
      }
    } catch (error) {
      throw new Error(`GET 请求${path}失败: ${(error as Error).message}`)
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
    try {
      const request = this.createRequest()
      const req = await request.post(path, data, customHeaders)
      if (req.statusCode === 403 && req.data.message.includes('API rate limit exceeded')) {
        throw new Error(RateLimitMsg)
      }
      return {
        status: req.success ? 'ok' : 'error',
        statusCode: req.statusCode,
        msg: req.msg,
        data: req.data
      }
    } catch (error) {
      throw new Error(`POST 请求${path}失败: ${(error as Error).message}`)
    }
  }

  /**
   * Github PUT 请求方法
   * @param path - 请求路径
   * @param data - 请求数据
   * @param customHeaders - 请求头，选项
   * @returns 请求结果
   */
  public async put (path: string, data: any, customHeaders?: Record<string, string>): Promise<ApiResponseType> {
    try {
      const request = this.createRequest()
      const req = await request.put(path, data, customHeaders)
      if (req.statusCode === 403 && req.data.message.includes('API rate limit exceeded')) {
        throw new Error(RateLimitMsg)
      }
      return {
        status: req.success ? 'ok' : 'error',
        statusCode: req.statusCode,
        msg: req.msg,
        data: req.data
      }
    } catch (error) {
      throw new Error(`PUT 请求${path}失败: ${(error as Error).message}`)
    }
  }

  /**
   * Github DELETE 请求方法
   * @param path - 请求路径
   * @param data - 请求数据
   * @param customHeaders - 请求头，选项
   * @returns 请求结果
   */
  public async delete (path: string, data: any, customHeaders?: Record<string, string>): Promise<ApiResponseType> {
    try {
      const request = this.createRequest()
      const req = await request.delete(path, data, customHeaders)
      if (req.statusCode === 403 && req.data.message.includes('API rate limit exceeded')) {
        throw new Error(RateLimitMsg)
      }
      return {
        status: req.success ? 'ok' : 'error',
        statusCode: req.statusCode,
        msg: req.msg,
        data: req.data
      }
    } catch (error) {
      throw new Error(`DELETE 请求${path}失败: ${(error as Error).message}`)
    }
  }
}
