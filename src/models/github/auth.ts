import {
  AccessTokenSuccessMsg,
  isNotAccessTokenMsg,
  isNotRefreshTokenMsg,
  isNotSuccessAccessTokenMsg,
  NotAccessCodeMsg,
  NotAccessTokenMsg,
  NotPerrmissionMsg,
  NotRefreshTokenSuccessMsg,
  RefreshAccessTokenSuccessMsg
} from '@/common'
import { GitHub } from '@/models/github/github'
import type {
  AccessCodeType,
  AccessTokenType,
  ApiResponseType,
  GithubOauthCheckTokenResponseType,
  GithubOauthRefreshTokenResponseType,
  GithubOauthTokenResponseType,
  RefreshTokenType
} from '@/types'

/**
 * 授权类，用于获取 token 和验证 token 的状态
 * @class Auth
 * @property {Function} get - 封装的GET请求方法
 * @property {Function} post - 封装的POST请求方法
 * @property {string} BaseUrl - GitHub API基础URL
 * @property {string} ApiUrl - GitHub API端点URL
 * @property {string} Client_ID - GitHub App 的 Client ID
 * @property {string} Client_Secret - GitHub App 的 Client Secret
 *
 */
export class Auth {
  private readonly post: GitHub['post']
  private readonly BaseUrl: string
  private readonly ApiUrl: string
  private readonly Client_ID: string
  private readonly Client_Secret: string
  private readonly userToken: string | null

  /**
   * 构造函数
   * @param options - GitHub实例配置对象
   */
  constructor (private readonly options: GitHub) {
    this.post = this.options.post.bind(this.options)
    this.ApiUrl = this.options.ApiUrl
    this.BaseUrl = this.options.BaseUrl
    this.Client_ID = this.options.Client_ID
    this.Client_Secret = this.options.Client_Secret
    this.userToken = this.options.userToken
  }

  /**
   * 生成Github App 授权链接
   * @param state_id - 随机生成的 state_id，用于验证授权请求的状态，可选，默认不使用
   * @returns 返回授权链接对象
   * @returns create_auth_link 授权链接，用于跳转 Github 授权页
   * @example
   * ```ts
   * const link = await auth.create_auth_link('state_id')
   * console.log(link) // https://github.com/login/oauth/authorize?client_id=<client_id>&state=<state_id>
   * ```
   */
  public create_auth_link (state_id?: string): Promise<string> {
    try {
      const url = new URL('/login/oauth/authorize', this.BaseUrl)
      url.search = new URLSearchParams({
        client_id: this.Client_ID,
        ...(state_id && { state: state_id })
      }).toString()

      return Promise.resolve(url.toString())
    } catch (error) {
      throw new Error(`生成授权链接失败: ${(error as Error).message}`)
    }
  }

  /**
   * 通过 code 获取 token
   * @param options - 获取 token 的参数
   * @param options.code - Github 返回的 code
   * @returns 返回 token
   * @example
   * ```ts
   * const token = await auth.get_token_by_code({ code: 'code' })
   * console.log(token) // 输出token对象
   * ```
   */
  public async get_token_by_code (options: AccessCodeType): Promise<ApiResponseType<GithubOauthTokenResponseType>> {
    if (!options.code) throw new Error(NotAccessCodeMsg)
    this.options.setRequestConfig(
      {
        url: this.BaseUrl
      })
    try {
      const req = await this.post('login/oauth/access_token', {
        client_id: this.Client_ID,
        client_secret: this.options.Client_Secret,
        code: options.code
      }, { Accept: 'application/json' })
      return req
    } catch (error) {
      throw new Error(`请求获取访问令牌失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取 token 的状态
   * @param options - 获取 token 的参数
   * @param options.access_token - Github 返回的 access_token
   * 上一步 `get_token_by_code` 生成的 token
   * @returns 返回 token 的状态
   * @returns info - 返回 token 的状态信息，'Token 有效' | 'Token 无效'
   * @example
   * ```ts
   * const status = await auth.check_token_status({ access_token: 'access_token' })
   * console.log(status) // 输出token状态对象
   */
  public async check_token_status (options?: AccessTokenType): Promise<ApiResponseType<GithubOauthCheckTokenResponseType>> {
    const access_token = options?.access_token ?? this.userToken
    if (!access_token) throw new Error(NotAccessTokenMsg)
    if (!access_token.startsWith('ghu_')) throw new Error(isNotAccessTokenMsg)
    this.options.setRequestConfig({
      url: this.ApiUrl,
      tokenType: 'Basic',
      token: `${this.Client_ID}:${this.Client_Secret}`
    })
    try {
      const req = await this.post(`/applications/${this.Client_ID}/token`, {
        access_token
      })
      const status = !((req.status === 'ok' && (req.statusCode === 404 || req.statusCode === 422)))
      return {
        ...req,
        data: {
          success: status,
          info: status ? AccessTokenSuccessMsg : isNotSuccessAccessTokenMsg
        }
      }
    } catch (error) {
      throw new Error(`请求获取访问令牌状态失败: ${(error as Error).message}`)
    }
  }

  /**
   * 通过 refresh_token 获取 token
   * @param options - 获取 token 的参数
   * @param options.refresh_token - Github 返回的 refresh_token
   * @returns 返回 token
   * @example
   * ```
   * const token = await auth.refresh_token({ refresh_token: 'refresh_token' })
   * console.log(token) // 输出token对象
   * ```
   */
  public async refresh_token (options: RefreshTokenType): Promise<ApiResponseType<GithubOauthRefreshTokenResponseType>> {
    if (!options.refresh_token) throw new Error(NotAccessCodeMsg)
    if (!options.refresh_token.startsWith('ghr_')) throw new Error(isNotRefreshTokenMsg)
    this.options.setRequestConfig(
      {
        url: this.BaseUrl
      })
    try {
      const req = await this.post('login/oauth/access_token', {
        client_id: this.Client_ID,
        client_secret: this.options.Client_Secret,
        grant_type: 'refresh_token',
        refresh_token: options.refresh_token
      }, { Accept: 'application/json' })

      const isSuccess = req.status === 'ok' && req.statusCode === 200 && !req.data.error

      let errorMsg = NotRefreshTokenSuccessMsg
      if (req.data.error === 'bad_refresh_token') {
        errorMsg = isNotRefreshTokenMsg
      } else if (req.data.error === 'unauthorized') {
        errorMsg = NotPerrmissionMsg
      }

      if (!isSuccess) {
        throw new Error(errorMsg)
      }

      return {
        ...req,
        data: {
          success: isSuccess,
          info: RefreshAccessTokenSuccessMsg,
          ...req.data
        }
      }
    } catch (error) {
      throw new Error(`请求刷新访问令牌失败: ${(error as Error).message}`)
    }
  }
}
