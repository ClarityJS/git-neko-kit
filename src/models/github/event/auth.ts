import { GitHub } from '@/models/github/event/github'
import type { GithubOauthRefreshTokenResponseType, GithubOauthTokenResponseType } from '@/types'

export class Auth {
  private get: GitHub['get']
  private post: GitHub['post']
  private BaseUrl: string
  private ApiUrl: string
  private Client_ID: string
  private Client_Secret: string
  private jwtToken: string
  constructor (private options: GitHub, jwtToken: string) {
    this.get = options.get.bind(options)
    this.post = options.post.bind(options)
    this.ApiUrl = options.ApiUrl
    this.BaseUrl = options.BaseUrl
    this.Client_ID = options.Client_ID
    this.Client_Secret = options.Client_Secret
    this.jwtToken = jwtToken
  }

  /**
   * 生成Github App 授权链接
   * @param state_id 随机生成的 state_id，用于验证授权请求的状态，可选，默认不使用
   * @returns 返回授权链接对象
   * @returns auth_link 授权链接，用于跳转 Github 授权页
   */
  public create_auth_link (state_id?: string): string {
    const url = new URL('/login/oauth/authorize', this.BaseUrl)
    url.search = new URLSearchParams({
      client_id: this.Client_ID,
      ...(state_id && { state: state_id })
    }).toString()

    return url.toString()
  }

  /**
   * 通过 code 获取 token
   * @param code Github 返回的 code
   * @returns 返回 token
   */
  public async get_token_by_code (code: string): Promise<GithubOauthTokenResponseType> {
    this.options.setRequestConfig(
      {
        url: this.BaseUrl
      })
    try {
      const req = await this.post('login/oauth/access_token', {
        client_id: this.Client_ID,
        client_secret: this.options.Client_Secret,
        code
      }, { Accept: 'application/json' })
      if (req.error) {
        throw new Error('获取 token 失败', req.error)
      }
      return req
    } catch (error) {
      throw new Error(`Token 获取请求失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 通过 refresh_token 获取 token
   * @param refresh_token Github 返回的 refresh_token
   * @returns 返回 token
   */
  public async refresh_token (refresh_token: string): Promise<GithubOauthRefreshTokenResponseType> {
    if (!refresh_token.startsWith('ghr_')) throw new Error('refresh_token 格式错误')
    this.options.setRequestConfig(
      {
        url: this.BaseUrl
      })
    try {
      const req = await this.post('login/oauth/access_token', {
        client_id: this.Client_ID,
        client_secret: this.options.Client_Secret,
        grant_type: 'refresh_token',
        refresh_token
      }, { Accept: 'application/json' })

      if (req.error) {
        throw new Error('获取 token 失败', req.error)
      }
      return req
    } catch (error) {
      throw new Error(`Token 刷新请求失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 获取 token 的状态
   * @param token token Github Apps 生成的用户的token，也就是 `get_token_by_code` 生成的 token
   * @returns 返回 token 的状态
   * @returns status token 的状态码，200 为有效，404,422均为无效
   */
  public async check_token_status (token: string) {
    if (!token.startsWith('ghu_')) throw new Error('token 格式错误')
    this.options.setRequestConfig(
      {
        url: this.ApiUrl,
        tokenType: 'Basic',
        token: `${this.Client_ID}:${this.Client_Secret}`,
        status: true
      })
    try {
      let status, msg
      const req = await this.post(`/applications/${this.Client_ID}/token`, {
        access_token: token
      })
      status = req.statusCode
      msg = status === 200 ? 'token 有效' : 'token 无效'
      return { status, msg }
    } catch (error) {
      throw new Error(`Token 状态检查请求失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }
}
