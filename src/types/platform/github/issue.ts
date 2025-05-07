import { RepoUrlParamType } from '@/types/platform/github/base'
import { RepoBaseParamType } from '@/types/platform/github/repo'
import { UserInfoResponseType } from '@/types/platform/github/user'

/** 议题信息参数类型 */
export type IssueInfoParamType = (RepoBaseParamType | RepoUrlParamType) & {
  /** 议题ID */
  issue_number: number
}
export type issueListParamType = (RepoBaseParamType | RepoUrlParamType) & {
  /** 里程碑，可以是字符串或数字 */
  milestone?: string | number,
  /** 问题状态：全部/打开/关闭 */
  state?: 'all' | 'open' | 'closed'
  /** 指派人用户名 */
  assignee?: string,
  /** 议题类型 */
  type?: string,
  /** 创建者用户名 */
  creator?: string,
  /** 提及的用户名 */
  mentioned?: string,
  /** 标签，以逗号分隔的标签名称列表 */
  labels?: string,
  /** 排序方式：创建时间/更新时间/评论数 */
  sort?: 'created' | 'updated' | 'comments',
  /** 排序方向：升序/降序 */
  direction?: 'asc' | 'desc',
  /** 筛选此时间之后的议题 */
  since?: string,
  /** 每页数量 */
  per_page?: number,
  /** 页码 */
  page?: number
}

/** 议题标签类型 */
export interface IssueLabelType {
  /** 标签ID */
  id?: number;
  /** 标签节点ID */
  node_id?: string;
  /** 标签URL */
  url?: string;
  /** 标签名称 */
  name: string;
  /** 标签描述 */
  description?: string | null;
  /** 标签颜色代码 */
  color?: string | null;
  /** 是否是默认标签 */
  default?: boolean;
}

/** 议题里程碑类型 */
export interface MilestoneType {
  /** 里程碑URL */
  url: string;
  /** 里程碑HTML URL */
  html_url: string;
  /** 里程碑标签URL */
  labels_url: string;
  /** 里程碑ID */
  id: number;
  /** 里程碑节点ID */
  node_id: string;
  /** 里程碑编号 */
  number: number;
  /** 里程碑状态: open/closed */
  state: string;
  /** 里程碑标题 */
  title: string;
  /** 里程碑描述 */
  description: string | null;
  /** 里程碑创建者 */
  creator: UserInfoResponseType | null;
  /** 开放议题数 */
  open_issues: number;
  /** 关闭议题数 */
  closed_issues: number;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
  /** 关闭时间 */
  closed_at: string | null;
  /** 截止时间 */
  due_on: string | null;
}

/** 拉取请求关联信息类型 */
export interface PullRequestType {
  /** 合并时间 */
  merged_at: string | null;
  /** 差异URL */
  diff_url: string | null;
  /** HTML URL */
  html_url: string | null;
  /** 补丁URL */
  patch_url: string | null;
  /** API URL */
  url: string | null;
}

/** 议题详情响应类型 */
export interface IssueInfoResponseType {
  /** 议题ID */
  id: number;
  /** 节点ID */
  node_id: string;
  /** 议题API URL */
  url: string;
  /** 仓库API URL */
  repository_url: string;
  /** 标签URL */
  labels_url: string;
  /** 评论URL */
  comments_url: string;
  /** 事件URL */
  events_url: string;
  /** 议题HTML页面URL */
  html_url: string;
  /** 议题编号 */
  number: number;
  /** 议题状态: open/closed */
  state: string;
  /** 状态原因: completed/reopened/not_planned/null */
  state_reason: string | null;
  /** 议题标题 */
  title: string;
  /** 议题正文内容 */
  body: string | null;
  /** 议题创建者用户信息 */
  user: UserInfoResponseType
  /** 议题标签 */
  labels: Array<IssueLabelType | string>;
  /** 议题指派人 */
  assignee: UserInfoResponseType | null;
  /** 议题所有指派人列表 */
  assignees: Array<UserInfoResponseType> | null;
  /** 议题所属里程碑 */
  milestone: MilestoneType | null;
  /** 是否锁定 */
  locked: boolean;
  /** 活跃锁定原因 */
  active_lock_reason: string | null;
  /** 评论数 */
  comments: number;
  /** 关联的拉取请求信息 */
  pull_request?: PullRequestType;
  /** 关闭时间 */
  closed_at: string | null;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
  /** 是否是草稿 */
  draft?: boolean;
  /** 关闭者信息 */
  closed_by?: UserInfoResponseType | null;
}

/** 议题列表响应类型 */
export type IssueListResponseType = IssueInfoResponseType[]
/** 创建议题参数类型 */
export type CreteIssueParamType = RepoBaseParamType & {
  /** 标题 */
  title: string
  /** 正文内容 */
  body?: string | null
  /**
   * 分配的用户
   * @deprecated 已弃用，请使用 assignees 字段
  */
  assignee?: string | null
  /** 里程碑 */
  milestone?: number | string | null
  /** 标签列表 */
  labels?: Array<string> | null
  /** 指派的用户名 */
  assignees?: Array<string> | null
  /** 议题类型 */
  type?: string
}

/** 创建议题响应类型 */
export type CreateIssueResponseType = IssueInfoResponseType

/** 更新议题参数类型 */
export interface UpdateIssueParamType extends Omit<CreteIssueParamType, 'title' | 'type'> {
  /** 议题ID */
  issue_number: number
  /** 问题的名称 */
  title?: string | null
  /** 问题的内容 */
  body?: string | null
  /** 要分配给此问题的用户名（已弃用） */
  assignee?: string | null
  /** 问题的状态：open/closed */
  state?: 'open' | 'closed'
  /** 状态更改的原因 */
  state_reason?: 'completed' | 'not_planned' | 'reopened' | null
  /** 与此问题关联的里程碑 */
  milestone?: number | string | null
  /** 与此问题关联的标签数组 */
  labels?: string[]
  /** 要分配给此问题的用户名数组 */
  assignees?: string[]
  /** 问题类型 */
  type?: string | null
}

/** 更新议题响应类型 */
export type UpdateIssueResponseType = IssueInfoResponseType

/** 打开议题参数类型 */
export interface OpenIssueParamType extends RepoBaseParamType {
  /** 议题ID */
  issue_number: number
}
/** 打开议题响应类型 */
export type OpenIssueResponseType = IssueInfoResponseType

/** 关闭议题参数类型 */
export interface CloseIssueParamType extends OpenIssueParamType {
  /** 关闭原因 */
  state_reason?: IssueInfoResponseType['state_reason']
}
/** 关闭议题响应类型 */
export type CloseIssueResponseType = IssueInfoResponseType

/** 锁定议题参数类型 */
export interface LockIssueParamType extends RepoBaseParamType {
  /** 议题ID */
  issue_number: number
  /**
   * 锁定原因
   * 可以是以下之一：
   * - off-topic：锁定议题，因为该议题与仓库无关
   * - too heated：锁定议题，因为讨论过于激烈
   * - resolved：锁定议题，因为该议题已解决
   * - spam：锁定议题，因为该议题是垃圾邮件
   */
  lock_reason?: 'off-topic' | 'too heated' | 'resolved' | 'spam'
}
/** 锁定议题响应类型 */
export interface LockIssueResponseType {
  /** 锁定状态信息 */
  info: string
}

/** 解锁议题参数类型 */
export type UnLockIssueParamType = Omit<LockIssueParamType, 'lock_reason'>
/** 解锁议题响应类型 */
export type UnLockIssueResponseType = LockIssueResponseType
