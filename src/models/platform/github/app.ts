import { capitalize } from 'lodash-es'

import {
  AppRepoMovedMsg,
  NotAccessTokenMsg,
  NotParamMsg,
  NotRepoMsg,
  parse_git_url
} from '@/common'
import { Base } from '@/models/platform/github/base'
import type {
  ApiResponseType,
  AppInfoParamType,
  AppInfoResponseType,
  AppRepoInfoResponseType,
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

  public async get_app_info (options: AppInfoParamType): Promise<ApiResponseType<AppInfoResponseType>> {
    const token = options.access_token ?? this.userToken
    if (!options.app_slug) throw new Error(NotParamMsg)
    if (!token) throw new Error(NotAccessTokenMsg)
    try {
      this.setRequestConfig(
        {
          token
        })
      const res = await this.get(`/apps/${options.app_slug}`)
      if (res.statusCode === 200) {
        res.data = {
          id: res.data.id,
          name: res.data.name,
          client_id: res.data.client_id,
          slug: res.data.slug,
          owner: {
            id: res.data.owner.id,
            login: res.data.owner.login,
            name: res.data.owner.name,
            email: res.data.owner.email,
            html_url: res.data.owner.html_url,
            avatar_url: res.data.owner.avatar_url,
            type: capitalize(res.data.owner.type.toLowerCase())
          },
          description: res.data.description,
          external_url: res.data.external_url,
          html_url: res.data.html_url,
          permissions: res.data.permissions,
          events: res.data.events,
          created_at: res.data.created_at,
          updated_at: res.data.updated_at
        }
      }
      return res
    } catch (error) {
      throw new Error(`获取应用信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取当前 Github App 信息
   * @returns 返回 Github App 信息
   * @example
   * ```ts
   * const app = base.get_app()
   * console.log(app.get_app_info_by_auth()) // 输出App信息
   * ```
   */
  private async get_app_info_by_auth (): Promise<ApiResponseType<AppInfoResponseType>> {
    try {
      this.setRequestConfig(
        {
          url: this.ApiUrl,
          token: this.jwtToken
        })
      const res = await this.get('/app') as ApiResponseType<AppInfoResponseType>
      if (res.statusCode === 200) {
        res.data = {
          id: res.data.id,
          name: res.data.name,
          client_id: res.data.client_id,
          slug: res.data.slug,
          owner: {
            id: res.data.owner.id,
            login: res.data.owner.login,
            name: res.data.owner.name,
            email: res.data.owner.email,
            html_url: res.data.owner.html_url,
            avatar_url: res.data.owner.avatar_url,
            type: capitalize(res.data.owner.type.toLowerCase())
          },
          description: res.data.description,
          external_url: res.data.external_url,
          html_url: res.data.html_url,
          permissions: res.data.permissions,
          events: res.data.events,
          created_at: res.data.created_at,
          updated_at: res.data.updated_at
        }
      }
      return res
    } catch (error) {
      throw new Error(`获取应用信息失败: ${(error as Error).message}`)
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
  ): Promise<ApiResponseType<AppRepoInfoResponseType>> {
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
      const res = await this.get(`/repos/${owner}/${repo}/installation`) as ApiResponseType<AppRepoInfoResponseType>
      switch (res.statusCode) {
        case 404:
          throw new Error(NotRepoMsg)
        case 301:
          throw new Error(AppRepoMovedMsg)
      }
      if (res.data) {
        res.data = {
          id: res.data.id,
          html_url: res.data.html_url,
          app_id: res.data.app_id,
          app_slug: res.data.app_slug,
          target_id: res.data.target_id,
          target_type: res.data.target_type,
          account: res.data.account
            ? {
                id: res.data.account.id,
                login: res.data.account.login,
                name: res.data.account.name,
                email: res.data.account.email,
                html_url: res.data.account.html_url,
                avatar_url: res.data.account.avatar_url,
                type: capitalize(res.data.account.type.toLowerCase())
              }
            : null,
          repository_selection: res.data.repository_selection,
          access_tokens_url: res.data.access_tokens_url,
          repositories_url: res.data.repositories_url,
          permissions: res.data.permissions,
          events: res.data.events,
          created_at: res.data.created_at,
          updated_at: res.data.updated_at
        }
      }
      return res
    } catch (error) {
      throw new Error(`获取存储库安装应用信息失败: ${(error as Error).message}`)
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
   * const app = base.get_app()
   * console.log(app.get_app_name()) // 输出AppName
   * ```
   */
  public async get_app_name (): Promise<string> {
    return (await this.get_app_info_by_auth()).data.name
  }
}
