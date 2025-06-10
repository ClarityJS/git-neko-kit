import {
  isNotPerrmissionMsg,
  NotOrgMsg,
  NotOrgParamMsg,
  NotRepoOrPerrmissionMsg,
  NotUserNameParamMsg
} from '@/common'
import { GitHubClient } from '@/models/platform/github/base'
import type {
  AddMemberParamType,
  AddMemberResponseType,
  ApiResponseType,
  OrgInfoParamType,
  OrgInfoResponseType
} from '@/types'

/**
 * Github 组织操作类
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
   * Metadata - Read-only , 如果获取公开组织可无需此权限
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
    const { org } = options
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const res = await this.get(`/orgs/${org}`)
      if (res.statusCode === 404) {
        throw new Error(NotOrgMsg)
      }
      if (res.data) {
        const OrgData: OrgInfoResponseType = {
          id: res.data.id,
          login: res.data.login,
          name: res.data.name,
          avatar_url: res.data.avatar_url,
          description: res.data.description,
          html_url: res.data.html_url
        }
        res.data = OrgData
      }
      return res
    } catch (error) {
      throw new Error(`获取组织信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 添加组织成员
   * 权限:
   * Members - Read-And_Write
   * @param options 组织参数
   * - org 组织名称
   * - username 成员名称
   * @returns 成员信息
   * @example
   * ```ts
   * const orgInfo = await org.add_member({ org: 'org', username: 'username' })
   * console.log(orgInfo)
   * ```
   */
  public async add_member (
    options: AddMemberParamType
  ): Promise<ApiResponseType<AddMemberResponseType>> {
    if (!options.org) {
      throw new Error(NotOrgParamMsg)
    }
    if (!options.username) {
      throw new Error(NotUserNameParamMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      let userid, user_email
      const { org, username, role } = options
      if (username) {
        const user = await this.get_user()
        try {
          userid = await user.get_user_id()
        } catch {
          user_email = await user.get_user_email()
        }
      }
      const body: Record<string, string | number> = {}
      if (userid) {
        body.invitee_id = userid
      } else if (user_email) {
        body.email = user_email
      }
      if (role === 'admin') {
        body.role = 'admin'
      } else if (role === 'member') {
        body.role = 'direct_member'
      } else {
        body.role = 'direct_member'
      }
      const res = await this.post(`/orgs/${org}/invitations`, body)
      if (res.statusCode === 404) throw new Error(NotRepoOrPerrmissionMsg)
      if (res.statusCode === 422) {
        const msg = (res.data as unknown as { message: string }).message
        if (msg) {
          if (msg.includes('is not a valid permission')) throw new Error(isNotPerrmissionMsg)
        }
      }
      if (res.data) {
        const OrgData: AddMemberResponseType = {
          id: res.data.inviter.id,
          login: res.data.inviterlogin,
          name: res.data.inviter.name,
          role: role as 'admin' | 'member',
          html_url: res.data.html_url
        }
      }
      return res
    } catch (error) {
      throw new Error(`添加组织成员失败: ${(error as Error).message}`)
    }
  }
}
