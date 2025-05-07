import {
  NotIssueMsg,
  NotIssueNumberMsg,
  NotIssueTitleMsg,
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
  CreteIssueParamType,
  IssueInfoParamType,
  IssueInfoResponseType,
  issueListParamType,
  IssueListResponseType,
  LockIssueParamType,
  LockIssueResponseType,
  OpenIssueParamType,
  OpenIssueResponseType,
  UnLockIssueParamType,
  UnLockIssueResponseType,
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
   * const issue = get_issue() // 获取issue实例
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
      const res = await this.get(`/repos/${owner}/${repo}/issues`)
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
      throw new Error(NotParamMsg)
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
      throw new Error(NotParamMsg)
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
      throw new Error(NotParamMsg)
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

  /** @deprecated 请使用 open_issue 方法代替 */
  public async reopen_issue (options: OpenIssueParamType): Promise<ApiResponseType<OpenIssueResponseType>> {
    return this.open_issue(options)
  }

  /**
   * 关闭一个Issue
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
      throw new Error(NotParamMsg)
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
      throw new Error(NotParamMsg)
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
      throw new Error(NotParamMsg)
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
}
