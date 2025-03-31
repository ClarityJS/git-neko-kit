import { GitHub } from '@/models/github/event/github'
import type { GitHubAppInfoType } from '@/types'

export class App {
  private get: GitHub['get']
  private post: GitHub['post']
  private BaseUrl: string
  private ApiUrl: string
  private jwtToken: string
  private APP_ID: string
  private Private_Key: string
  private Client_ID: string
  private Client_Secret: string
  constructor (private options: GitHub, jwtToken: string) {
    this.get = options.get.bind(options)
    this.post = options.post.bind(options)
    this.APP_ID = options.APP_ID
    this.Private_Key = options.Private_Key
    this.Client_ID = options.Client_ID
    this.Client_Secret = options.Client_Secret
    this.ApiUrl = options.ApiUrl
    this.BaseUrl = options.BaseUrl
    this.jwtToken = jwtToken
  }

  /**
   * 获取当前 Github App 信息
   * @returns 返回 Github App 信息
   */
  public async get_info (): Promise<GitHubAppInfoType> {
    this.options.setRequestConfig(
      {
        url: this.ApiUrl,
        token: this.jwtToken
      })
    const res = await this.get('/app')
    return res
  }

  public async get_name () {
    return (await this.get_info()).name
  }
}
