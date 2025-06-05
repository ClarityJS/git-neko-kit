import { PullRequestNumberParamType, RepoBaseParamType } from '@/types/platform/base'
import { IssueLabelType, MilestoneType } from '@/types/platform/github/issue'
import { RepoInfoResponseType } from '@/types/platform/github/repo'
import { UserInfoResponseType } from '@/types/platform/github/user'

export type PrUser = Omit<UserInfoResponseType, 'bio' | 'blog' | 'followers' | 'following' | 'public_repos'>
export type PrRepo = Pick<RepoInfoResponseType, 'id' | 'owner' | 'name' | 'full_name'>

/** 拉取请求信息参数类型 */
export type PullRequestInfoParamType = PullRequestNumberParamType & RepoBaseParamType
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

/** 使用issue填充拉取提交标题与内容 */
type WithIssue = {
  /** 拉取请求标题 */
  title?: never;
  /** 拉取请求描述 */
  body?: never;
  /**
   * 关联的议题
   * Pull Request的标题和内容可以根据指定的Issue Id自动填充
   */
  issue: string | number;
}
/** 不使用issue填充拉取提交标题与内容 */
type WithoutIssue = {
  /** 拉取请求标题 */
  title: string
  /** 拉取请求描述 */
  body?: string
  /**
   * 关联的议题
   * Pull Request的标题和内容可以根据指定的Issue Id自动填充
   */
  issue?: never;
}

/** 创建拉取提交参数类型 */
export type CreatePullRequestParamType = RepoBaseParamType & (WithIssue | WithoutIssue) & {
  /** 拉取请求源分支 */
  head: string
  /**
   * 拉取请求源仓库
   * 。如果两个存储库都由同一组织拥有，则跨存储库拉取请求需要此字段
   * */
  head_repo?: string
  /** 拉取请求目标分支 */
  base: string
  /** 是否为草稿 */
  draft?: boolean
}
/** 创建拉取请求响应类型 */
export type CreatePullRequestResponseType = PullRequestInfoResponseType

/** 更新拉取请求参数类型 */
export interface UpdatePullRequestParamType extends RepoBaseParamType, PullRequestNumberParamType {
  /** 拉取请求标题 */
  title?: string
  /** 拉取请求内容 */
  body?: string
  /** 拉取请求状态 */
  state?: 'open' | 'closed'
}
/** 更新拉取请求响应类型 */
export type UpdatePullRequestResponseType = PullRequestInfoResponseType
