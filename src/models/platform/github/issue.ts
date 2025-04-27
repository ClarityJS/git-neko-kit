import {
  NotIssueMsg,
  NotIssueTitleMsg,
  NotParamMsg,
  NotPerrmissionMsg,
  parse_git_url
} from '@/common'
import { Base } from '@/models/platform/github/base'
import type {
  ApiResponseType,
  CreateIssueResponseType,
  IssueInfoParamType,
  IssueInfoResponseType,
  issueListParamType,
  IssueListResponseType,
  SendIssueParamType
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

  /**
   * 获取Issue详情
   * @param options 请求参数列表
   * - url 仓库URL地址
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - issue_number Issue编号
   * url参数和owner、repo参数传入其中的一种
   */
  public async get_issue_info (
    options: IssueInfoParamType
  ): Promise<ApiResponseType<IssueInfoResponseType>> {
    let owner, repo
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      if ('url' in options) {
        const url = options?.url?.trim()
        const info = parse_git_url(url)
        owner = info?.owner
        repo = info?.repo
      } else if ('owner' in options && 'repo' in options) {
        owner = options?.owner
        repo = options?.repo
      } else {
        throw new Error(NotParamMsg)
      }
      const req = await this.get(`/repos/${owner}/${repo}/issues/${options.issue_number}`)
      switch (req.statusCode) {
        case 404:
          throw new Error(NotIssueMsg)
        case 301:
          throw new Error(NotIssueMsg)
      }
      return req
    } catch (error) {
      throw new Error(`获取Issue详情失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取仓库的Issue列表
   * @param options 请求参数列表
   * - url 仓库URL地址
   * - owner 仓库拥有者
   * - repo 仓库名称
   * url参数和owner、repo参数传入其中的一种
   * - milestones 里程碑ID列表
   * - state  Issue状态，可选 'open' | 'closed' | 'all', 默认为'all'
   * - labels 标签名称列表
   * - assignee  指派人用户名
   * - type  问题类型
   * - creator  创建者用户名
   * - mentioned  提及的用户名
   * - sort  排序方式，可选 'created' | 'updated' | 'comments', 默认为'created'
   * - direction  排序方向，可选 'asc' | 'desc', 默认为'desc'
   * - since  筛选此时间之后的问题
   * - per_page  每页数量，可选，默认为30
   * -page  页码，可选，默认为1
   * @returns 包含Issue列表的响应对象
   * @example
   * ```ts
   * const issue = get_issuc() // 获取issue实例
   * const res = await issue.get_issue_list({ owner: 'owner', repo: 'repo' })
   * console.log(res) // { data: IssueListResponseType[] }
   * ```
   */
  public async get_issue_list (
    options: issueListParamType
  ): Promise<ApiResponseType<IssueListResponseType>> {
    let owner, repo
    try {
      this.setRequestConfig(
        {
          token: this.userToken
        })
      /* 解析仓库地址 */
      if ('url' in options) {
        const url = options?.url?.trim()
        const info = parse_git_url(url)
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

  /**
   * 创建一个Issue
   * @param options 发送Issue的参数对象
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - title 标题
   * - body 内容
   * - assignee 指派人
   * - milestone 里程碑
   * - labels 标签列表
   * - type 问题类型
   * @returns 包含Issue信息的响应对象
   * @example
   * ```ts
   * const issue = get_issuc() // 获取issue实例
   * const res = await issue.create_issue({ owner: 'owner', repo:'repo', title:'title', body:'body' })
   * console.log(res) // { data: CreateIssueResponseType }
   * ```
   */
  public async create_issue (
    options: SendIssueParamType
  ): Promise<ApiResponseType<CreateIssueResponseType>> {
    try {
      if (!options.owner || !options.repo) {
        throw new Error(NotParamMsg)
      }
      if (!options.title) {
        throw new Error(NotIssueTitleMsg)
      }
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, ...IssueOptions } = options
      const req = await this.post(`/repos/${owner}/${repo}/issues`, IssueOptions)
      return req
    } catch (error) {
      throw new Error(`创建Issue失败: ${(error as Error).message}`)
    }
  }
}
