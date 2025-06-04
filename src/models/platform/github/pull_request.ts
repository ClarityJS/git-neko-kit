import { capitalize } from 'lodash-es'

import { MissingRepoOwnerOrNameMsg } from '@/common'
import { GitHubClient } from '@/models/platform/github/base'
import { ApiResponseType, IssueLabelType, PrUser, PullRequestInfoParamType, PullRequestInfoResponseType } from '@/types'

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

  /**
   * 获取pull_request详情
   * 权限:
   * - Pull requests: Read-And-Wirte
   * - Contents: Read-And-Wirte
   * @param options 请求参数列表
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - pr_number Pr编号
   * @returns 包含pull_request信息的响应对象
   * @example
   * ```ts
   * const issue = get_issue() // 获取issue实例
   * const res = await issue.get_issue_info({ owner: 'owner', repo:'repo', issue_number:1 })
   * console.log(res) // { data: IssueInfoResponseType }
   * ```
   */
  public async get_pull_request_info (
    options: PullRequestInfoParamType
  ): Promise<ApiResponseType<PullRequestInfoResponseType>> {
    if (!(options.owner || options.repo)) throw new Error(MissingRepoOwnerOrNameMsg)
    if (!options.pull_number) throw new Error('缺少pull_number参数')
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const res = await this.get(`/repos/${options.owner}/${options.repo}/pulls/${options.pull_number}`)
      if (res.data) {
        const PrData: PullRequestInfoResponseType = {
          id: res.data.id,
          html_url: res.data.html_url,
          number: res.data.number,
          state: res.data.state,
          locked: res.data.locked,
          title: res.data.title,
          body: res.data.body,
          draft: res.data.draft,
          created_at: res.data.created_at,
          merged_at: res.data.merged_at,
          updated_at: res.data.updated_at,
          closed_at: res.data.closed_at,
          user: {
            id: res.data.user.id,
            name: res.data.user.name,
            login: res.data.user.login,
            html_url: res.data.user.html_url,
            email: res.data.user.email,
            avatar_url: res.data.user.avatar_url,
            type: capitalize(res.data.type.toLowerCase())
          },
          base: {
            label: res.data.base.label,
            ref: res.data.base.ref,
            sha: res.data.base.sha,
            user: {
              id: res.data.base.user.id,
              name: res.data.base.user.name,
              login: res.data.base.user.login,
              html_url: res.data.base.user.html_url,
              email: res.data.base.user.email,
              avatar_url: res.data.base.user.avatar_url,
              type: capitalize(res.data.base.type.toLowerCase())
            },
            repo: {
              id: res.data.base.repo.id,
              owner: res.data.base.repo.owner,
              name: res.data.base.repo.name,
              full_name: res.data.base.repo.full_name
            }
          },
          head: {
            label: res.data.head.label,
            ref: res.data.head.ref,
            sha: res.data.head.sha,
            user: {
              id: res.data.head.user.id,
              name: res.data.head.user.name,
              login: res.data.head.user.login,
              html_url: res.data.head.user.html_url,
              email: res.data.head.user.email,
              avatar_url: res.data.head.user.avatar_url,
              type: capitalize(res.data.head.type.toLowerCase())
            },
            repo: {
              id: res.data.head.repo.id,
              owner: res.data.head.repo.owner,
              name: res.data.head.repo.name,
              full_name: res.data.head.repo.full_name
            }
          },
          assignee: res.data.assignee
            ? {
                id: res.data.assignee.id,
                name: res.data.assignee.name,
                login: res.data.assignee.login,
                html_url: res.data.assignee.html_url,
                email: res.data.assignee.email,
                avatar_url: res.data.assignee.avatar_url,
                type: capitalize(res.data.assignee.type.toLowerCase())
              }
            : null,
          assignees: res.data.assignees && res.data.assignees.length > 0
            ? res.data.assignees.map((assignee: PrUser) => ({
              id: assignee.id,
              name: assignee.name,
              login: assignee.login,
              html_url: assignee.html_url,
              email: assignee.email,
              avatar_url: assignee.avatar_url,
              type: capitalize(assignee.type.toLowerCase())
            }))
            : null,
          milestone: res.data.milestone
            ? {
                id: res.data.milestone.id,
                url: res.data.milestone.url,
                number: res.data.milestone.number,
                state: res.data.milestone.state,
                title: res.data.milestone.title,
                description: res.data.milestone.description,
                open_issues: res.data.milestone.open_issues,
                closed_issues: res.data.milestone.closed_issues,
                created_at: res.data.milestone.created_at,
                updated_at: res.data.milestone.updated_at,
                due_on: res.data.milestone.due_on,
                closed_at: res.data.milestone.closed_at
              }
            : null,
          labels: res.data.labels && res.data.labels.length > 0
            ? res.data.labels.map((label: IssueLabelType) => ({
              id: label.id,
              name: label.name,
              color: label.color
            }))
            : null,
          commits: res.data.commits,
          additions: res.data.additions,
          deletions: res.data.deletions,
          changed_files: res.data.changed_files
        }
        res.data = PrData
      }
      return res
    } catch (error) {
      throw new Error(`获取拉取请求信息失败： ${(error as Error).message}`)
    }
  }
}
