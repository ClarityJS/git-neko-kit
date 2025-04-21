import { NotParamMsg } from '@/common'
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

  public async get_org_info (options: OrganizationNameParamType): Promise<ApiResponseType<OrganizationInfoType>> {
    try {
      if (!options.org) {
        throw new Error(NotParamMsg)
      }
      this.setRequestConfig({
        token: this.userToken
      })
      const req = await this.get(`/orgs/${options.org}`)
      return req
    } catch (error) {
      throw new Error(`获取组织信息失败: ${(error as Error).message}`)
    }
  }
}
