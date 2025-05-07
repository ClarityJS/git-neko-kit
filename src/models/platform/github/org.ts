import { NotOrgMsg, NotOrgParamMsg } from '@/common'
import { Base } from '@/models/platform/github/base'
import {
  ApiResponseType,
  OrganizationInfoType,
  OrganizationNameParamType
} from '@/types'

/**
 * Base 组织操作类
 *
 * 提供对GitHub组织的CRUD操作，包括：
 * - 获取组织信息
 */
export class Org extends Base {
  constructor (base: Base) {
    super(base)
    this.userToken = base.userToken
    this.ApiUrl = base.ApiUrl
    this.BaseUrl = base.BaseUrl
  }

  /**
   * 获取组织信息
   * @param options 组织参数
   * - org 组织名称
   * @returns 组织信息
   */
  public async get_org_info (options: OrganizationNameParamType): Promise<ApiResponseType<OrganizationInfoType>> {
    if (!options.org) {
      throw new Error(NotOrgParamMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const res = await this.get(`/orgs/${options.org}`)
      if (res.statusCode === 404) {
        throw new Error(NotOrgMsg)
      }
      return res
    } catch (error) {
      throw new Error(`获取组织信息失败: ${(error as Error).message}`)
    }
  }
}
