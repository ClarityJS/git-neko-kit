import { PullRequestIdParamType, RepoBaseParamType } from '@/types/platform/base'
import { IssueLabelType, MilestoneType } from '@/types/platform/github/issue'
import { RepoInfoResponseType } from '@/types/platform/github/repo'
import { UserInfoResponseType } from '@/types/platform/github/user'

export type PrUser = Omit<UserInfoResponseType, 'bio' | 'blog' | 'followers' | 'following' | 'public_repos'>
export type PrRepo = Pick<RepoInfoResponseType, 'id' | 'owner' | 'name' | 'full_name'>

/** 拉取请求信息参数类型 */
export type PullRequestInfoParamType = PullRequestIdParamType & RepoBaseParamType
/** 拉取请求信息响应类型 */
export interface PullRequestInfoResponseType {
  /** 拉取请求的id */
  id: number
  /** 拉取请求的URL */
  html_url: string
  /** 拉取请求的编号 */
  number: number
  /** 拉取请求的状态 (open/closed) */
  state: 'open' | 'closed'
  /** 是否被锁定 */
  locked: boolean
  /** 拉取请求的标题 */
  title: string
  /** 拉取请求的描述 */
  body: string | null
  /** 是否为草稿PR */
  draft: boolean
  /** 创建时间 */
  created_at: string
  /** 更新时间 */
  updated_at: string
  /** 关闭时间 */
  closed_at: string | null
  /** 合并时间 */
  merged_at: string | null
  /** PR作者 */
  user: PrUser
  base: {
    label: string
    ref: string
    sha: string
    user: PrUser
    repo: PrRepo
  }
  /** PR的源分支信息 */
  head: {
    label: string
    ref: string
    sha: string
    user: PrUser
    repo: PrRepo
  }
  /** 指派人 */
  assignee: PrUser | null
  /** 指派人列表 */
  assignees: Array<PrUser> | null
  /** 里程碑 */
  milestone: MilestoneType | null
  /** 标签列表 */
  labels: Array<IssueLabelType>
  /** 提交数量 */
  commits: number
  /** 新增行数 */
  additions: number
  /** 删除行数 */
  deletions: number
  /** 更改的文件数 */
  changed_files: number
}

/** 拉取请求列表参数类型 */
export interface PullRequestListParamType extends RepoBaseParamType {
  /**
   * 拉取请求状态
   * @default "open"
   * - open: 打开的拉取请求
   * - closed: 已关闭的拉取请求
   * - all: 所有拉取请求
   */
  state?: 'open' | 'closed' | 'all'

  /**
   * 基础分支名称
   * 用于筛选指定目标分支的拉取请求
   * @example "main"
   */
  base?: string

  /**
   * 排序依据
   * @default "created"
   * - created: 按创建时间排序
   * - updated: 按更新时间排序
   */
  sort?: 'created' | 'updated'
  /**
   * 排序方向
   * @default "desc"
   * - asc: 升序
   * - desc: 降序
   */
  direction?: 'asc' | 'desc'
  /**
   * 每页结果数量
   * @default "30"
   * @remarks 取值范围：1-100
   */
  per_page?: string
  /**
   * 页码
   * @default "1"
   * @remarks 必须大于等于1
   */
  page?: string
}
/** 拉取请求列表响应类型 */
export type PullRequestListResponseType = Array<PullRequestInfoResponseType>
