import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

import { ApiBaseUrl, BaseUrl } from '@/models/base/base'
import Request from '@/models/base/request'
import { App } from '@/models/github/event/app'
import { Auth } from '@/models/github/event/auth'
import { Install } from '@/models/github/event/install'
import { Repo } from '@/models/github/event/repo'
import type { GitHubAuthType } from '@/types'

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
  private state_id: string
  private currentRequestConfig: { url: string, token: string }

  constructor (options: GitHubAuthType) {
    this.BaseUrl = BaseUrl(type)
    this.ApiUrl = ApiBaseUrl(type)
    this.APP_ID = options.APP_ID
    this.Private_Key = options.Private_Key
    this.Client_ID = options.Client_ID
    this.Client_Secret = options.Client_Secret
    this.state_id = this.create_state()
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
   * 设置 token
   * @param token 传入的 token
   */
  public setToken (token: string): void {
    this.currentRequestConfig.token = token
    this.repo = new Repo(this, this.jwtToken)
    this.auth = new Auth(this, this.jwtToken)
    this.install = new Install(this, this.jwtToken)
  }

  /**
   * 获取当前随机生成的字符串 state_id
   * @returns 返回当前的 state_id
   */
  public getStateId () {
    return this.state_id
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
   * 创建唯一的state_id
   * @returns 返回生成的 state_id
   */
  private create_state (): string {
    const state_id = uuidv4().replace(/-/g, '')
    return state_id
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
  private createRequest () {
    const { url, token } = this.currentRequestConfig
    return new Request(url, token)
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
