import {
  NotParamMsg,
  NotPerrmissionMsg,
  parse_git_url
} from '@/common'
import { Base } from '@/models/platform/github/base'
import type {
  ApiResponseType,
  issueListParamType,
  IssueListResponseType
} from '@/types'

/**
 * GitHub Issue 处理类，提供WebHook相关操作功能
 *
 * 提供完整的GitHub Issue管理，包括：
 * - 获取Issue列表
 * - 获取Issue详情
 * - 创建Issue
 * - 更新Issue
 * - 删除Issue
 * - 评论Issue
 *
 * @class Issue
 * @extends Base
 */
export class Issue extends Base {
  constructor (base: Base) {
    super(base)
    this.userToken = base.userToken
    this.ApiUrl = base.ApiUrl
    this.BaseUrl = base.BaseUrl
  }

  public async get_issue_list (
    options: issueListParamType
  ): Promise<ApiResponseType<IssueListResponseType>> {
    let owner, repo, url
    try {
      this.setRequestConfig(
        {
          token: this.userToken
        })
      /* 解析仓库地址 */
      if ('url' in options) {
        url = options?.url?.trim()
        const info = parse_git_url(url, this.BaseUrl)
        owner = info?.owner
        repo = info?.repo
      } else if ('owner' in options && 'repo' in options) {
        owner = options?.owner
        repo = options?.repo
      } else {
        throw new Error(NotParamMsg)
      }
      const req = await this.get(`/repos/${owner}/${repo}/issues`)
      if (req.statusCode === 401) {
        throw new Error(NotPerrmissionMsg)
      }
      return req
    } catch (error) {
      throw new Error(`获取仓库${owner}/${repo}的Issue列表失败: ${(error as Error).message}`)
    }
  }
}
