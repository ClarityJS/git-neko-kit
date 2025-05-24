import { NotOrgMsg, NotOrgParamMsg } from '@/common'
import { GitHubClient } from '@/models/platform/github/base'
import type {
  ApiResponseType,
  OrgInfoParamType,
  OrgInfoResponseType
} from '@/types'

/**
 * Base 组织操作类
 *
 * 提供对GitHub组织的CRUD操作，包括：
 * - 获取组织信息
 */
export class Org extends GitHubClient {
  constructor (base: GitHubClient) {
    super(base)
    this.userToken = base.userToken
    this.ApiUrl = base.ApiUrl
    this.BaseUrl = base.BaseUrl
  }

  /**
   * 获取组织信息
   * 权限:
   * - Plan: Read-only ，若需要获取组织计划则需要该权限，并且是组织所有者
   * @param options 组织参数
   * - org 组织名称
   * @returns 组织信息
   * @example
   * ```ts
   * const orgInfo = await org.get_org_info({ org: 'org' })
   * console.log(orgInfo)
   * ```
   */
  public async get_org_info (
    options: OrgInfoParamType
  ): Promise<ApiResponseType<OrgInfoResponseType>> {
    if (!options.org) {
      throw new Error(NotOrgParamMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const res = await this.get(`/orgs/${options.org}`) as ApiResponseType<OrgInfoResponseType>
      if (res.statusCode === 404) {
        throw new Error(NotOrgMsg)
      }
      if (res.data) {
        res.data = {
          id: res.data.id,
          login: res.data.login,
          name: res.data.name,
          avatar_url: res.data.avatar_url,
          description: res.data.description,
          html_url: res.data.html_url
        }
      }
      return res
    } catch (error) {
      throw new Error(`获取组织${options.org}信息失败: ${(error as Error).message}`)
    }
  }
}
