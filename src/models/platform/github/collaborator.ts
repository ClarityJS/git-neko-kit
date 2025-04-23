import {
  NotParamMsg,
  parse_git_url
} from '@/common'
import { Base } from '@/models/platform/github/base'
import type {
  ApiResponseType,
  CollaboratorListParamType,
  CollaboratorParamType,
  CollaboratorResponseType
} from '@/types'

/**
 * Base Collaborator操作类
 *
 * 提供对GitHub Collaborator的CRUD操作，包括：
 * - 添加协作者
 * - 删除协作者
 */
export class Collaborator extends Base {
  constructor (base: Base) {
    super(base)
    this.userToken = base.userToken
    this.ApiUrl = base.ApiUrl
    this.BaseUrl = base.BaseUrl
  }

  /**
   * 获取协作者列表
   * @param options 获取协作者列表对象
   * - owner: 仓库拥有者
   * - repo: 仓库名称
   * - url: 仓库地址
   * url和owner、repo参数传入其中的一种
   * - affiliation: 协作者类型，可选outside, direct, all，默认为all
   * - permission: 协作者权限，可选pull，triage, push, maintain, admin，默认为pull
   * - per_page: 每页数量，默认为30
   * - page: 页码，默认为1
   * @returns 返回获取协作者列表结果
   * @example
   * ```ts
   * const result = await collaborator.get_collaborator_list(options)
   * console.log(result)
   * ```
   */
  public get_collaborator_list (options: CollaboratorListParamType): Promise<ApiResponseType<Collaborator>> {
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      let owner, repo
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
      const res = this.get(`/repos/${owner}/${repo}/collaborators`, { ...options })
      return res
    } catch (error) {
      throw new Error(`获取仓库协作者列表失败: ${(error as Error).message}`)
    }
  }

  /**
   * 邀请协作者
   * @param options 邀请协作者对象
   * - owner: 仓库拥有者
   * - repo: 仓库名称
   * - url: 仓库地址
   * owner和repo或者url选择一个即可
   * - username: 要邀请协作者用户名
   * - permission: 协作者权限，可选pull，triage, push, maintain, admin，默认为pull
   * @returns 返回邀请协作者结果
   * @example
   * ```ts
   * const result = await collaborator.add_collaborator({
   *  owner: 'owner',
   *  repo: 'repo',
   *  username: 'username',
   *  permission: 'pull'
   * })
   * console.log(result)
   })
   */
  public async add_collaborator (
    options: CollaboratorParamType
  ): Promise<ApiResponseType<CollaboratorResponseType>> {
    let owner, repo, username
    try {
      this.setRequestConfig({
        token: this.userToken
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
      username = options?.username
      const req = await this.put(`/repos/${owner}/${repo}/collaborators/${username}`, {
        permission: options.permission ?? 'pull'
      })
      return req
    } catch (error) {
      throw new Error(`添加贡献者${username}失败: ${(error as Error).message}`)
    }
  }
}
