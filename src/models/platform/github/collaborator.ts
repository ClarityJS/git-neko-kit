import { Base } from '@/models/platform/github/base'
import type {
  ApiResponseType,
  ContributorParamType,
  ContributorResponseType
} from '@/types'

/**
 * Base Collaborator操作类
 *
 * 提供对GitHub Collaborator的CRUD操作，包括：
 * - 检查webhook签名是否正确
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
   * - username: 要邀请协作者用户名
   * - permission: 协作者权限，可选pull，triage, push, maintain, admin
   * @returns 返回邀请协作者结果
   */
  public async add_contributor (
    options: ContributorParamType
  ): Promise<ApiResponseType<ContributorResponseType>> {
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const req = await this.put(`/repos/${options.owner}/${options.repo}/contributors/${options.username}`, {
        permission: options.permission ?? 'pull'
      })
      return req
    } catch (error) {
      throw new Error(`添加贡献者失败: ${(error as Error).message}`)
    }
  }
}
