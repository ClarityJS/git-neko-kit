import { GitHub } from '@/models/github/event/github'

export class Auth {
  private get: GitHub['get']
  private post: GitHub['post']
  private BaseUrl: string
  private ApiUrl: string
  private state_id: string
  private Client_ID: string
  private jwtToken: string
  constructor (private options: GitHub, jwtToken: string) {
    this.get = options.get.bind(options)
    this.post = options.post.bind(options)
    this.ApiUrl = options.ApiUrl
    this.BaseUrl = options.BaseUrl
    this.Client_ID = options.Client_ID
    this.state_id = options.getStateId()
    this.jwtToken = jwtToken
  }

  /**
   * 生成Github App 授权链接
   * @returns 返回授权链接对象
   * @returns state_id 随机生成的字符串，用于验证
   * @returns auth_link 授权链接，用于跳转 Github 授权页
   */
  public create_auth_link (): { state_id: string, auth_link: string } {
    const state_id = this.state_id
    return {
      state_id,
      auth_link: `${this.BaseUrl}/login/oauth/authorize?client_id=${this.Client_ID}&state=${state_id}`
    }
  }

  /**
   * 通过 code 获取 token
   * @param code Github 返回的 code
   * @returns 返回 token
   */
  public async get_token_by_code (code: string) {
    this.options.setRequestConfig(
      {
        url: this.BaseUrl
      })

    const req = await this.post('login/oauth/access_token', {
      client_id: this.Client_ID,
      client_secret: this.options.Client_Secret,
      code
    })
    return req
  }

  /**
   * 通过 refresh_token 获取 token
   * @param refresh_token Github 返回的 refresh_token
   * @returns 返回 token
   */
  public async refresh_token (refresh_token: string) {
    this.options.setRequestConfig(
      {
        url: this.BaseUrl
      })

    const req = await this.post('login/oauth/access_token', {
      client_id: this.Client_ID,
      client_secret: this.options.Client_Secret,
      grant_type: 'refresh_token',
      refresh_token
    })

    return req
  }

  /**
   * 获取 token 的状态
   * 暂时没写
   * @param token token Github Apps 生成的用户的token，也就是 `get_token_by_code` 生成的 token
   * @returns 返回 token 的状态
   */
  public async check_token_status (token: string) {

  }
}
