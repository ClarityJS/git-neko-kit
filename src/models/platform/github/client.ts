import { URL } from 'node:url'

import jwt from 'jsonwebtoken'

import {
  InvalidProxyAddressMsg,
  MissingAccessTokenMsg,
  MissingRequestPathMsg,
  RateLimitExceededMsg
} from '@/common'
import { get_api_base_url, get_base_url } from '@/models/base/common'
import { Request } from '@/models/base/request'
import type { App } from '@/models/platform/github/app'
import type { Auth } from '@/models/platform/github/auth'
import type { Commit } from '@/models/platform/github/commit'
import type { Issue } from '@/models/platform/github/issue'
import type { Org } from '@/models/platform/github/org'
import type { Pull_Request } from '@/models/platform/github/pull_request'
import type { Repo } from '@/models/platform/github/repo'
import type { User } from '@/models/platform/github/user'
import type { WebHook } from '@/models/platform/github/webhook'
import type {
  ApiResponseType,
  GitHubClientType,
  GitType,
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
 * - 基础HTTP请求方法(GET/POST/PATCH/DELETE/PUT)
 * - 应用认证管理
 * - 模块化服务(App/Auth/Commit/Repo/User/WebHook)
 *
 * @example
 * ```ts
 * const base = new GitHubClient({
 *   APP_ID: 12345,
 *   Private_Key: '-----BEGIN PRIVATE KEY-----...',
 *   Client_ID: 'Iv1.1234567890abcdef',
 *   Client_Secret: 'abcdef1234567890abcdef1234567890abcdef12',
 *   WebHook_Secret: 'webhook_secret'
 * });
 * ```
 */
export class GitHubClient {
  declare app: App
  declare auth: Auth
  declare commit: Commit
  declare repo: Repo
  declare user: User
  declare webhook: WebHook
  declare issue: Issue
  declare org: Org
  declare pull_request: Pull_Request
  public BaseUrl: string
  public ApiUrl: string
  public jwtToken: string
  public userToken: string | null
  public readonly format: boolean
  public readonly Private_Key: string
  public readonly Client_ID: string
  public readonly Client_Secret: string
  public readonly WebHook_Secret: string
  private currentRequestConfig: RequestConfigType
  private proxy?: ProxyParamsType | null

  constructor (options: GitHubClientType) {
    this.Private_Key = options.Private_Key
    this.Client_ID = options.Client_ID
    this.Client_Secret = options.Client_Secret
    this.WebHook_Secret = options.WebHook_Secret
    this.jwtToken = this.generate_jwt()
    this.BaseUrl = get_base_url(type)
    this.ApiUrl = get_api_base_url(type)
    this.userToken = null
    this.currentRequestConfig = {
      url: this.ApiUrl,
      token: null,
      tokenType: 'Bearer'
    }
    this.format = options.format ?? false
  }

  /**
   * 获取Git平台类型
   * @returns Git平台类型，如: github,gitee
   */
  public get type (): GitType {
    return type
  }

  /**
   * 获取App实例
   * @returns App实例
   * @example
   * ```ts
   * const app = await GitHubClient.get_app()
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
   * const auth = await GitHubClient.get_auth()
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
   * const commit = await GitHubClient.get_commit()
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
   * const issue = await GitHubClient.get_issue()
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
   * const repo = await GitHubClient.get_repo()
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
   * const user = await GitHubClient.get_user()
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
   * const org = await GitHubClient.get_org()
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
   * const webhook = await GitHubClient.get_webhook()
   * ```
   */
  public async get_webhook (): Promise<WebHook> {
    const { WebHook } = await import('@/models/platform/github/webhook')
    this.webhook = new WebHook(this)
    return this.webhook
  }

  /**
   * 获取Pull_request实例
   * @returns Pull_request实例
   * @example
   * ```ts
   * const pull_request = await GitHubClient.get_pull_request()
   * ```
   */
  public async get_pull_request (): Promise<Pull_Request> {
    const { Pull_Request } = await import('@/models/platform/github/pull_request')
    this.pull_request = new Pull_Request(this)
    return this.pull_request
  }

  /**
   * 设置请求代理
   * @param proxy 代理参数
   * @example
   * ```ts
   *  setProxy({
   *    type: 'http',
   *    address: 'http://127.0.0.1:7890'
   * })
   * ```
   */
  public setProxy (proxy: ProxyParamsType): void {
    if (!proxy?.address) {
      this.proxy = null
      return
    }
    try {
      const url = new URL(proxy.address)

      switch (url.protocol) {
        case 'http:':
        case 'https:':
        case 'socks:':
        case 'socks5:':
          proxy.address = `${url.protocol}//${url.host}`
          break
        default:
          throw new Error(InvalidProxyAddressMsg)
      }

      switch (proxy?.type) {
        case 'common':
        case 'reverse':
          this.BaseUrl = get_base_url(type, proxy.address, proxy.type)
          this.ApiUrl = get_api_base_url(type, proxy.address, proxy.type)
          break
      }

      this.proxy = proxy
    } catch (error) {
      this.proxy = null
      throw new Error(InvalidProxyAddressMsg)
    }
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
      this.userToken = null
      throw new Error(MissingAccessTokenMsg)
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
    const proxyConfig = this.proxy?.type !== 'common' ? this.proxy : null
    const customHeaders = {
      'X-GitHub-Api-Version': '2022-11-28',
      Accept: 'application/vnd.github+json'
    }
    return new Request(url ?? this.ApiUrl, tokenType, token, proxyConfig, customHeaders)
  }

  /**
   * Github GET 请求方法
   * @param path - 请求路径
   * @param parms - 请求参数
   * @param customHeaders - 请求头，选项
   * @returns 请求结果
   */
  public async get (
    path: string,
    parms?: any,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponseType> {
    try {
      if (!path) throw new Error(MissingRequestPathMsg)
      const request = this.createRequest()
      const req = await request.get(path, parms, customHeaders)
      if ((req.statusCode === 403 || req.statusCode === 429) && req.headers['x-ratelimit-remaining'] === '0') {
        throw new Error(RateLimitExceededMsg)
      }
      return {
        success: req.success,
        status: req.success ? 'ok' : 'error',
        statusCode: req.statusCode,
        msg: req.msg,
        data: req.data
      }
    } catch (error) {
      throw new Error(`[GitHub] GET 请求${path}失败: ${(error as Error).message}`)
    }
  }

  /**
   * Github POST 请求方法
   * @param path - 请求路径
   * @param data - 请求数据
   * @param customHeaders - 请求头，选项
   * @returns 请求结果
   */
  public async post (
    path: string,
    data: any,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponseType> {
    try {
      if (!path) throw new Error(MissingRequestPathMsg)
      const request = this.createRequest()
      const req = await request.post(path, data, customHeaders)
      if ((req.statusCode === 403 || req.statusCode === 429) && req.headers['x-ratelimit-remaining'] === '0') {
        throw new Error(RateLimitExceededMsg)
      }
      return {
        success: req.success,
        status: req.success ? 'ok' : 'error',
        statusCode: req.statusCode,
        msg: req.msg,
        data: req.data
      }
    } catch (error) {
      throw new Error(`[GitHUb] POST 请求${path}失败: ${(error as Error).message}`)
    }
  }

  /**
   * Github PATCH 请求方法
   * @param path - 请求路径
   * @param data - 请求数据
   * @param params - URL查询参数
   * @param customHeaders - 请求头，选项
   * @returns 请求结果
   */
  public async patch (
    path: string,
    params: Record<string, string> | null = null,
    data: any,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponseType> {
    try {
      if (!path) throw new Error(MissingRequestPathMsg)
      const request = this.createRequest()
      const req = await request.patch(path, params, data, customHeaders)
      if ((req.statusCode === 403 || req.statusCode === 429) && req.headers['x-ratelimit-remaining'] === '0') {
        throw new Error(RateLimitExceededMsg)
      }
      return {
        success: req.success,
        status: req.success ? 'ok' : 'error',
        statusCode: req.statusCode,
        msg: req.msg,
        data: req.data
      }
    } catch (error) {
      throw new Error(`[GitHub] PATCH 请求${path}失败: ${(error as Error).message}`)
    }
  }

  /**
   * Github PUT 请求方法
   * @param path - 请求路径
   * @param data - 请求数据
   * @param customHeaders - 请求头，选项
   * @returns 请求结果
   */
  public async put (
    path: string,
    data: any,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponseType> {
    try {
      if (!path) throw new Error(MissingRequestPathMsg)
      const request = this.createRequest()
      const req = await request.put(path, data, customHeaders)
      if ((req.statusCode === 403 || req.statusCode === 429) && req.headers['x-ratelimit-remaining'] === '0') {
        throw new Error(RateLimitExceededMsg)
      }
      return {
        success: req.success,
        status: req.success ? 'ok' : 'error',
        statusCode: req.statusCode,
        msg: req.msg,
        data: req.data
      }
    } catch (error) {
      throw new Error(`[GitHUb] PUT 请求${path}失败: ${(error as Error).message}`)
    }
  }

  /**
   * Github DELETE 请求方法
   * @param path - 请求路径
   * @param params - URL查询参数
   * @param data - 请求体数据
   * @param customHeaders - 请求头，选项
   * @returns 请求结果
   */
  public async delete (
    path: string,
    params: Record<string, string> | null = null,
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponseType> {
    try {
      if (!path) throw new Error(MissingRequestPathMsg)
      const request = this.createRequest()
      const req = await request.delete(path, params, data, customHeaders)
      if ((req.statusCode === 403 || req.statusCode === 429) && req.headers['x-ratelimit-remaining'] === '0') {
        throw new Error(RateLimitExceededMsg)
      }
      return {
        success: req.success,
        status: req.success ? 'ok' : 'error',
        statusCode: req.statusCode,
        msg: req.msg,
        data: req.data
      }
    } catch (error) {
      throw new Error(`[GitHub] DELETE 请求${path}失败: ${(error as Error).message}`)
    }
  }
}
