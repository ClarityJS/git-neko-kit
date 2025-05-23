import { NotParamMsg, parse_git_url } from '@/common'
import { Base } from '@/models/platform/github/base'
import type {
  ApiResponseType,
  GitHubAppInfoType,
  GitHubAppRepoInfoResponseType,
  RepoInfoParamType
} from '@/types'

/**
 * GitHub 应用管理类
 *
 * 提供对GitHub App的完整管理功能，包括：
 * - 获取应用基本信息
 * - 生成应用安装链接
 * - 生成应用配置链接
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
   * 获取仓库的应用安装信息
   * @param options - 仓库安装应用参数对象
   * - owner 拥有者
   * - repo 仓库名
   * - url 仓库地址
   * ownwe和repo与url只能二选一
   * @returns 返回应用安装信息
   * @example
   * ```ts
   * const app = base.get_app()
   * console.log(app.get_app_installation_by_repo({owner: 'owner', repo: 'repo'})) // 输出仓库的应用信息
   * ```
   */

  public async get_app_installation_by_repo (
    options: RepoInfoParamType
  ): Promise<ApiResponseType<GitHubAppRepoInfoResponseType>> {
    let owner, repo
    try {
      this.setRequestConfig(
        {
          token: this.jwtToken
        })
      if ('url' in options) {
        const url = options.url.trim()
        const info = parse_git_url(url)
        owner = info?.owner
        repo = info?.repo
      } else if ('owner' in options && 'repo' in options) {
        owner = options?.owner
        repo = options?.repo
      } else {
        throw new Error(NotParamMsg)
      }
      const res = await this.get(`/repos/${owner}/${repo}/installation`)
      return res
    } catch (error) {
      throw new Error(`获取存储库安装应用信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 快速获取当前 Github App 名称
   * @returns 返回 Github App 名称
   * @example
   * ```ts
   * const app = base.get_app()
   * console.log(app.get_app_name()) // 输出AppName
   * ```
   */
  public async get_app_name (): Promise<string> {
    return (await this.get_info()).data.name
  }
}
