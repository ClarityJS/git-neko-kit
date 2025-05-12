import { NotParamMsg, parse_git_url } from '@/common'
import { Base } from '@/models/platform/github/base'
import type {
  ReleaseListParamTypeType
} from '@/types'

/**
 * Release 提交操作类
 *
 * 提供对GitHub Release的CRUD操作，包括：
 * - 获取一个Release信息
 */
export class Release extends Base {
  constructor (base: Base) {
    super(base)
    this.userToken = base.userToken
    this.ApiUrl = base.ApiUrl
    this.BaseUrl = base.BaseUrl
  }

  public async get_release_list (options: ReleaseListParamTypeType) {
    try {
      let owner, repo, url
      if ('url' in options) {
        url = options.url
        const info = parse_git_url(url)
        owner = info?.owner
        repo = info?.repo
      } else if ('owner' in options && 'repo' in options) {
        owner = options.owner
        repo = options.repo
      } else {
        throw new Error(NotParamMsg)
      }
      const req = await this.get(`/repos/${owner}/${repo}/releases`)
      return req
    } catch (error) {
      throw new Error(`获取Release列表失败: ${(error as Error).message}`)
    }
  }

  public async get_release (options: ReleaseListParamTypeType) {

  }
}
