import { capitalize } from 'lodash-es'

import {
  FailedtoLockIssueMsg,
  FailedtoRemoveIssueMsg,
  FailedtoUnlockIssueMsg,
  formatDate,
  IssueCommentNotFoundMsg,
  IssueCommentRemoveSuccessMsg,
  IssueMovedMsg,
  IssueNotFoundMsg,
  IssueUnlockSuccessMsg,
  MissingIssueCommentBodyMsg,
  MissingIssueCommentNumberMsg,
  MissingIssueNumberMsg,
  MissingIssueTitleMsg,
  MissingRepoOwnerOrNameMsg,
  MissingSubIssueNumberMsg,
  PermissionDeniedMsg,
  RepoNotFoundMsg
} from '@/common'
import { get_base_url } from '@/models/base'
import { GitHubClient } from '@/models/platform/github/client'
import type {
  AddSubIssueParamType,
  AddSubIssueResponseType,
  ApiResponseType,
  CloseIssueParamType,
  CloseIssueResponseType,
  CreateIssueResponseType,
  CreteIssueCommentParamType,
  CreteIssueCommentResponseType,
  CreteIssueParamType,
  IssueCommentInfoParamType,
  IssueCommentInfoResponseType,
  IssueCommentListParamType,
  IssueCommentListResponseType,
  IssueInfoParamType,
  IssueInfoResponseType,
  IssueLabelType,
  IssueListResponseType,
  LockIssueParamType,
  LockIssueResponseType,
  OpenIssueParamType,
  OpenIssueResponseType,
  RemoveCollaboratorResponseType,
  RemoveIssueCommentParamType,
  RemoveSubIssueParamType,
  RemoveSubIssueResponseType,
  RepoCommentListParamType,
  RepoCommentListResponseType,
  RepoIssueListParamType,
  ReprioritizeSubIssueParamType,
  ReprioritizeSubIssueResponseType,
  SubIssueListParamType,
  SubIssueListResponseType,
  UnLockIssueParamType,
  UnLockIssueResponseType,
  UpdateIssueCommentParamType,
  UpdateIssueCommentResponseType,
  UpdateIssueParamType,
  UpdateIssueResponseType
} from '@/types'

/**
 * GitHub Issue 处理类，提供WebHook相关操作功能
 *
 * 提供完整的GitHub Issue管理，包括：
 * - 获取Issue列表
 * - 获取Issue详情
 * - 创建/更新/关闭/打开/锁定/解锁Issue
 * - 获取仓库评论列表
 * - 获取/创建/更新/删除Issue评论
 * - 管理子Issue
 *
 * @remarks 每个拉取请求都是一个议题，但并非每个议题都是拉取请求。
 */
export class Issue extends GitHubClient {
  constructor (base: GitHubClient) {
    super(base)
    this.userToken = base.userToken
    this.ApiUrl = base.ApiUrl
    this.BaseUrl = base.BaseUrl
  }

