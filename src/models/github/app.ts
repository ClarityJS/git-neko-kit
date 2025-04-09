import { GitHub } from '@/models/github/github'
import type { ApiResponseType, GitHubAppInfoType } from '@/types'

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
  constructor (private options: GitHub) {
    this.get = options.get.bind(options)
    this.ApiUrl = options.ApiUrl
    this.jwtToken = options.jwtToken
  }

  /**
   * 获取当前 Github App 信息
   * @returns 返回 Github App 信息
   */
  public async get_info (): Promise<ApiResponseType<GitHubAppInfoType>> {
    try {
      this.options.setRequestConfig(
        {
          url: this.ApiUrl,
          token: this.jwtToken
        })
      return await this.get('/app')
    } catch (error) {
      throw new Error(`获取应用信息失败: ${(error as Error).message}`)
    }
  }

  public async get_name () {
    try {
      return (await this.get_info()).data.name
    } catch (error) {
      throw new Error(`获取应用名称失败: ${(error as Error).message}`)
    }
  }
}
