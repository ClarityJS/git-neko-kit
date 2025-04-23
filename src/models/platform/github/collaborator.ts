import {
  NotParamMsg,
  parse_git_url
} from '@/common'
import { Base } from '@/models/platform/github/base'
import type {
  ApiResponseType,
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
