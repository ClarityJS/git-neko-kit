import { capitalize } from 'lodash-es'

import {
  format_date,
  MissingAccessTokenMsg,
  MissingAppClientMsg,
  MissingAppSlugMsg,
  MissingRepoOwnerOrNameMsg,
  RepoMovedMsg,
  RepoNotFoundMsg
} from '@/common'
import { get_base_url } from '@/models/base'
import { GitHubClient } from '@/models/platform/github/client'
import type {
  ApiResponseType,
  AppInfoParamType,
  AppInfoResponseType,
  AppRepoInfoResponseType,
  RepoBaseParamType,
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
export class App extends GitHubClient {
  constructor (base: GitHubClient) {
    super(base)
    this.userToken = base.userToken
    this.api_url = base.api_url
    this.base_url = get_base_url(this.type, { proxyType: 'original' })
  }

  /**
   * 获取应用基本信息
   * 权限：
   * - `none` 无
   * @param options - 应用标识符
   * @returns 应用基本信息
   * @example
   * ```ts
   * const app = base.get_app()
   * console.log(app.get_app_info({ app_slug: 'loli' }))
   * -> app的信息
   * ```
   */
  public async get_app_info (
    options: AppInfoParamType
  ): Promise<ApiResponseType<AppInfoResponseType>> {
    if (!options.app_slug) throw new Error(MissingAppSlugMsg)
    if (!this.userToken) throw new Error(MissingAccessTokenMsg)
    try {
      this.setRequestConfig(
        {
          token: this.userToken ?? this.jwtToken
        })
      const res = await this.get(`/apps/${options.app_slug}`)
      if (res.statusCode === 200) {
        const AppData: AppInfoResponseType = {
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
        res.data = AppData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 获取应用信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取当前 Github App 信息
   * 权限：
   * - `none` 此节点仅App Client可用
   * @returns 返回 Github App 信息
   * @example
   * ```ts
   * const app = base.get_app()
   * console.log(app.get_app_info_by_auth())
   * -> app的信息
   * ```
   */
  private async get_app_info_by_auth ()
    : Promise<ApiResponseType<AppInfoResponseType>> {
    if (!this.is_app_client) throw new Error(MissingAppClientMsg)
    try {
      this.setRequestConfig(
        {
          url: this.api_url,
          token: this.jwtToken
        })
      const res = await this.get('/app')
      if (res.statusCode === 200) {
        const AppData: AppInfoResponseType = {
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
        res.data = AppData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 获取应用信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取仓库的应用安装信息
   * 权限：
   * - `none` 此节点仅App Client可用
   * @param options - 仓库安装应用参数对象
   * - owner 拥有者
   * - repo 仓库名
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
    if (!this.is_app_client) throw new Error(MissingAppClientMsg)
    if (!options.owner || !options.repo) throw new Error(MissingRepoOwnerOrNameMsg)
    try {
      this.setRequestConfig(
        {
          token: this.jwtToken
        })
      const { owner, repo } = options
      const res = await this.get(`/repos/${owner}/${repo}/installation`)
      switch (res.statusCode) {
        case 404:
          throw new Error(RepoNotFoundMsg)
        case 301:
          throw new Error(RepoMovedMsg)
      }
      if (res.data) {
        const AppData: AppRepoInfoResponseType = {
          id: res.data.id,
          html_url: res.data.html_url,
          app_id: res.data.app_id,
          app_slug: res.data.app_slug,
          target_id: res.data.target_id,
          target_type: res.data.target_type,
          account: {
            id: res.data.account.id,
            login: res.data.account.login,
            name: res.data.account.name,
            email: res.data.account.email,
            html_url: res.data.account.html_url,
            avatar_url: res.data.account.avatar_url,
            type: capitalize(res.data.account.type.toLowerCase())
          },
          repository_selection: res.data.repository_selection,
          access_tokens_url: res.data.access_tokens_url,
          repositories_url: res.data.repositories_url,
          permissions: res.data.permissions,
          events: res.data.events,
          created_at: this.format ? await format_date(res.data.created_at) : res.data.created_at,
          updated_at: this.format ? await format_date(res.data.updated_at) : res.data.updated_at
        }
        res.data = AppData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 获取存储库安装应用信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 生成Github App 安装链接
   * @param state_id - 随机生成的 state_id，用于验证授权请求的状态，可选，默认不使用
   * @returns install_link 安装链接，用于跳转 Github 安装页
   * @example
   * ```ts
   * const link = await app.create_install_link('state_id')
   * -> https://github.com/apps/<app_name>/installations/new?state=<state_id>
   * ```
   */
  public async create_install_link (state_id?: string): Promise<string> {
    try {
      if (!this.is_app_client) throw new Error(MissingAppClientMsg)
      const url = new URL(`apps/${await this.get_app_name()}/installations/new`, this.base_url)
      url.search = new URLSearchParams({
        ...(state_id && { state: state_id })
      }).toString()
      return url.toString()
    } catch (error) {
      throw new Error(`[GitHub] 生成应用安装链接失败: ${(error as Error).message}`)
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
    * -> // https://github.com/apps/<app_name>/installations/new?state=<state_id></state_id>
    * ```
    */
  public async create_config_install_link (state_id?: string): Promise<string> {
    try {
      if (!this.is_app_client) throw new Error(MissingAppClientMsg)
      const url = new URL(`apps/${await this.get_app_name()}/installations/new`, this.base_url)
      url.search = new URLSearchParams({
        ...(state_id && { state: state_id })
      }).toString()
      return url.toString()
    } catch (error) {
      throw new Error(`[GitHub] 生成应用配置链接失败: ${(error as Error).message}`)
    }
  }

  /**
   * 快速获取当前 Github App 名称
   * @returns 返回 Github App 名称
   * @example
   * ```ts
   * console.log(app.get_app_name())
   * ->  输出AppName
   * ```
   */
  public async get_app_name (): Promise<string> {
    return (await this.get_app_info_by_auth()).data.name
  }

  /**
   * 快速判断指定仓库是否安装了当前App 应用
   * @param options - 仓库安装应用参数对象
   * - owner 拥有者
   * - repo 仓库名
   * @returns 是否安装
   * @example
   * ```ts
   * // 当前App已安装在此仓库
   * const isInstalled = await app.is_app_inttalled_in_repo({ owner: 'owner', repo: 'repo' })
   * -> true
   * // 当前App未安装此仓库
   * const isInstalled = await app.is_app_inttalled_in_repo({ owner: 'owner', repo: 'repo' })
   * -> false
   */
  public async is_app_installed_in_repo (
    options: RepoBaseParamType
  ): Promise<boolean> {
    try {
      const res = await this.get_app_installation_by_repo({
        owner: options.owner,
        repo: options.repo
      })
      return !!res
    } catch {
      return false
    }
  }
}
