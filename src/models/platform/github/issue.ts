import {
  NotIssueCommentBodyMsg,
  NotIssueCommentMsg,
  NotIssueCommentNumberMsg,
  NotIssueMsg,
  NotIssueNumberMsg,
  NotIssueTitleMsg,
  NotOwnerOrRepoParamMsg,
  NotParamMsg,
  NotPerrmissionMsg,
  parse_git_url
} from '@/common'
import { Base } from '@/models/platform/github/base'
import type {
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
  IssueInfoParamType,
  IssueInfoResponseType,
  IssueListResponseType,
  LockIssueParamType,
  LockIssueResponseType,
  OpenIssueParamType,
  OpenIssueResponseType,
  RemoveCollaboratorResponseType,
  RemoveIssueCommentParamType,
  RepoCommentListParamType,
  RepoCommentListResponseType,
  RepoIssueListParamType,
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
 * - 创建Issue
 * - 更新Issue
 * - 关闭Issue
 * - 评论Issue
 *
 * @remarks 每个拉取请求都是一个议题，但并非每个议题都是拉取请求。
 * @class Issue
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
   * 权限: Issues - Read
   * @param options 请求参数列表
   * - url 仓库URL地址
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - issue_number Issue编号
   * url参数和owner、repo参数传入其中的一种
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
      const res = await this.get(`/repos/${owner}/${repo}/issues/${options.issue_number}`)
      switch (res.statusCode) {
        case 404:
          throw new Error(NotIssueMsg)
        case 301:
          throw new Error(NotIssueMsg)
      }
      return res
    } catch (error) {
      throw new Error(`获取Issue详情失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取仓库的Issue列表
   * 权限: Issues - Read
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
   * - page  页码，可选，默认为1
   * @returns 包含Issue列表的响应对象
   * @example
   * ```ts
   * const issue = get_issue() // 获取issue实例
   * const res = await issue.get_issue_list({ owner: 'owner', repo: 'repo' })
   * console.log(res) // { data: IssueListResponseType[] }
   * ```
   */
  public async get_repo_issue_list (
    options: RepoIssueListParamType
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

      const queryParams = new URLSearchParams()

      if (options.milestone) queryParams.append('milestone', options.milestone.toString())
      if (options.state) queryParams.append('state', options.state)
      if (options.assignee) queryParams.append('assignee', options.assignee)
      if (options.creator) queryParams.append('creator', options.creator)
      if (options.mentioned) queryParams.append('mentioned', options.mentioned)
      if (options.labels) queryParams.append('labels', options.labels)
      if (options.sort) queryParams.append('sort', options.sort)
      if (options.direction) queryParams.append('direction', options.direction)
      if (options.since) queryParams.append('since', options.since)
      if (options.per_page) queryParams.append('per_page', options.per_page.toString())
      if (options.page) queryParams.append('page', options.page.toString())

      const queryString = queryParams.toString()
      const apiPath = `/repos/${owner}/${repo}/issues${queryString ? `?${queryString}` : ''}`

      const res = await this.get(apiPath)
      if (res.statusCode === 401) {
        throw new Error(NotPerrmissionMsg)
      }
      return res
    } catch (error) {
      throw new Error(`获取仓库${owner}/${repo}的Issue列表失败: ${(error as Error).message}`)
    }
  }

  /**
   * 创建一个Issue
   * 权限: Issues - Write
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
      throw new Error(NotOwnerOrRepoParamMsg)
    }
    if (!options.title) {
      throw new Error(NotIssueTitleMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, ...IssueOptions } = options
      const res = await this.post(`/repos/${owner}/${repo}/issues`, IssueOptions)
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
      throw new Error(NotOwnerOrRepoParamMsg)
    }
    if (!options.issue_number) {
      throw new Error(NotIssueNumberMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, issue_number, ...updateData } = options
      const res = await this.patch(`/repos/${owner}/${repo}/issues/${issue_number}`, updateData)
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
      throw new Error(NotOwnerOrRepoParamMsg)
    }
    if (!options.issue_number) {
      throw new Error(NotIssueNumberMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, issue_number } = options
      const res = await this.patch(`/repos/${owner}/${repo}/issues/${issue_number}`, {
        state: 'open',
        state_reason: 'reopened'
      })
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
  public async reopen_issue (options: OpenIssueParamType): Promise<ApiResponseType<OpenIssueResponseType>> {
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
      throw new Error(NotOwnerOrRepoParamMsg)
    }
    if (!options.issue_number) {
      throw new Error(NotIssueNumberMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, issue_number, state_reason } = options
      const res = await this.patch(`/repos/${owner}/${repo}/issues/${issue_number}`, {
        state: 'closed',
        state_reason
      })
      if (res.statusCode === 404) {
        throw new Error(NotIssueMsg)
      }
      return res
    } catch (error) {
      throw new Error(`关闭Issue失败: ${(error as Error).message}`)
    }
  }

  /**
   * 锁定一个Issue
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
      throw new Error(NotOwnerOrRepoParamMsg)
    }
    if (!options.issue_number) {
      throw new Error(NotIssueNumberMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, issue_number, lock_reason } = options
      const res = await this.put(`/repos/${owner}/${repo}/issues/${issue_number}`, {
        locked: true,
        lock_reason
      })
      if (res.statusCode === 404) {
        throw new Error(NotIssueMsg)
      }
      if (res.statusCode === 204) {
        res.data = {
          info: '锁定成功'
        }
      }
      return res
    } catch (error) {
      throw new Error(`锁定Issue失败: ${(error as Error).message}`)
    }
  }

  /**
   * 解锁一个Issue
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
      throw new Error(NotOwnerOrRepoParamMsg)
    }
    if (!options.issue_number) {
      throw new Error(NotIssueNumberMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, issue_number } = options
      const res = await this.delete(`/repos/${owner}/${repo}/issues/${issue_number}/lock`)
      if (res.statusCode === 404) {
        throw new Error(NotIssueMsg)
      }
      if (res.statusCode === 204) {
        res.data = {
          info: '解锁成功'
        }
      }
      return res
    } catch (error) {
      throw new Error(`解锁Issue失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取一个仓库下Issue的评论列表
   * 权限:
   * - Issues: Read
   * - Pull requests: Read
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
   * const res = await issue.get_issue_comment_list({ owner: 'owner', repo:'repo', issue_number:1 })
   * console.log(res) // { data: IssueCommentListResponseType[] }
   * ```
   */
  public async get_repo_comment_list (
    options: RepoCommentListParamType
  ): Promise<ApiResponseType<RepoCommentListResponseType>> {
    if (!options.owner || !options.repo) {
      throw new Error(NotOwnerOrRepoParamMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, ...queryOptions } = options

      const queryParams = new URLSearchParams()

      if (queryOptions.sort) queryParams.append('sort', queryOptions.sort)
      if (queryOptions.sort && queryOptions.direction) queryParams.append('direction', queryOptions.direction)
      if (queryOptions.since) queryParams.append('since', queryOptions.since)
      if (queryOptions.per_page) queryParams.append('per_page', queryOptions.per_page.toString())
      if (queryOptions.page) queryParams.append('page', queryOptions.page.toString())

      const queryString = queryParams.toString()
      const apiPath = `/repos/${owner}/${repo}/issues/comments/${queryString ? `?${queryString}` : ''}`

      const res = await this.get(apiPath)
      if (res.statusCode === 404) {
        throw new Error(NotIssueCommentMsg)
      }
      return res
    } catch (error) {
      throw new Error(`获取仓库评论列表失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取一个Issue下的评论列表
   * 权限:
   * - Issues: Read
   * - Pull requests: Read
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
   * const res = await issue.get_issue_comment_list({ owner: 'owner', repo:'repo', issue_number:1 })
   * console.log(res) // { data: IssueCommentListResponseType[] }
   * ```
   */
  public async get_issue_comment_list (
    options: IssueCommentListParamType
  ): Promise<ApiResponseType<IssueCommentListParamType>> {
    if (!options.owner || !options.repo) {
      throw new Error(NotOwnerOrRepoParamMsg)
    }
    if (!options.issue_number) {
      throw new Error(NotIssueNumberMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, issue_number, ...queryOptions } = options
      const queryParams = new URLSearchParams()

      if (queryOptions.since) queryParams.append('since', queryOptions.since)
      if (queryOptions.per_page) queryParams.append('per_page', queryOptions.per_page.toString())
      if (queryOptions.page) queryParams.append('page', queryOptions.page.toString())

      const queryString = queryParams.toString()
      const apiPath = `/repos/${owner}/${repo}/issues/${issue_number}/comments/${queryString ? `?${queryString}` : ''}`

      const res = await this.get(apiPath)
      if (res.statusCode === 404) {
        throw new Error(NotIssueCommentMsg)
      }
      return res
    } catch (error) {
      throw new Error(`获取Issue评论列表失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取Issue评论信息
   * 权限:
   * - Issues: Read
   * - Pull requests: Read
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
      throw new Error(NotOwnerOrRepoParamMsg)
    }
    if (!options.comment_id) {
      throw new Error(NotIssueCommentNumberMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, comment_id } = options
      const res = await this.get(`/repos/${owner}/${repo}/issues/comments/${comment_id}`)
      if (res.statusCode === 404) {
        throw new Error(NotIssueCommentMsg)
      }
      return res
    } catch (error) {
      throw new Error(`获取Issue评论信息失败: ${(error as Error).message}`)
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
      throw new Error(NotOwnerOrRepoParamMsg)
    }
    if (!options.issue_number) {
      throw new Error(NotIssueCommentMsg)
    }
    if (!options.body) {
      throw new Error(NotIssueCommentBodyMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, issue_number, body } = options
      const res = await this.post(`/repos/${owner}/${repo}/issues/${issue_number}/comments`, {
        body
      })
      if (res.statusCode === 404) {
        throw new Error(NotIssueCommentMsg)
      }
      return res
    } catch (error) {
      throw new Error(`创建Issue评论失败: ${(error as Error).message}`)
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
      throw new Error(NotOwnerOrRepoParamMsg)
    }
    if (!options.comment_id) {
      throw new Error(NotIssueCommentNumberMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, comment_id, ...updateData } = options
      const res = await this.patch(`/repos/${owner}/${repo}/issues/comments/${comment_id}`, updateData)
      if (res.statusCode === 404) {
        throw new Error(NotIssueCommentMsg)
      }
      return res
    } catch (error) {
      throw new Error(`更新Issue评论信息失败: ${(error as Error).message}`)
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
      throw new Error(NotOwnerOrRepoParamMsg)
    }
    if (!options.comment_id) {
      throw new Error(NotIssueCommentNumberMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, comment_id } = options
      const res = await this.delete(`/repos/${owner}/${repo}/issues/comments/${comment_id}`)
      if (res.statusCode === 404) {
        throw new Error(NotIssueCommentMsg)
      }
      if (res.statusCode === 204) {
        res.data = {
          info: '删除成功'
        }
      }
      return res
    } catch (error) {
      throw new Error(`删除Issue评论信息失败: ${(error as Error).message}`)
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
}
