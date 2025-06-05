import { capitalize } from 'lodash-es'

import {
  MissingBaseMsg,
  MissingHeadMsg,
  MissingissueMsg,
  MissingissueOrTitleMsg,
  MissingRepoOwnerOrNameMsg,
  MissingTitleMsg,
  NotPerrmissionMsg,
  NotPrNumberMsg
} from '@/common'
import { GitHubClient } from '@/models/platform/github/base'
import {
  ApiResponseType,
  CreatePullRequestParamType,
  CreatePullRequestResponseType,
  IssueLabelType,
  PrUser,
  PullRequestInfoParamType,
  PullRequestInfoResponseType,
  PullRequestListParamType,
  PullRequestListResponseType,
  UpdatePullRequestParamType,
  UpdatePullRequestResponseType
} from '@/types'

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
   * const pull_request = get_pull_request() // 获取pull_request实例
   * const res = await pull_request.get_pull_request_info({ owner: 'owner', repo:'repo', pr_number:1 })
   * console.log(res) // { data: PullRequestInfoResponseType }
   * ```
   */
  public async get_pull_request_info (
    options: PullRequestInfoParamType
  ): Promise<ApiResponseType<PullRequestInfoResponseType>> {
    if (!(options.owner || options.repo)) throw new Error(MissingRepoOwnerOrNameMsg)
    if (!options.pr_number) throw new Error(NotPrNumberMsg)
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const res = await this.get(`/repos/${options.owner}/${options.repo}/pulls/${options.pr_number}`)
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
            ? res.data.assignees.map((assignee: Record<string, any>): PrUser => ({
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

  /**
   * 获取pull_request列表
   * 权限:
   * - Pull requests: Read-Only
   * @param options 请求参数列表
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - pr_number Pr编号
   * - state 状态
   * - base 基准分支
   * - sort 排序
   * - direction 排序方向
   * - per_page 每页数量
   * - page 页码
   * @returns 包含pull_request信息的响应对象
   * @example
   * ```ts
   * const pull_request = get_pull_request() // 获取pull_request实例
   * const res = await pull_request.get_get_pull_request_list({ owner: 'owner', repo:'repo' })
   * console.log(res) // { data: PullRequestListResponseType }
   * ```
   */
  public async get_get_pull_request_list (
    options: PullRequestListParamType
  ): Promise<ApiResponseType<PullRequestListResponseType>> {
    if (!(options.owner || options.repo)) throw new Error(MissingRepoOwnerOrNameMsg)
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, ...queryOptions } = options
      const params: Record<string, string> = {}
      if (queryOptions.state) params.state = queryOptions.state
      if (queryOptions.base) params.base = queryOptions.base
      if (queryOptions.sort) params.sort = queryOptions.sort
      if (queryOptions.direction && !queryOptions.sort) params.direction = queryOptions.direction
      if (queryOptions.per_page) params.per_page = queryOptions.per_page.toString()
      if (queryOptions.page) params.page = queryOptions.page.toString()
      const res = await this.get(`/repos/${owner}/${repo}/pulls`, params)
      if (res.data) {
        const PrData: PullRequestListResponseType = res.data.map((pr: Record<string, any>): PullRequestInfoResponseType => ({
          id: pr.id,
          html_url: pr.html_url,
          number: pr.number,
          state: pr.state,
          locked: pr.locked,
          title: pr.title,
          body: pr.body,
          draft: pr.draft,
          created_at: pr.created_at,
          updated_at: pr.updated_at,
          closed_at: pr.closed_at,
          merged_at: pr.merged_at,
          user: {
            id: pr.user.id,
            name: pr.user.name,
            login: pr.user.login,
            html_url: pr.user.html_url,
            email: pr.user.email,
            avatar_url: pr.user.avatar_url,
            type: capitalize(pr.user.type.toLowerCase())
          },
          base: {
            label: pr.base.label,
            ref: pr.base.ref,
            sha: pr.base.sha,
            user: {
              id: pr.base.user.id,
              name: pr.base.user.name,
              login: pr.base.user.login,
              html_url: pr.base.user.html_url,
              email: pr.base.user.email,
              avatar_url: pr.base.user.avatar_url,
              type: capitalize(pr.base.user.type.toLowerCase())
            },
            repo: {
              id: pr.base.repo.id,
              owner: pr.base.repo.owner,
              name: pr.base.repo.name,
              full_name: pr.base.repo.full_name
            }
          },
          head: {
            label: pr.head.label,
            ref: pr.head.ref,
            sha: pr.head.sha,
            user: {
              id: pr.head.user.id,
              name: pr.head.user.name,
              login: pr.head.user.login,
              html_url: pr.head.user.html_url,
              email: pr.head.user.email,
              avatar_url: pr.head.user.avatar_url,
              type: capitalize(pr.head.user.type.toLowerCase())
            },
            repo: {
              id: pr.head.repo.id,
              owner: pr.head.repo.owner,
              name: pr.head.repo.name,
              full_name: pr.head.repo.full_name
            }
          },
          assignee: pr.assignee
            ? {
                id: pr.assignee.id,
                name: pr.assignee.name,
                login: pr.assignee.login,
                html_url: pr.assignee.html_url,
                email: pr.assignee.email,
                avatar_url: pr.assignee.avatar_url,
                type: capitalize(pr.assignee.type.toLowerCase())
              }
            : null,
          assignees: pr.assignees && pr.assignees.length > 0
            ? pr.assignees.map((assignee: Record<string, any>) => ({
              id: assignee.id,
              name: assignee.name,
              login: assignee.login,
              html_url: assignee.html_url,
              email: assignee.email,
              avatar_url: assignee.avatar_url
            }))
            : null,
          milestone: pr.milestone
            ? {
                id: pr.milestone.id,
                url: pr.milestone.url,
                number: pr.milestone.number,
                state: pr.milestone.state,
                title: pr.milestone.title,
                description: pr.milestone.description,
                open_issues: pr.milestone.open_issues,
                closed_issues: pr.milestone.closed_issues,
                created_at: pr.milestone.created_at,
                updated_at: pr.milestone.updated_at,
                closed_at: pr.milestone.closed_at,
                due_on: pr.milestone.due_on
              }
            : null,
          labels: pr.labels && pr.labels.length > 0
            ? pr.labels.map((label: Record<string, any>) => ({
              id: label.id,
              name: label.name,
              color: label.color
            }))
            : null,
          commits: pr.commits,
          additions: pr.additions,
          deletions: pr.deletions,
          changed_files: pr.changed_files
        })
        )
        res.data = PrData
      }
      return res
    } catch (error) {
      throw new Error(`获取拉取请求列表失败： ${(error as Error).message}`)
    }
  }

  /**
   * 创建一个拉取请求
   * 权限:
   * - Pull requests: Read-And-Write
   * @param options 请求参数列表
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - title 标题
   * - body 内容
   * - issue 关联的议题
   * title和body与issue参数传入其中一种，当传入issue参数时，title和body参数将自动填充
   * - head 拉取请求源分支
   * - head_repo 拉取请求源仓库, 如果两个存储库都由同一组织拥有，则跨存储库拉取请求需要此字段
   * - base 拉取请求目标分支
   * - draft 是否为草稿
   * @returns 包含pull_request信息的响应对象
   * @example
   * ```ts
   * const pull_request = get_pull_request() // 获取pull_request实例
   * const res = await pull_request.create_pull_requestt({ owner: 'owner', repo:'repo', issue: 1, head: 'head', base: 'base' })
   * console.log(res) // { data: CreatePullRequestResponseType }
   */
  public async create_pull_request (
    options: CreatePullRequestParamType
  ): Promise<ApiResponseType<CreatePullRequestResponseType>> {
    if (!(options.owner || options.repo)) throw new Error(MissingRepoOwnerOrNameMsg)
    if (!options.head) throw new Error(MissingHeadMsg)
    if (!options.base) throw new Error(MissingBaseMsg)
    if (!('issue' in options) && !('title' in options)) {
      throw new Error(MissingissueOrTitleMsg)
    }
    try {
      const body: Record<string, string | number | boolean> = {}
      if ('issue' in options) {
        if (!options.issue) throw new Error(MissingissueMsg)
        body.issue = options.issue
      } else if ('title' in options) {
        if (!options.title) throw new Error(MissingTitleMsg)
        body.title = options.title
        if (options.body) body.body = options.body
      }
      if (options.head) body.head = options.head
      if (options.head_repo) body.head_repo = options.head_repo
      if (options.base) body.base = options.base
      if (options.draft) body.draft = options.draft
      const { owner, repo } = options
      const res = await this.post(`/repos/${owner}/${repo}/pulls`,
        body
      )
      if (res.statusCode === 403) throw new Error(NotPerrmissionMsg)
      if (res.data) {
        const PrData: CreatePullRequestResponseType = {
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
            ? res.data.assignees.map((assignee: Record<string, any>): PrUser => ({
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
      throw new Error(`创建拉取请求失败: ${(error as Error).message}`)
    }
  }

  /**
   * 更新一个拉取请求
   * 权限:
   * - Pull requests: Read-And-Write
   * @param options 请求参数列表
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - title 标题
   * - body 内容
   * - state 状态
   * @returns 包含pull_request信息的响应对象
   * @example
   * ```ts
   * const pull_request = get_pull_request() // 获取pull_request实例
   * const res = await pull_request.create_pull_requestt({ owner: 'owner', repo:'repo', pr_number:1, state:'open' })
   * console.log(res) // { data: CreatePullRequestResponseType }
   */
  public async update_pull_request (
    options: UpdatePullRequestParamType
  ): Promise<ApiResponseType<UpdatePullRequestResponseType>> {
    if (!(options.owner || options.repo)) throw new Error(MissingRepoOwnerOrNameMsg)
    if (!options.pr_number) throw new Error(NotPrNumberMsg)
    try {
      const body: Record<string, string> = {}
      if (options.title) body.title = options.title
      if (options.body) body.body = options.body
      if (options.state) body.state = options.state
      const { owner, repo, pr_number } = options
      const res = await this.patch(`/repos/${owner}/${repo}/pulls/${pr_number}`, null, body)
      if (res.statusCode === 403) throw new Error(NotPerrmissionMsg)
      if (res.data) {
        const PrData: UpdatePullRequestResponseType = {
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
            ? res.data.assignees.map((assignee: Record<string, any>): PrUser => ({
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
      throw new Error(`更新拉取请求失败: ${(error as Error).message}`)
    }
  }
}
