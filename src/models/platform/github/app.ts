import { Base } from '@/models/platform/github/base'
import type { ApiResponseType, GitHubAppInfoType } from '@/types'

/**
 * GitHub 应用管理类
 *
 * 提供对GitHub App的完整管理功能，包括：
 * - 获取应用基本信息
 * - 生成应用安装链接
 * - 生成应用配置链接
 *
 * @class App
 * @extends Base GitHub基础操作类
 *
 */
export class App extends Base {
  constructor (base: Base) {
    super(base)
    this.userToken = base.userToken
    this.ApiUrl = base.ApiUrl
    this.BaseUrl = base.BaseUrl
  }

  /**
   * 获取当前 Github App 信息
   * @returns 返回 Github App 信息
   */
  private async get_info (): Promise<ApiResponseType<GitHubAppInfoType>> {
    try {
      this.setRequestConfig(
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
   * 生成Github App 安装链接
   * @param state_id - 随机生成的 state_id，用于验证授权请求的状态，可选，默认不使用
   * @returns 返回安装链接对象
   * @returns state_id 随机生成的字符串，用于验证
   * @returns install_link 安装链接，用于跳转 Github 安装页
   */
  public async create_install_link (state_id?: string): Promise<string> {
    try {
      const url = new URL(`apps/${await this.get_app_name()}/installations/new`, this.BaseUrl)
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
    * @returns config_install_link 配置链接
    * @example
    * ```ts
    * const link = await app.create_config_install_link('state_id')
    * console.log(link) // https://github.com/apps/<app_name>/installations/new?state=<state_id></state_id>
    * ```
    */
  public async create_config_install_link (state_id?: string): Promise<string> {
    try {
      const url = new URL(`apps/${await this.get_app_name()}/installations/new`, this.BaseUrl)
      url.search = new URLSearchParams({
        ...(state_id && { state: state_id })
      }).toString()
      return url.toString()
    } catch (error) {
      throw new Error(`生成应用配置链接失败: ${(error as Error).message}`)
    }
  }

  /**
   * 快速获取当前 Github App 名称
   * @returns 返回 Github App 名称
   * @example
   * ```ts
   * console.log(app.get_app_name()) // 输出AppName
   * ```
   */
  public async get_app_name () {
    return (await this.get_info()).data.name
  }
}

/** 注册 App 模块 */
// Base.register('app', App)
