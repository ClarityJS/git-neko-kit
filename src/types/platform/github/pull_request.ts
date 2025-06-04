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
