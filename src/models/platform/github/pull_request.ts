import { GitHubClient } from '@/models/platform/github/base'
import { ApiResponseType, PullRequestInfoParamType, PullRequestInfoResponseType } from '@/types'

/**
 * GitHub pull_request类
 *
 * 提供完整的GitHub pull_request管理，包括
 * - 获取pull_request列表
 * - 获取pull_request详情
 *
 * @class Auth
 * @extends GitHubClient GitHub基础操作类
 */
export class Pull_request extends GitHubClient {
  constructor (base: GitHubClient) {
    super(base)
    this.userToken = base.userToken
    this.ApiUrl = base.ApiUrl
    this.BaseUrl = base.BaseUrl
  }

  public async get_pull_request_info (
    options: PullRequestInfoParamType
  ): Promise<ApiResponseType<PullRequestInfoResponseType>> {
    try {
      const res = await this.get(`/repos/${options.owner}/${options.repo}/pulls/${options.pull_number}`)
      return res
    } catch (error) {
      throw new Error(`获取拉取请求信息失败： ${(error as Error).message}`)
    }
  }
}