  /**
   * 获取Issue详情
   * 权限:
   * - Issues: Read-only
   * @param options 请求参数列表
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - issue_number Issue编号
   * @returns 包含Issue信息的响应对象
   * @example
   * ```ts
   * const issue = get_issue() // 获取issue实例
   * const res = await issue.get_issue_info({ owner: 'owner', repo:'repo', issue_number:1 })
   * console.log(res) // { data: IssueInfoResponseType }
   * ```
   */
  public async get_issue_info (
    options: IssueInfoParamType
  ): Promise<ApiResponseType<IssueInfoResponseType>> {
    if (!options.owner || !options.repo) throw new Error(MissingRepoOwnerOrNameMsg)
    if (!options.issue_number) throw new Error(MissingIssueNumberMsg)
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, issue_number } = options
      const res = await this.get(
        `/repos/${owner}/${repo}/issues/${Number(issue_number)}`
      )
      switch (res.statusCode) {
        case 404:
          throw new Error(IssueNotFoundMsg)
        case 301:
          throw new Error(IssueMovedMsg)
      }
      if (res.data) {
        const IssueData: IssueInfoResponseType = {
          id: res.data.id,
          html_url: res.data.html_url,
          number: res.data.number,
          comments: res.data.comments,
          state: res.data.state,
          state_reason: res.data.state_reason,
          title: res.data.title,
          body: res.data.body,
          user: {
            id: res.data.user.id,
            login: res.data.user.login,
            name: res.data.user.name,
            email: res.data.user.email,
            html_url: res.data.user.html_url,
            avatar_url: res.data.user.avatar_url,
            type: capitalize(res.data.user.type.toLowerCase())
          },
          labels: res.data.labels
            ? res.data.labels.map((label: IssueLabelType) => ({
              id: label.id,
              name: label.name,
              color: label.color
            }))
            : null,
          assignee: res.data.assignee
            ? {
                id: res.data.assignee.id,
                login: res.data.assignee.login,
                name: res.data.assignee.name,
                email: res.data.assignee.email,
                html_url: res.data.assignee.html_url,
                avatar_url: res.data.assignee.avatar_url,
                type: capitalize(res.data.assignee.type.toLowerCase())
              }
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
                closed_at: res.data.milestone.closed_at,
                due_on: res.data.milestone.due_on
              }
            : null,
          closed_at: this.format ? await formatDate(res.data.closed_at) : res.data.closed_at,
          created_at: this.format ? await formatDate(res.data.created_at) : res.data.created_at,
          updated_at: this.format ? await formatDate(res.data.updated_at) : res.data.updated_at
        }
        res.data = IssueData
      }
      return res
    } catch (error) {
      throw new Error(`获取Issue详情失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取仓库的Issue列表
   * 权限:
   * - Issues:Read-only
   * @param options 请求参数列表
   * - owner 仓库拥有者
   * - repo 仓库名称
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
   * - page  页码，可选，默认为1
   * @returns 包含Issue列表的响应对象
   * @example
   * ```ts
   * const issue = get_issue() // 获取issue实例
   * const res = await issue.get_issue_list({ owner: 'owner', repo: 'repo' })
   * console.log(res) // { data: IssueListResponseType[] }
   * ```
   */
  public async get_issues_list (
    options: RepoIssueListParamType
  ): Promise<ApiResponseType<IssueListResponseType>> {
    if (!options.owner || !options.repo) throw new Error(MissingRepoOwnerOrNameMsg)
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, ...queryOptions } = options
      const params: Record<string, string> = {}
      if (queryOptions.milestone) {
        params.milestone = queryOptions.milestone.toString()
      }
      if (queryOptions.state) params.state = queryOptions.state
      if (queryOptions.assignee) params.assignee = queryOptions.assignee
      if (queryOptions.creator) params.creator = queryOptions.creator
      if (queryOptions.labels) params.labels = queryOptions.labels
      if (queryOptions.sort) params.sort = queryOptions.sort
      if (queryOptions.direction) params.direction = queryOptions.direction
      if (queryOptions.since) params.since = queryOptions.since
      if (queryOptions.per_page) {
        params.per_page = queryOptions.per_page.toString()
      }
      if (queryOptions.page) params.page = queryOptions.page.toString()

      const apiPath = `/repos/${owner}/${repo}/issues`
      const res = await this.get(apiPath, params)
      if (res.statusCode === 401) {
        throw new Error(PermissionDeniedMsg)
      }
      if (res.data) {
        const IssueData: IssueListResponseType = res.data.map(
          (issue: Record<string, any>): IssueInfoResponseType => ({
            id: issue.id,
            html_url: issue.html_url,
            number: issue.number,
            comments: issue.comments,
            state: issue.state,
            state_reason: issue.state_reason,
            title: issue.title,
            body: issue.body,
            user: {
              id: issue.user.id,
              login: issue.user.login,
              name: issue.user.name,
              email: issue.user.email,
              html_url: issue.user.html_url,
              avatar_url: issue.user.avatar_url,
              type: capitalize(issue.user.type.toLowerCase())
            },
            labels: issue.labels
              ? issue.labels.map((label: IssueLabelType) => ({
                id: label.id,
                name: label.name,
                color: label.color
              }))
              : null,
            assignee: issue.assignee
              ? {
                  id: issue.assignee.id,
                  login: issue.assignee.login,
                  name: issue.assignee.name,
                  email: issue.assignee.email,
                  html_url: issue.assignee.html_url,
                  avatar_url: issue.assignee.avatar_url,
                  type: capitalize(issue.assignee.type.toLowerCase())
                }
              : null,
            milestone: issue.milestone
              ? {
                  id: issue.milestone.id,
                  url: issue.milestone.url,
                  number: issue.milestone.number,
                  state: issue.milestone.state,
                  title: issue.milestone.title,
                  description: issue.milestone.description,
                  open_issues: issue.milestone.open_issues,
                  closed_issues: issue.milestone.closed_issues,
                  created_at: issue.milestone.created_at,
                  updated_at: issue.milestone.updated_at,
                  closed_at: issue.milestone.closed_at,
                  due_on: issue.milestone.due_on
                }
              : null,
            closed_at: issue.closed_at,
            created_at: issue.created_at,
            updated_at: issue.updated_at
          })
        )
        res.data = IssueData
      }
      return res
    } catch (error) {
      throw new Error(`获取仓库的Issue列表失败: ${(error as Error).message}`)
    }
  }

  /**
   * 创建一个Issue
   * 权限:
   * - Issues: Write
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
   * const issue = get_issue() // 获取issue实例
   * const res = await issue.create_issue({ owner: 'owner', repo:'repo', title:'title', body:'body' })
   * console.log(res) // { data: CreateIssueResponseType }
   * ```
   */
  public async create_issue (
    options: CreteIssueParamType
  ): Promise<ApiResponseType<CreateIssueResponseType>> {
    if (!options.owner || !options.repo) {
      throw new Error(MissingRepoOwnerOrNameMsg)
    }
    if (!options.title) {
      throw new Error(MissingIssueTitleMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, ...IssueOptions } = options
      const issueParams = {
        ...IssueOptions,
        ...(IssueOptions.labels && {
          labels: Array.isArray(IssueOptions.labels)
            ? IssueOptions.labels
            : [IssueOptions.labels]
        }),
        ...(IssueOptions.assignees && {
          assignees: Array.isArray(IssueOptions.assignees)
            ? IssueOptions.assignees
            : [IssueOptions.assignees]
        })
      }
      const res = await this.post(
        `/repos/${owner}/${repo}/issues`,
        issueParams
      )
      switch (res.statusCode) {
        case 403:
          throw new Error(PermissionDeniedMsg)
        case 301:
          throw new Error(RepoNotFoundMsg)
      }
      if (res.data) {
        if (res.data) {
          const IssueData: CreateIssueResponseType = {
            id: res.data.id,
            html_url: res.data.html_url,
            number: res.data.number,
            comments: res.data.comments,
            state: res.data.state,
            state_reason: res.data.state_reason,
            title: res.data.title,
            body: res.data.body,
            user: {
              id: res.data.user.id,
              login: res.data.user.login,
              name: res.data.user.name,
              email: res.data.user.email,
              html_url: res.data.user.html_url,
              avatar_url: res.data.user.avatar_url,
              type: capitalize(res.data.user.type.toLowerCase())
            },
            labels: res.data.labels
              ? res.data.labels.map((label: IssueLabelType) => ({
                id: label.id,
                name: label.name,
                color: label.color
              }))
              : null,
            assignee: res.data.assignee
              ? {
                  id: res.data.assignee.id,
                  login: res.data.assignee.login,
                  name: res.data.assignee.name,
                  email: res.data.assignee.email,
                  html_url: res.data.assignee.html_url,
                  avatar_url: res.data.assignee.avatar_url,
                  type: capitalize(res.data.assignee.type.toLowerCase())
                }
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
                  closed_at: res.data.milestone.closed_at,
                  due_on: res.data.milestone.due_on
                }
              : null,
            closed_at: res.data.closed_at,
            created_at: res.data.created_at,
            updated_at: res.data.updated_at
          }
          res.data = IssueData
        }
      }
      return res
    } catch (error) {
      throw new Error(`创建Issue失败: ${(error as Error).message}`)
    }
  }

  /**
   * 更新一个Issue
   * 权限:
   * - Issues: Write
   * - Pull requests: Write
   * 需以上权限之一
   * @param options 更新Issue的参数对象
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - issue_number Issue编号
   * - title 标题
   * - body 内容
   * - assignee 指派人
   * - milestone 里程碑
   * - labels 标签列表
   * - type 问题类型
   * @returns 包含Issue信息的响应对象
   * @example
   * ```ts
   * const issue = get_issue() // 获取issue实例
   * const res = await issue.update_issue({ owner: 'owner', repo:'repo', issue_number:1, title:'title', body:'body' })
   * console.log(res) // { data: CreateIssueResponseType }
   * ```
   */
  public async update_issue (
    options: UpdateIssueParamType
  ): Promise<ApiResponseType<UpdateIssueResponseType>> {
    if (!options.owner || !options.repo) {
      throw new Error(MissingRepoOwnerOrNameMsg)
    }
    if (!options.issue_number) {
      throw new Error(MissingIssueNumberMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, issue_number, ...updateData } = options
      const issueParams = {
        ...updateData,
        ...(updateData.labels && {
          labels: Array.isArray(updateData.labels)
            ? updateData.labels
            : [updateData.labels]
        }),
        ...(updateData.assignees && {
          assignees: Array.isArray(updateData.assignees)
            ? updateData.assignees
            : [updateData.assignees]
        })
      }
      const res = await this.patch(
        `/repos/${owner}/${repo}/issues/${Number(issue_number)}`,
        null,
        issueParams
      )
      switch (res.statusCode) {
        case 404:
          throw new Error(IssueNotFoundMsg)
        case 403:
          throw new Error(PermissionDeniedMsg)
        case 301:
          throw new Error(RepoNotFoundMsg)
      }
      if (res.data) {
        if (res.data) {
          const IssueData: UpdateIssueResponseType = {
            id: res.data.id,
            html_url: res.data.html_url,
            number: res.data.number,
            comments: res.data.comments,
            state: res.data.state,
            state_reason: res.data.state_reason,
            title: res.data.title,
            body: res.data.body,
            user: {
              id: res.data.user.id,
              login: res.data.user.login,
              name: res.data.user.name,
              email: res.data.user.email,
              html_url: res.data.user.html_url,
              avatar_url: res.data.user.avatar_url,
              type: capitalize(res.data.user.type.toLowerCase())
            },
            labels: res.data.labels
              ? res.data.labels.map((label: IssueLabelType) => ({
                id: label.id,
                name: label.name,
                color: label.color
              }))
              : null,
            assignee: res.data.assignee
              ? {
                  id: res.data.assignee.id,
                  login: res.data.assignee.login,
                  name: res.data.assignee.name,
                  email: res.data.assignee.email,
                  html_url: res.data.assignee.html_url,
                  avatar_url: res.data.assignee.avatar_url,
                  type: capitalize(res.data.assignee.type.toLowerCase())
                }
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
                  closed_at: res.data.milestone.closed_at,
                  due_on: res.data.milestone.due_on
                }
              : null,
            closed_at: res.data.closed_at,
            created_at: res.data.created_at,
            updated_at: res.data.updated_at
          }
          res.data = IssueData
        }
      }
      return res
    } catch (error) {
      throw new Error(`更新Issue失败: ${(error as Error).message}`)
    }
  }

  /**
   * 重新打开一个Issue
   * 权限:
   * - Issues: Write
   * - Pull requests: Write
   * 需以上权限之一
   * @param options 打开Issue的参数对象
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - issue_number Issue编号
   * @returns 包含Issue信息的响应对象
   * @example
   * ```ts
   * const issue = get_issue() // 获取issue实例
   * const res = await issue.open_issue({ owner: 'owner', repo:'repo', issue_number:1 })
   * console.log(res) // { data: CreateIssueResponseType }
   * ```
   */
  public async open_issue (
    options: OpenIssueParamType
  ): Promise<ApiResponseType<OpenIssueResponseType>> {
    if (!options.owner || !options.repo) {
      throw new Error(MissingRepoOwnerOrNameMsg)
    }
    if (!options.issue_number) {
      throw new Error(MissingIssueNumberMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, issue_number } = options
      const res = await this.patch(
        `/repos/${owner}/${repo}/issues/${issue_number}`,
        null,
        {
          state: 'open'
        }
      )
      switch (res.statusCode) {
        case 404:
          throw new Error(IssueNotFoundMsg)
        case 403:
          throw new Error(PermissionDeniedMsg)
        case 301:
          throw new Error(RepoNotFoundMsg)
      }
      if (res.data) {
        if (res.data) {
          const IssueData: OpenIssueResponseType = {
            id: res.data.id,
            html_url: res.data.html_url,
            number: res.data.number,
            comments: res.data.comments,
            state: res.data.state,
            state_reason: res.data.state_reason,
            title: res.data.title,
            body: res.data.body,
            user: {
              id: res.data.user.id,
              login: res.data.user.login,
              name: res.data.user.name,
              email: res.data.user.email,
              html_url: res.data.user.html_url,
              avatar_url: res.data.user.avatar_url,
              type: capitalize(res.data.user.type.toLowerCase())
            },
            labels: res.data.labels
              ? res.data.labels.map((label: IssueLabelType) => ({
                id: label.id,
                name: label.name,
                color: label.color
              }))
              : null,
            assignee: res.data.assignee
              ? {
                  id: res.data.assignee.id,
                  login: res.data.assignee.login,
                  name: res.data.assignee.name,
                  email: res.data.assignee.email,
                  html_url: res.data.assignee.html_url,
                  avatar_url: res.data.assignee.avatar_url,
                  type: capitalize(res.data.assignee.type.toLowerCase())
                }
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
                  closed_at: res.data.milestone.closed_at,
                  due_on: res.data.milestone.due_on
                }
              : null,
            closed_at: res.data.closed_at,
            created_at: res.data.created_at,
            updated_at: res.data.updated_at
          }
          res.data = IssueData
        }
      }
      return res
    } catch (error) {
      throw new Error(`打开Issue失败: ${(error as Error).message}`)
    }
  }

  /**
   * 重新打开一个议题
   * 权限:
   * - Issues: Write
   * - Pull requests: Write
   * 需以上权限之一
   * @deprecated 请使用 open_issue 方法代替
   */
  public async reopen_issue (
    options: OpenIssueParamType
  ): Promise<ApiResponseType<OpenIssueResponseType>> {
    return this.open_issue(options)
  }

  /**
   * 关闭一个Issue
   * 权限:
   * - Issues: Write
   * - Pull requests: Write
   * 需以上权限之一
   * @param options 关闭Issue的参数对象
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - issue_number Issue编号
   * - state_reason 关闭原因
   * @returns 包含Issue信息的响应对象
   * @example
   * ```ts
   * const issue = get_issue() // 获取issue实例
   * const res = await issue.close_issue({ owner: 'owner', repo:'repo', issue_number:1, state_reason:'completed' })
   * console.log(res) // { data: CreateIssueResponseType }
   * ```
   */
  public async close_issue (
    options: CloseIssueParamType
  ): Promise<ApiResponseType<CloseIssueResponseType>> {
    if (!options.owner || !options.repo) {
      throw new Error(MissingRepoOwnerOrNameMsg)
    }
    if (!options.issue_number) {
      throw new Error(MissingIssueNumberMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, issue_number } = options
      const res = (await this.patch(
        `/repos/${owner}/${repo}/issues/${issue_number}`,
        null,
        {
          state: 'closed'
        }
      ))
      switch (res.statusCode) {
        case 404:
          throw new Error(IssueNotFoundMsg)
        case 403:
          throw new Error(PermissionDeniedMsg)
        case 301:
          throw new Error(RepoNotFoundMsg)
      }
      if (res.data) {
        if (res.data) {
          const IssueData: CloseIssueResponseType = {
            id: res.data.id,
            html_url: res.data.html_url,
            number: res.data.number,
            comments: res.data.comments,
            state: res.data.state,
            state_reason: res.data.state_reason,
            title: res.data.title,
            body: res.data.body,
            user: {
              id: res.data.user.id,
              login: res.data.user.login,
              name: res.data.user.name,
              email: res.data.user.email,
              html_url: res.data.user.html_url,
              avatar_url: res.data.user.avatar_url,
              type: capitalize(res.data.user.type.toLowerCase())
            },
            labels: res.data.labels
              ? res.data.labels.map((label: IssueLabelType) => ({
                id: label.id,
                name: label.name,
                color: label.color
              }))
              : null,
            assignee: res.data.assignee
              ? {
                  id: res.data.assignee.id,
                  login: res.data.assignee.login,
                  name: res.data.assignee.name,
                  email: res.data.assignee.email,
                  html_url: res.data.assignee.html_url,
                  avatar_url: res.data.assignee.avatar_url,
                  type: capitalize(res.data.assignee.type.toLowerCase())
                }
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
                  closed_at: res.data.milestone.closed_at,
                  due_on: res.data.milestone.due_on
                }
              : null,
            closed_at: res.data.closed_at,
            created_at: res.data.created_at,
            updated_at: res.data.updated_at
          }
          res.data = IssueData
        }
      }
      return res
    } catch (error) {
      throw new Error(`关闭Issue失败: ${(error as Error).message}`)
    }
  }

  /**
   * 锁定一个Issue
   * 仅GitHub平台可用
   * 权限:
   * - Issues: Write
   * - Pull requests: Write
   * 需以上权限之一
   * @param options 锁定Issue的参数对象
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - issue_number Issue编号
   * - lock_reason 锁定原因 可选 'off-topic' | 'too heated' | 'resolved' | 'spam'
   * @returns 锁定状态信息
   * @example
   * ```ts
   * const issue = get_issue() // 获取issue实例
   * const res = await issue.lock_issue({ owner: 'owner', repo:'repo', issue_number:1, lock_reason:'off-topic' })
   * console.log(res) // { data: LockIssueResponseType }
   * ```
   */
  public async lock_issue (
    options: LockIssueParamType
  ): Promise<ApiResponseType<LockIssueResponseType>> {
    if (!options.owner || !options.repo) {
      throw new Error(MissingRepoOwnerOrNameMsg)
    }
    if (!options.issue_number) {
      throw new Error(MissingIssueNumberMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, issue_number, lock_reason } = options
      const res = await this.put(
        `/repos/${owner}/${repo}/issues/${Number(issue_number)}`,
        {
          locked: true,
          lock_reason
        }
      )
      switch (res.statusCode) {
        case 404:
          throw new Error(IssueNotFoundMsg)
        case 403:
          throw new Error(PermissionDeniedMsg)
        case 301:
          throw new Error(RepoNotFoundMsg)
      }
      let issueData
      if (res.statusCode === 204) {
        issueData = {
          info: IssueUnlockSuccessMsg
        }
      } else {
        issueData = {
          info: FailedtoLockIssueMsg
        }
      }
      res.data = issueData
      return res
    } catch (error) {
      throw new Error(
        `锁定Issue${options.issue_number}失败: ${(error as Error).message}`
      )
    }
  }

  /**
   * 解锁一个Issue
   * 仅GitHub平台可用
   * 权限:
   * - Issues: Write
   * - Pull requests: Write
   * 需以上权限之一
   * @param options 解锁Issue的参数对象
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - issue_number Issue编号
   * @returns 解锁状态信息
   * @example
   * ```ts
   * const issue = get_issue() // 获取issue实例
   * const res = await issue.unlock_issue({ owner: 'owner', repo:'repo', issue_number})
   * console.log(res) // { data: UnLockIssueResponseType }
   * ```
   */
  public async unlock_issue (
    options: UnLockIssueParamType
  ): Promise<ApiResponseType<UnLockIssueResponseType>> {
    if (!options.owner || !options.repo) {
      throw new Error(MissingRepoOwnerOrNameMsg)
    }
    if (!options.issue_number) {
      throw new Error(MissingIssueNumberMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, issue_number } = options
      const res = await this.delete(
        `/repos/${owner}/${repo}/issues/${issue_number}/lock`
      )
      switch (res.statusCode) {
        case 404:
          throw new Error(IssueNotFoundMsg)
        case 403:
          throw new Error(PermissionDeniedMsg)
        case 301:
          throw new Error(RepoNotFoundMsg)
      }
      let issueData
      if (res.statusCode === 204) {
        issueData = {
          info: IssueUnlockSuccessMsg
        }
      } else {
        issueData = {
          info: FailedtoUnlockIssueMsg
        }
      }
      res.data = issueData
      return res
    } catch (error) {
      throw new Error(`解锁Issue失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取一个仓库下Issue的评论列表
   * 权限:
   * - Issues: Read-only
   * - Pull requests: Read-only
   * 需以上权限之一
   * @param options 获取Issue评论列表的参数对象
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - sort 排序方式 可选 'created' | 'updated'
   * - direction 排序方向 可选 'asc' | 'desc'，当sort不存在时此参数会被忽略
   * - since 评论时间
   * - per_page 每页评论数量
   * - page 页码
   * @returns 包含Issue评论列表的响应对象
   * @example
   * ```ts
   * const issue = get_issue() // 获取issue实例
   * const res = await issue.get_issue_comments_list({ owner: 'owner', repo:'repo', issue_number:1 })
   * console.log(res) // { data: IssueCommentListResponseType[] }
   * ```
   */
  public async get_repo_comments_list (
    options: RepoCommentListParamType
  ): Promise<ApiResponseType<RepoCommentListResponseType>> {
    if (!options.owner || !options.repo) {
      throw new Error(MissingRepoOwnerOrNameMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, ...queryOptions } = options

      const params: Record<string, string> = {}
      if (queryOptions.sort) params.sort = queryOptions.sort
      if (queryOptions.direction && queryOptions.direction) params.direction = queryOptions.direction
      if (queryOptions.since) params.since = queryOptions.since
      if (queryOptions.per_page) {
        params.per_page = queryOptions.per_page.toString()
      }
      if (queryOptions.page) params.page = queryOptions.page.toString()

      const apiPath = `/repos/${owner}/${repo}/issues/comments/`

      const res = (await this.get(
        apiPath,
        params
      ))
      if (res.statusCode === 404) {
        throw new Error(IssueCommentNotFoundMsg)
      }
      if (res.data) {
        const IssueData: RepoCommentListResponseType = res.data.map(
          (comment: Record<string, any>): IssueCommentInfoResponseType => ({
            id: comment.id,
            html_url: comment.html_url,
            body: comment.body,
            user: {
              id: comment.user.id,
              login: comment.user.login,
              name: comment.user.name,
              email: comment.user.email,
              html_url: comment.user.html_url,
              avatar_url: comment.user.avatar_url,
              type: capitalize(comment.user.type.toLowerCase())
            },
            created_at: comment.created_at,
            updated_at: comment.updated_at
          })
        )
        res.data = IssueData
      }
      return res
    } catch (error) {
      throw new Error(`获取仓库${options.owner}/${options.repo}评论列表失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取一个Issue下的评论列表
   * 权限:
   * - Issues: Read-only
   * - Pull requests: Read-only
   * 需以上权限之一
   * @param options 获取Issue评论列表的参数对象
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - issue_number Issue编号
   * - since 评论时间
   * - per_page 每页评论数量
   * - page 页码
   * @returns 包含Issue评论列表的响应对象
   * @example
   * ```ts
   * const issue = get_issue() // 获取issue实例
   * const res = await issue.get_issue_comments_list({ owner: 'owner', repo:'repo', issue_number:1 })
   * console.log(res) // { data: IssueCommentListResponseType[] }
   * ```
   */
  public async get_issue_comments_list (
    options: IssueCommentListParamType
  ): Promise<ApiResponseType<IssueCommentListResponseType>> {
    if (!options.owner || !options.repo) {
      throw new Error(MissingRepoOwnerOrNameMsg)
    }
    if (!options.issue_number) {
      throw new Error(MissingIssueNumberMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, issue_number, ...queryOptions } = options
      const params: Record<string, string> = {}

      if (queryOptions.since) params.since = queryOptions.since
      if (queryOptions.per_page) {
        params.per_page = queryOptions.per_page.toString()
      }
      if (queryOptions.page) params.page = queryOptions.page.toString()

      const apiPath = `/repos/${owner}/${repo}/issues/${Number(
        issue_number
      )}/comments`
      const res = (await this.get(
        apiPath,
        params
      ))
      if (res.statusCode === 404) {
        throw new Error(IssueCommentNotFoundMsg)
      }
      if (res.data) {
        const IssueData: IssueCommentListResponseType = res.data.map(
          (comment: Record<string, any>): IssueCommentInfoResponseType => ({
            id: comment.id,
            html_url: comment.html_url,
            body: comment.body,
            user: {
              id: comment.user.id,
              login: comment.user.login,
              name: comment.user.name,
              email: comment.user.email,
              html_url: comment.user.html_url,
              avatar_url: comment.user.avatar_url,
              type: capitalize(comment.user.type.toLowerCase())
            },
            created_at: comment.created_at,
            updated_at: comment.updated_at
          })
        )
        res.data = IssueData
      }
      return res
    } catch (error) {
      throw new Error(`获取议题评论列表失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取Issue评论信息
   * 权限:
   * - Issues: Read-only
   * - Pull requests: Read-only
   * 需以上权限之一
   * @param options 获取Issue评论信息的参数对象
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - comment_id 评论ID
   * @returns Issue评论信息
   * @example
   * ```ts
   * const issue = get_issue() // 获取issue实例
   * const res = await issue.get_issue_comment({ owner: 'owner', repo:'repo', comment_id:1 })
   * console.log(res) // { data: IssueCommentInfoResponseType }
   * ```
   */
  public async get_issue_comment_info (
    options: IssueCommentInfoParamType
  ): Promise<ApiResponseType<IssueCommentInfoResponseType>> {
    if (!options.owner || !options.repo) {
      throw new Error(MissingRepoOwnerOrNameMsg)
    }
    if (!options.comment_id) {
      throw new Error(MissingIssueCommentNumberMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, comment_id } = options
      const res = (await this.get(
        `/repos/${owner}/${repo}/issues/comments/${Number(comment_id)}`
      ))
      if (res.statusCode === 404) {
        throw new Error(IssueCommentNotFoundMsg)
      }
      if (res.data) {
        const IssueData: IssueCommentInfoResponseType = {
          id: res.data.id,
          html_url: res.data.html_url,
          body: res.data.body,
          user: {
            id: res.data.user.id,
            login: res.data.user.login,
            name: res.data.user.name,
            email: res.data.user.email,
            html_url: res.data.user.html_url,
            avatar_url: res.data.user.avatar_url,
            type: capitalize(res.data.user.type.toLowerCase())
          },
          created_at: res.data.created_at,
          updated_at: res.data.updated_at
        }
        res.data = IssueData
      }
      return res
    } catch (error) {
      throw new Error(`获取议题评论信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 创建一个Issue评论
   * 权限:
   * - Issues: Write
   * - Pull requests: Write
   * 需以上权限之一
   * @param options 创建Issue评论的参数对象
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - issue_number Issue编号
   * - body 评论内容
   * @returns 创建的Issue评论信息
   * @example
   * ```ts
   * const issue = get_issue() // 获取issue实例
   * const res = await issue.create_issue_comment({ owner: 'owner', repo:'repo', issue_number:1, body:'comment' })
   * console.log(res) // { data: CreteIssueCommentResponseType }
   * ```
   */
  public async create_issue_comment (
    options: CreteIssueCommentParamType
  ): Promise<ApiResponseType<CreteIssueCommentResponseType>> {
    if (!options.owner || !options.repo) {
      throw new Error(MissingRepoOwnerOrNameMsg)
    }
    if (!options.issue_number) {
      throw new Error(IssueCommentNotFoundMsg)
    }
    if (!options.body) {
      throw new Error(MissingIssueCommentBodyMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, issue_number, body } = options
      const res = (await this.post(
        `/repos/${owner}/${repo}/issues/${Number(issue_number)}/comments`,
        {
          body
        }
      ))
      if (res.statusCode === 404) {
        throw new Error(IssueCommentNotFoundMsg)
      }
      if (res.data) {
        const IssueData: CreteIssueCommentResponseType = {
          id: res.data.id,
          html_url: `${get_base_url(this.type)}/${owner}/${repo}/issues/${issue_number}#${res.data.id}`,
          body: res.data.body,
          user: {
            id: res.data.user.id,
            login: res.data.user.login,
            name: res.data.user.name,
            email: res.data.user.email,
            html_url: res.data.user.html_url,
            avatar_url: res.data.user.avatar_url,
            type: capitalize(res.data.user.type.toLowerCase())
          },
          created_at: res.data.created_at,
          updated_at: res.data.updated_at
        }
        res.data = IssueData
      }
      return res
    } catch (error) {
      throw new Error(`创建议题评论失败: ${(error as Error).message}`)
    }
  }

  /**
   * 更新Issue评论信息
   * 权限:
   * - Issues: Write
   * - Pull requests: Write
   * 需以上权限之一
   * @param options 更新Issue评论信息的参数对象
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - comment_id 评论ID
   * - body 评论内容
   * @returns 更新后的Issue评论信息
   * @example
   * ```ts
   * const issue = get_issue() // 获取issue实例
   * const res = await issue.update_issue_comment({ owner: 'owner', repo:'repo', comment_id:1, body:'body' })
   * console.log(res) // { data: UpdateIssueCommentResponseType }
   * ```
   */
  public async update_issue_comment (
    options: UpdateIssueCommentParamType
  ): Promise<ApiResponseType<UpdateIssueCommentResponseType>> {
    if (!options.owner || !options.repo) {
      throw new Error(MissingRepoOwnerOrNameMsg)
    }
    if (!options.comment_id) {
      throw new Error(MissingIssueCommentNumberMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, comment_id, ...updateData } = options
      const res = await this.patch(
        `/repos/${owner}/${repo}/issues/comments/${Number(comment_id)}`,
        null,
        updateData
      )
      if (res.statusCode === 404) {
        throw new Error(IssueCommentNotFoundMsg)
      }
      if (res.data) {
        const IssueData: UpdateIssueCommentResponseType = {
          id: res.data.id,
          html_url: res.data.html_url,
          body: res.data.body,
          user: {
            id: res.data.user.id,
            login: res.data.user.login,
            name: res.data.user.name,
            email: res.data.user.email,
            html_url: res.data.user.html_url,
            avatar_url: res.data.user.avatar_url,
            type: capitalize(res.data.user.type.toLowerCase())
          },
          created_at: res.data.created_at,
          updated_at: res.data.updated_at
        }
        res.data = IssueData
      }
      return res
    } catch (error) {
      throw new Error(`更新议题评论信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 删除Issue评论信息
   * 权限:
   * - Issues: Write
   * - Pull requests: Write
   * 需以上权限之一
   * @param options 删除Issue评论信息的参数对象
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - comment_id 评论ID
   * @returns 删除结果信息
   * @example
   * ```ts
   * const issue = get_issue() // 获取issue实例
   * const res = awaitissue.remove_issue_comment()
   * console.log(res) // { data: RemoveIssueCommentResponseType }
   * ```
   */
  public async remove_issue_comment (
    options: RemoveIssueCommentParamType
  ): Promise<ApiResponseType<RemoveCollaboratorResponseType>> {
    if (!options.owner || !options.repo) {
      throw new Error(MissingRepoOwnerOrNameMsg)
    }
    if (!options.comment_id) {
      throw new Error(MissingIssueCommentNumberMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, comment_id } = options
      const res = await this.delete(
        `/repos/${owner}/${repo}/issues/comments/${Number(comment_id)}`
      )
      if (res.statusCode === 404) {
        throw new Error(IssueCommentNotFoundMsg)
      }
      let IssueData: RemoveCollaboratorResponseType
      if (res.statusCode === 204) {
        IssueData = {
          info: IssueCommentRemoveSuccessMsg
        }
      } else {
        IssueData = {
          info: FailedtoRemoveIssueMsg
        }
      }
      res.data = IssueData
      return res
    } catch (error) {
      throw new Error(`删除议题评论信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 删除Issue评论信息
   * 权限:
   * - Issues: Write
   * - Pull requests: Write
   * 需以上权限之一
   * @deprecated 请使用 remove_issue_comment 方法代替
   */
  public async delete_issue_comment (
    options: RemoveIssueCommentParamType
  ): Promise<ApiResponseType<RemoveCollaboratorResponseType>> {
    return this.remove_issue_comment(options)
  }

  /**
   * 获取子议题列表
   * @github
   * 仅GitHub 平台使用
   * 权限:
   * - Issues: Read-only
   * - Pull requests: Read-only
   * 需以上权限之一
   * @param options 获取子议题列表的参数对象
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - issue_number 议题编号
   * @returns 子议题列表
   * @example
   * ```ts
   * const issue = get_issue() // 获取issue实例
   * const res = await issue.get_sub_issue_list({ owner: 'owner', repo:'repo', issue_number:1 })
   * console.log(res) // { data: SubIssueListResponseType }
   * ```
   */
  public async get_sub_issue_list (
    options: SubIssueListParamType
  ): Promise<ApiResponseType<SubIssueListResponseType>> {
    if (!options.owner || !options.repo) {
      throw new Error(MissingRepoOwnerOrNameMsg)
    }
    if (!options.issue_number) {
      throw new Error(IssueCommentNotFoundMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, issue_number, ...queryOptions } = options
      const params: Record<string, string> = {}

      if (queryOptions.per_page) {
        params.per_page = queryOptions.per_page.toString()
      }
      if (queryOptions.page) params.page = queryOptions.page.toString()

      const apiPath = `/repos/${owner}/${repo}/issues/${Number(
        issue_number
      )}/sub_issues`
      const res = (await this.get(
        apiPath,
        params
      ))
      if (res.statusCode === 404) {
        throw new Error(IssueNotFoundMsg)
      }
      if (res.data) {
        const IssueData: SubIssueListResponseType = res.data.map(
          (issue: Record<string, any>): IssueInfoResponseType => ({
            id: issue.id,
            html_url: issue.html_url,
            number: issue.number,
            comments: issue.comments,
            state: issue.state,
            state_reason: issue.state_reason,
            title: issue.title,
            body: issue.body,
            user: {
              id: issue.user.id,
              login: issue.user.login,
              name: issue.user.name,
              email: issue.user.email,
              html_url: issue.user.html_url,
              avatar_url: issue.user.avatar_url,
              type: capitalize(issue.user.type.toLowerCase())
            },
            labels: issue.labels
              ? issue.labels.map((label: IssueLabelType) => ({
                id: label.id,
                name: label.name,
                color: label.color
              }))
              : null,
            assignee: issue.assignee
              ? {
                  id: issue.assignee.id,
                  login: issue.assignee.login,
                  name: issue.assignee.name,
                  email: issue.assignee.email,
                  html_url: issue.assignee.html_url,
                  avatar_url: issue.assignee.avatar_url,
                  type: capitalize(issue.assignee.type.toLowerCase())
                }
              : null,
            milestone: issue.milestone
              ? {
                  id: issue.milestone.id,
                  url: issue.milestone.url,
                  number: issue.milestone.number,
                  state: issue.milestone.state,
                  title: issue.milestone.title,
                  description: issue.milestone.description,
                  open_issues: issue.milestone.open_issues,
                  closed_issues: issue.milestone.closed_issues,
                  created_at: issue.milestone.created_at,
                  updated_at: issue.milestone.updated_at,
                  closed_at: issue.milestone.closed_at,
                  due_on: issue.milestone.due_on
                }
              : null,
            closed_at: issue.closed_at,
            created_at: issue.created_at,
            updated_at: issue.updated_at
          })
        )
        res.data = IssueData
      }
      return res
    } catch (error) {
      throw new Error(`获取子议题列表失败: ${(error as Error).message}`)
    }
  }

  /**
   * 添加子议题
   * 添加一个子议题到指定的议题中
   * @github
   * 仅GitHub 平台使用
   * 权限：
   * - Issues：Write
   * @param options 添加子议题的参数对象
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - issue_number 父议题编号
   * - sub_issue_id 子议题编号
   * - replace_parent 是否替换父议题
   * @returns 添加结果信息
   * @example
   * ```ts
   * const issue = get_issue() // 获取issue实例
   * const res = await issue.add_sub_issue({ owner: 'owner', repo:'repo', issue_number:1, sub_issue_id:1, replace_parent:true })
   * console.log(res) // { data: AddSubIssueResponseType }
   * ```
   */
  public async add_sub_issue (
    options: AddSubIssueParamType
  ): Promise<ApiResponseType<AddSubIssueResponseType>> {
    if (!options.owner || !options.repo) {
      throw new Error(MissingRepoOwnerOrNameMsg)
    }
    if (!options.issue_number) {
      throw new Error(IssueCommentNotFoundMsg)
    }
    if (!options.sub_issue_id) {
      throw new Error(MissingSubIssueNumberMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, issue_number, sub_issue_id, replace_parent } =
        options
      const res = (await this.post(
        `/repos/${owner}/${repo}/issues/${issue_number}/sub_issues`,
        {
          sub_issue_id,
          replace_parent
        }
      ))
      if (res.statusCode === 404) {
        throw new Error(IssueNotFoundMsg)
      }
      if (res.data) {
        const IssueData: AddSubIssueResponseType = {
          id: res.data.id,
          html_url: res.data.html_url,
          number: res.data.number,
          comments: res.data.comments,
          state: res.data.state,
          state_reason: res.data.state_reason,
          title: res.data.title,
          body: res.data.body,
          user: {
            id: res.data.user.id,
            login: res.data.user.login,
            name: res.data.user.name,
            email: res.data.user.email,
            html_url: res.data.user.html_url,
            avatar_url: res.data.user.avatar_url,
            type: capitalize(res.data.user.type.toLowerCase())
          },
          labels: res.data.labels
            ? res.data.labels.map((label: IssueLabelType) => ({
              id: label.id,
              name: label.name,
              color: label.color
            }))
            : null,
          assignee: res.data.assignee
            ? {
                id: res.data.assignee.id,
                login: res.data.assignee.login,
                name: res.data.assignee.name,
                email: res.data.assignee.email,
                html_url: res.data.assignee.html_url,
                avatar_url: res.data.assignee.avatar_url,
                type: capitalize(res.data.assignee.type.toLowerCase())
              }
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
                closed_at: res.data.milestone.closed_at,
                due_on: res.data.milestone.due_on
              }
            : null,
          closed_at: res.data.closed_at,
          created_at: res.data.created_at,
          updated_at: res.data.updated_at
        }
        res.data = IssueData
      }
      return res
    } catch (error) {
      throw new Error(`添加子议题失败: ${(error as Error).message}`)
    }
  }

  /**
   * 删除子议题
   * @github
   * 仅GitHub 平台使用
   * 权限：
   * - Issues：Write
   * @param options 删除子议题的参数对象
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - issue_number 父议题编号
   * - sub_issue_id 子议题编号
   * @returns 删除结果信息
   * @example
   * ```ts
   * const issue = get_issue() // 获取issue实例
   * const res = await issue.remove_sub_issue({ owner: 'owner', repo:'repo', issue_number:1, sub_issue_id:1 })
   * console.log(res) // { data: RemoveSubIssueResponseType }
   * ```
   */
  public async remove_sub_issue (
    options: RemoveSubIssueParamType
  ): Promise<ApiResponseType<RemoveSubIssueResponseType>> {
    if (!options.owner || !options.repo) {
      throw new Error(MissingRepoOwnerOrNameMsg)
    }
    if (!options.issue_number) {
      throw new Error(IssueCommentNotFoundMsg)
    }
    if (!options.sub_issue_id) {
      throw new Error(MissingSubIssueNumberMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, issue_number, sub_issue_id } = options
      const res = (await this.delete(
        `/repos/${owner}/${repo}/issues/${issue_number}/sub_issue`,
        null,
        {
          sub_issue_id
        }
      ))
      if (res.statusCode === 404) {
        throw new Error(IssueNotFoundMsg)
      }
      if (res.data) {
        const IssueData: RemoveSubIssueResponseType = {
          id: res.data.id,
          html_url: res.data.html_url,
          number: res.data.number,
          comments: res.data.comments,
          state: res.data.state,
          state_reason: res.data.state_reason,
          title: res.data.title,
          body: res.data.body,
          user: {
            id: res.data.user.id,
            login: res.data.user.login,
            name: res.data.user.name,
            email: res.data.user.email,
            html_url: res.data.user.html_url,
            avatar_url: res.data.user.avatar_url,
            type: capitalize(res.data.user.type.toLowerCase())
          },
          labels: res.data.labels
            ? res.data.labels.map((label: IssueLabelType) => ({
              id: label.id,
              name: label.name,
              color: label.color
            }))
            : null,
          assignee: res.data.assignee
            ? {
                id: res.data.assignee.id,
                login: res.data.assignee.login,
                name: res.data.assignee.name,
                email: res.data.assignee.email,
                html_url: res.data.assignee.html_url,
                avatar_url: res.data.assignee.avatar_url,
                type: capitalize(res.data.assignee.type.toLowerCase())
              }
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
                closed_at: res.data.milestone.closed_at,
                due_on: res.data.milestone.due_on
              }
            : null,
          closed_at: res.data.closed_at,
          created_at: res.data.created_at,
          updated_at: res.data.updated_at
        }
        res.data = IssueData
      }
      return res
    } catch (error) {
      throw new Error(`删除子议题失败: ${(error as Error).message}`)
    }
  }

  /**
   * 删除子议题
   * 删除一个子议题
   * 权限：
   * - Issues：Write
   * @deprecated 请使用 remove_sub_issue 方法代替
   */
  public async delete_sub_issue (
    options: RemoveSubIssueParamType
  ): Promise<ApiResponseType<RemoveSubIssueResponseType>> {
    return this.remove_sub_issue(options)
  }

  /**
   * 重新排序子议题
   * 重新确定子议题优先级
   * @github
   * 仅GitHub 平台使用
   * 权限：
   * - Issues：Write
   * @param options 重新排序子议题的参数对象
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - issue_number 父议题编号
   * - sub_issue_id 子议题编号
   * - before_id 指定要在哪个子议题之前插入，传入目标子议题的编号
   * - after_id 指定要在哪个子议题之后插入，传入目标子议题的编号
   * @example
   * ```ts
   * const issue = get_issue() // 获取issue实例
   * const res = await issue.reprioritize_sub_issue({ owner: 'owner', repo:'repo', issue_number:1, sub_issue_id:1, before_id:1 })
   * console.log(res) // { data: ReprioritizeSubIssueResponseType }
   * ```
   */
  public async reprioritize_sub_issue (
    options: ReprioritizeSubIssueParamType
  ): Promise<ApiResponseType<ReprioritizeSubIssueResponseType>> {
    if (!options.owner || !options.repo) {
      throw new Error(MissingRepoOwnerOrNameMsg)
    }
    if (!options.issue_number) {
      throw new Error(IssueCommentNotFoundMsg)
    }
    if (!options.sub_issue_id) {
      throw new Error(MissingSubIssueNumberMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, issue_number, sub_issue_id, ...queryOptions } =
        options
      const params: Record<string, string> = {}

      if (queryOptions.before_id && !queryOptions.after_id) {
        params.before_id = queryOptions.before_id.toString()
      }
      if (queryOptions.after_id && !queryOptions.before_id) {
        params.after_id = queryOptions.after_id.toString()
      }
      const url = `/repos/${owner}/${repo}/issues/${issue_number}/sub_issues/priority`
      const res = (await this.patch(url, params, {
        sub_issue_id: String(sub_issue_id)
      }))
      if (res.statusCode === 404) {
        throw new Error(IssueNotFoundMsg)
      }
      if (res.data) {
        const IssueData: ReprioritizeSubIssueResponseType = {
          id: res.data.id,
          html_url: res.data.html_url,
          number: res.data.number,
          comments: res.data.comments,
          state: res.data.state,
          state_reason: res.data.state_reason,
          title: res.data.title,
          body: res.data.body,
          user: {
            id: res.data.user.id,
            login: res.data.user.login,
            name: res.data.user.name,
            email: res.data.user.email,
            html_url: res.data.user.html_url,
            avatar_url: res.data.user.avatar_url,
            type: capitalize(res.data.user.type.toLowerCase())
          },
          labels: res.data.labels
            ? res.data.labels.map((label: IssueLabelType) => ({
              id: label.id,
              name: label.name,
              color: label.color
            }))
            : null,
          assignee: res.data.assignee
            ? {
                id: res.data.assignee.id,
                login: res.data.assignee.login,
                name: res.data.assignee.name,
                email: res.data.assignee.email,
                html_url: res.data.assignee.html_url,
                avatar_url: res.data.assignee.avatar_url,
                type: capitalize(res.data.assignee.type.toLowerCase())
              }
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
                closed_at: res.data.milestone.closed_at,
                due_on: res.data.milestone.due_on
              }
            : null,
          closed_at: res.data.closed_at,
          created_at: res.data.created_at,
          updated_at: res.data.updated_at
        }
        res.data = IssueData
      }
      return res
    } catch (error) {
      throw new Error(`重新排序子议题失败: ${(error as Error).message}`)
    }
  }
}
