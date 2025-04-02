import { GitHub } from '@/models/github/event/github'
import type { GitHubAppInfoType } from '@/types'

/**
 * 应用类，用于获取应用信息
 * @class App
 * @property {Function} get - 封装的GET请求方法
 * @property {string} ApiUrl - GitHub API端点URL
 * @property {string} jwtToken - 认证令牌
 *
 */
export class App {
  private get: GitHub['get']
  private ApiUrl: string
  private jwtToken: string
  constructor (private options: GitHub, jwtToken: string) {
    this.get = options.get.bind(options)
    this.ApiUrl = options.ApiUrl
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
