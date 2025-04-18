import { RepoUrlParamType } from '@/types/platform/github/base'
import { RepoBaseParamType } from '@/types/platform/github/repo'
import { UserResponseType } from '@/types/platform/github/user'

export type issueListParamType = (RepoBaseParamType | RepoUrlParamType) & {
  /** 里程碑，可以是字符串或数字 */
  milestone?: string | number,
  /** 问题状态：全部/打开/关闭 */
  state?: 'all' | 'open' | 'closed'
  /** 指派人用户名 */
  assignee?: string,
  /** 问题类型 */
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
  /** 筛选此时间之后的问题 */
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
  creator: UserResponseType | null;
  /** 开放问题数 */
  open_issues: number;
  /** 关闭问题数 */
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

/** 议题列表响应类型 */
export interface IssueListResponseType {
  /** 问题ID */
  id: number;
  /** 节点ID */
  node_id: string;
  /** 问题API URL */
  url: string;
  /** 仓库API URL */
  repository_url: string;
  /** 标签URL */
  labels_url: string;
  /** 评论URL */
  comments_url: string;
  /** 事件URL */
  events_url: string;
  /** 问题HTML页面URL */
  html_url: string;
  /** 问题编号 */
  number: number;
  /** 问题状态: open/closed */
  state: string;
  /** 状态原因: completed/reopened/not_planned/null */
  state_reason: string | null;
  /** 问题标题 */
  title: string;
  /** 问题正文内容 */
  body: string | null;
  /** 问题创建者用户信息 */
  user: UserResponseType
  /** 问题标签 */
  labels: Array<IssueLabelType | string>;
  /** 问题指派人 */
  assignee: UserResponseType | null;
  /** 问题所有指派人列表 */
  assignees: Array<UserResponseType> | null;
  /** 问题所属里程碑 */
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
  closed_by?: UserResponseType | null;
}
