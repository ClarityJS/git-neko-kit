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
  private BaseUrl: string
  constructor (private options: GitHub) {
    this.get = options.get.bind(options)
    this.BaseUrl = options.BaseUrl
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

  /**
   * 获取当前 Github App 名称
   * @returns 返回 Github App 名称
   */
  public async get_name () {
    try {
      return (await this.get_info()).data.name
    } catch (error) {
      throw new Error(`获取应用名称失败: ${(error as Error).message}`)
    }
  }

  /**
   * 生成Github App 安装链接
   * @param state_id - 随机生成的 state_id，用于验证授权请求的状态，可选，默认不使用
   * @returns 返回安装链接对象
   * @returns state_id 随机生成的字符串，用于验证
   * @returns install_link 安装链接，用于跳转 Github 安装页
   */
  public async create_install_link (state_id?: string): Promise<string> {
    try {
      const url = new URL(`apps/${await this.get_name()}/installations/new`, this.BaseUrl)
      url.search = new URLSearchParams({
        ...(state_id && { state: state_id })
      }).toString()
      return url.toString()
    } catch (error) {
      throw new Error(`生成应用安装链接失败: ${(error as Error).message}`)
    }
  }

  /**
    * 生成Github Apps 配置链接
    * @param state_id - 传入的 state_id, 随机字符串
    * @returns 返回配置链接对象
    * @returns state_id 随机生成的字符串，用于验证
    * @returns  config_install_link 配置链接
    */
  public async create_config_install_link (state_id?: string): Promise<string> {
    try {
      const url = new URL(`apps/${await this.get_name()}/installations/new`, this.BaseUrl)
      url.search = new URLSearchParams({
        ...(state_id && { state: state_id })
      }).toString()
      return url.toString()
    } catch (error) {
      throw new Error(`生成应用配置链接失败: ${(error as Error).message}`)
    }
  }
}
