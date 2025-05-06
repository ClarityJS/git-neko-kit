import {
  formatParamType,
  RepoNameParamType,
  RepoOwnerParamType,
  RepoUrlParamType,
  UserNameParamType
} from '@/types/platform/github/base'
import { AccountBaseType } from '@/types/platform/github/user'
/** 仓库列表参数类型 */
export interface RepoListBaseParamType {
  /** 排序方式，可选created， updated， pushed， full_name， 默认为 full_name */
  sort?: 'created' | 'updated' | 'pushed' | 'full_name'
  /** 排序方式，可选asc， desc， 默认为 desc */
  direction?: 'asc' | 'desc'
  /** 每页数量 */
  per_page?: number
  /** 页码 */
  page?: number
}

/** 组织仓库列表参数类型 */
export interface OrgRepoListParmsType extends RepoListBaseParamType {
  /** 组织名称 */
  org: string
  /** 类型，可选all， public， private， forks， sources， member， 默认为 all */
  type?: 'all' | 'public' | 'private' | 'forks' | 'sources' | 'member'
  /** 是否格式化日期 */
  format?: formatParamType['format']
}

/** 用户仓库列表参数类型 */
export interface UserRepoListParamType extends RepoListBaseParamType {
  /** 用户名 */
  username: string
  /** 类型，可选all， owner， member， 默认为 all */
  type?: 'all' | 'owner' | 'member'
  /** 是否格式化日期 */
  format?: formatParamType['format']
}

export interface UserByTokenRepoListParamType extends RepoListBaseParamType {
  /** 仓库的可见性，可选all， public， private， 默认为 all */
  visibility?: 'all' | 'public' | 'private'
  /** 仓库的状态，可选all， public， private， 默认为 all */
  affiliation?: 'owner' | 'collaborator' | 'organization_member'
  /** 类型，可选all， owner， member， 默认为 all */
  type?: 'all' | 'owner' | 'member'
  /** 是否格式化日期 */
  format?: formatParamType['format']
}

/** 仓库信息响应类型 */
export interface RepoBaseParamType extends RepoOwnerParamType, RepoNameParamType { }

/** 仓库信息请求参数 */
export type RepoInfoParamType = (RepoBaseParamType | RepoUrlParamType) & {
  /** 是否格式化日期 */
  format?: formatParamType['format']
}

/** 拥有者信息 */
export interface Owner {
  /** * 仓库的拥有者 */
  name: string | null;
  /** * 仓库的拥有者的邮箱 */
  email: string | null;
  /** * 拥有者的 Base 用户名 */
  login: string;
  /** * 拥有者的 Base 用户 ID */
  id: number;
  /** * 拥有者的节点 ID */
  node_id: string;
  /** * 拥有者的头像 URL */
  avatar_url: string;
  /** * 拥有者的 Gravatar ID */
  gravatar_id: string | null;
  /** * 拥有者的 Base API URL */
  url: string;
  /** * 拥有者的 Base 主页 URL */
  html_url: string;
  /** * 拥有者的粉丝列表 URL */
  followers_url: string;
  /** * 拥有者的关注列表 URL */
  following_url: string;
  /** * 拥有者的 Gists URL */
  gists_url: string;
  /** * 拥有者的 starred 仓库列表 URL */
  starred_url: string;
  /** * 拥有者的订阅列表 URL */
  subscriptions_url: string;
  /** * 拥有者的组织 URL */
  organizations_url: string;
  /** * 拥有者的仓库列表 URL */
  repos_url: string;
  /** * 拥有者的事件 URL */
  events_url: string;
  /** * 拥有者的接收事件 URL */
  received_events_url: string;
  /** * 拥有者的类型，例如 'User' 或 'Organization' */
  type: string;
  /** * 用户查看类型，通常是 'public' */
  user_view_type: string;
  /** * 是否是站点管理员 */
  site_admin: boolean;
  /** * 用户标星时间 */
  starred_at: string;
}

/** 许可证信息 */
export interface License {
  /** * 许可证的键，例如 'mit' */
  key: string;
  /** * 许可证的名称，例如 'MIT License' */
  name: string;
  /** * 许可证的 SPDX ID，例如 'MIT' */
  spdx_id: string;
  /** * 许可证的 URL 地址 */
  url: string | null;
  /** * 许可证的 HTML URL */
  html_url?: string;
  /** * 许可证的节点 ID */
  node_id: string;
}

/** 仓库行为准则 */
export interface CodeOfConduct {
  /** * 行为准则的键 */
  key: string;
  /** * 行为准则的名称 */
  name: string;
  /** * 行为准则的 URL */
  url: string;
  /** * 行为准则的主体 */
  body?: string;
  /** * 行为准则的 HTML URL */
  html_url: string | null;
}

/** 仓库高级安全状态 */
export interface SecurityAnalysisAdvancedSecurity {
  /** * 高级安全状态 */
  status: string;
}

/** Dependabot 安全更新状态 */
export interface SecurityAnalysisDependabotSecurityUpdates {
  /** * Dependabot 安全更新状态 */
  status: string;
}

/** 秘钥扫描状态 */
export interface SecurityAnalysisSecretScanning {
  /** * 秘钥扫描状态 */
  status: string;
}

/** 秘钥扫描推送保护状态 */
export interface SecurityAnalysisSecretScanningPushProtection {
  /** * 秘钥扫描推送保护状态 */
  status: string;
}

/** 仓库安全和分析设置 */
export interface SecurityAndAnalysis {
  /** * 高级安全设置 */
  advanced_security?: SecurityAnalysisAdvancedSecurity;
  /** * Dependabot 安全更新设置 */
  dependabot_security_updates?: SecurityAnalysisDependabotSecurityUpdates;
  /** * 秘钥扫描设置 */
  secret_scanning?: SecurityAnalysisSecretScanning;
  /** * 秘钥扫描推送保护设置 */
  secret_scanning_push_protection?: SecurityAnalysisSecretScanningPushProtection;
}

/** 仓库的权限信息 */
export interface Permissions {
  /** * 管理员权限 */
  admin: boolean;
  /** * 推送权限 */
  push: boolean;
  /** * 拉取权限 */
  pull: boolean;
  /** * 维护权限 */
  maintain?: boolean;
  /** * 分类权限 */
  triage?: boolean;
}

/**
 * 合并提交标题的格式选项
 * - PR_TITLE: 使用 Pull Request 标题作为合并提交标题
 * - MERGE_MESSAGE: 使用默认的合并消息格式作为标题
 */
export type MergeCommitTitle = 'PR_TITLE' | 'MERGE_MESSAGE'

/**
 * 合并提交消息的格式选项
 * - PR_BODY: 使用 Pull Request 正文作为合并提交消息
 * - PR_TITLE: 使用 Pull Request 标题作为合并提交消息
 * - BLANK: 留空合并提交消息
 */
export type MergeCommitMessage = 'PR_BODY' | 'PR_TITLE' | 'BLANK'

/**
 * Squash 合并提交标题的格式选项
 * - PR_TITLE: 使用 Pull Request 标题作为 Squash 合并提交标题
 * - COMMIT_OR_PR_TITLE: 使用提交信息或 Pull Request 标题作为标题
 */
export type SquashMergeCommitTitle = 'PR_TITLE' | 'COMMIT_OR_PR_TITLE'

/**
 * Squash 合并提交消息的格式选项
 * - PR_BODY: 使用 Pull Request 正文作为 Squash 合并提交消息
 * - COMMIT_MESSAGES: 使用所有提交信息作为 Squash 合并提交消息
 * - BLANK: 留空 Squash 合并提交消息
 */
export type SquashMergeCommitMessage = 'PR_BODY' | 'COMMIT_MESSAGES' | 'BLANK'

/** * 仓库信息 */
export interface RepoInfoResponseType {
  /** * 仓库的唯一 ID */
  id: number;
  /** * 仓库的节点 ID */
  node_id: string;
  /** * 仓库的名称 */
  name: string;
  /** * 仓库的完整名称，包含用户名或组织名 */
  full_name: string;
  /** * 仓库拥有者的信息 */
  owner: Owner;
  /** * 仓库是否私有 */
  private: boolean;
  /** * 仓库的 HTML 页面 URL */
  html_url: string;
  /** * 仓库的描述信息 */
  description: string | null;
  /** * 仓库是否是 fork 仓库 */
  fork: boolean;
  /** * 仓库的 API URL */
  url: string;
  /** * 获取仓库 fork 列表的 URL */
  forks_url: string;
  /** * 获取仓库 keys 列表的 URL */
  keys_url: string;
  /** * 获取仓库协作者列表的 URL */
  collaborators_url: string;
  /** * 获取仓库团队信息的 URL */
  teams_url: string;
  /** * 获取仓库 hooks 列表的 URL */
  hooks_url: string;
  /** * 获取仓库 issue 事件列表的 URL */
  issue_events_url: string;
  /** * 获取仓库所有事件的 URL */
  events_url: string;
  /** * 获取仓库分配人信息的 URL */
  assignees_url: string;
  /** * 获取仓库分支列表的 URL */
  branches_url: string;
  /** * 获取仓库标签列表的 URL */
  tags_url: string;
  /** * 获取仓库 blob 信息的 URL */
  blobs_url: string;
  /** * 获取仓库 git 标签信息的 URL */
  git_tags_url: string;
  /** * 获取仓库 git 引用信息的 URL */
  git_refs_url: string;
  /** * 获取仓库 git 树信息的 URL */
  trees_url: string;
  /** * 获取仓库状态信息的 URL */
  statuses_url: string;
  /** * 获取仓库语言信息的 URL */
  languages_url: string;
  /** * 获取仓库 Stargazers 列表的 URL */
  stargazers_url: string;
  /** * 获取仓库贡献者列表的 URL */
  contributors_url: string;
  /** * 获取仓库订阅者列表的 URL */
  subscribers_url: string;
  /** * 获取仓库订阅信息的 URL */
  subscription_url: string;
  /** * 获取仓库提交历史的 URL */
  commits_url: string;
  /** * 获取仓库 git 提交历史的 URL */
  git_commits_url: string;
  /** * 获取仓库评论的 URL */
  comments_url: string;
  /** * 获取仓库问题评论的 URL */
  issue_comment_url: string;
  /** * 获取仓库文件内容的 URL */
  contents_url: string;
  /** * 获取仓库比较信息的 URL */
  compare_url: string;
  /** * 获取仓库合并信息的 URL */
  merges_url: string;
  /** * 获取仓库归档的 URL */
  archive_url: string;
  /** * 获取仓库下载的 URL */
  downloads_url: string;
  /** * 获取仓库所有 issues 的 URL */
  issues_url: string;
  /** * 获取仓库所有 pull requests 的 URL */
  pulls_url: string;
  /** * 获取仓库所有里程碑的 URL */
  milestones_url: string;
  /** * 获取仓库所有通知的 URL */
  notifications_url: string;
  /** * 获取仓库所有标签的 URL */
  labels_url: string;
  /** * 获取仓库所有发布版本的 URL */
  releases_url: string;
  /** * 获取仓库所有部署的 URL */
  deployments_url: string;
  /** * 仓库的创建时间 */
  created_at: string;
  /** * 仓库的更新时间 */
  updated_at: string;
  /** * 仓库的推送时间 */
  pushed_at: string;
  /** * 仓库的 Git URL */
  git_url: string;
  /** * 仓库的 SSH URL */
  ssh_url: string;
  /** * 仓库的克隆 URL */
  clone_url: string;
  /** * 仓库的 SVN URL */
  svn_url: string;
  /** * 仓库的主页 URL，若无则为 null */
  homepage: string | null;
  /** * 仓库的大小（单位：KB） */
  size: number;
  /** * 仓库的 Stargazer 数量 */
  stargazers_count: number;
  /** * 仓库的 Watcher 数量 */
  watchers_count: number;
  /** * 仓库的主编程语言 */
  language: string | null;
  /** * 是否开启 issue 功能 */
  has_issues: boolean;
  /** * 是否开启项目功能 */
  has_projects: boolean;
  /** * 是否允许下载 */
  has_downloads: boolean;
  /** * 是否开启 Wiki 功能 */
  has_wiki: boolean;
  /** * 是否开启 Pages 功能 */
  has_pages: boolean;
  /** * 是否开启讨论区功能 */
  has_discussions: boolean;
  /** * 仓库的 fork 数量 */
  forks_count: number;
  /** * 仓库的镜像 URL */
  mirror_url: string | null;
  /** * 仓库是否已归档 */
  archived: boolean;
  /** * 仓库是否被禁用 */
  disabled: boolean;
  /** * 开放的 issue 数量 */
  open_issues_count: number;
  /** * 仓库的许可证信息 */
  license: License | null;
  /** * 是否允许 fork 仓库 */
  allow_forking: boolean;
  /** * 是否是模板仓库 */
  is_template: boolean;
  /** * 是否要求提交时签署承诺 */
  web_commit_signoff_required: boolean;
  /** * 仓库的主题标签 */
  topics: string[];
  /** * 仓库的可见性（如 public, private） */
  visibility: string;
  /** * 仓库的 fork 数量 */
  forks: number;
  /** * 仓库的开放问题数量 */
  open_issues: number;
  /** * 仓库的 Watcher 数量 */
  watchers: number;
  /** * 仓库的默认分支 */
  default_branch: string;
  /** *
   * 仓库的主分支
   * 该属性已被弃用，在部分旧版本的 API 中可能存在，
   * @deprecated 已弃用，使用 default_branch 代替
   * */
  master_branch?: string;
  /** * 临时克隆令牌 */
  temp_clone_token: string | null;
  /** * 仓库的网络计数 */
  network_count: number;
  /** * 仓库的订阅者数量 */
  subscribers_count: number;
  /** * 仓库的组织信息，如果属于组织的话 */
  organization?: Owner | null;
  /** * 模板仓库信息，如果是从模板创建的话 */
  template_repository: RepoInfoResponseType | null;
  /** * 父仓库信息，如果是 fork 的话 */
  parent: RepoInfoResponseType | null;
  /** * 源仓库信息，如果是 fork 的话 */
  source: RepoInfoResponseType | null;
  /** * 是否允许 rebase 合并 */
  allow_rebase_merge?: boolean;
  /** * 是否允许 squash 合并 */
  allow_squash_merge?: boolean;
  /** * 是否允许自动合并 */
  allow_auto_merge?: boolean;
  /** * 合并后是否删除分支 */
  delete_branch_on_merge?: boolean;
  /** * 是否允许合并提交 */
  allow_merge_commit?: boolean;
  /** * 是否允许更新分支 */
  allow_update_branch?: boolean;
  /** * 是否允许匿名 Git 访问 */
  anonymous_access_enabled?: boolean;
  /** * squash 合并提交标题的格式 */
  squash_merge_commit_title?: SquashMergeCommitTitle;
  /** * squash 合并提交消息的格式 */
  squash_merge_commit_message?: SquashMergeCommitMessage;
  /** * 合并提交标题的格式 */
  merge_commit_title?: MergeCommitTitle;
  /** * 合并提交消息的格式 */
  merge_commit_message?: MergeCommitMessage;
  /** * 行为准则信息 */
  code_of_conduct?: CodeOfConduct | null;
  /** * 安全和分析设置 */
  security_and_analysis?: SecurityAndAnalysis | null;
  /** * 权限设置 */
  permissions?: Permissions;
  /** * 自定义属性 */
  custom_properties?: Record<string, any>;
}

/**
 * 组织仓库列表类型
 * 该类型包含了多个仓库的信息，每个仓库都有自己的详细信息。
 */
export type OrgRepoListType = RepoInfoResponseType[]

/** 用户仓库列表类型 */
export type UserRepoListType = Array<RepoInfoResponseType & {
  /** * 仓库的角色名称 */
  role_name?: string;
}>

export interface RepoVisibilityResponseType {
  /** * 仓库的可见性 */
  visibility: string;
}

export interface RepoDefaultBranchResponseType {
  /** * 仓库的默认分支名称 */
  default_branch: string;
}

/** 协作者参数类型 */
export type CollaboratorParamType = RepoInfoParamType & UserNameParamType & {
  /**
   * 协作者权限 ,可选 pull，triage, push, maintain, admin，默认pull
   * pull - 只读访问，协作者可以查看仓库内容。
   * triage - 允许管理议题和拉取请求，包括标记、分配和修改状态。
   * push - 允许推送代码到仓库分支，同时拥有 pull 权限。
   * maintain - 允许管理仓库中的代码和议题，但不能更改仓库设置。
   * admin - 拥有仓库的完全控制权，包括更改设置和删除仓库。
   */
  permission?: 'pull' | 'triage' | 'push' | 'maintain' | 'admin';
}

/** 邀请协作者响应类型 */
export interface AddCollaboratorResponseType {
  /** 邀请唯一id */
  id: number;
  /** 邀请节点id */
  node_id: string;
  /** 邀请仓库信息 */
  repository: RepoInfoResponseType;
}

/** 协作者列表参数类型 */
export type CollaboratorListParamType = RepoInfoParamType & {
  /**
   * 筛选按隶属关系返回的协作者
   * outside - 列出所有外部协作者，包括仓库成员和外部 collaborator。
   * direct - 列出仓库成员。
   * all - 列出仓库成员和外部 collaborator。
  */
  affiliation?: 'outside' | 'direct' | 'all';
  /**
   * 筛选按权限关系返回的协作者
   * pull - 只读访问，协作者可以查看仓库内容。
   * triage - 允许管理议题和拉取请求，包括标记、分配和修改状态。
   * push - 允许推送代码到仓库分支，同时拥有 pull 权限。
   * maintain - 允许管理仓库中的代码和议题，但不能更改仓库设置。
   * admin - 拥有仓库的完全控制权，包括更改设置和删除仓库。
   */
  permission?: 'pull' | 'triage' | 'push' | 'maintain' | 'admin';
  /** 每页数量 */
  per_page?: number;
  /** 页码 */
  page?: number;
}

/** 协作者信息类型 */
export interface CollaboratorInfo extends AccountBaseType {
  /** 协作者邮箱 */
  email: string | null;
  /** 协作者姓名 */
  name: string | null;
  /** 粉丝URL */
  followers_url: string;
  /** 关注URL */
  following_url: string;
  /** Gists URL */
  gists_url: string;
  /** 标星URL */
  starred_url: string;
  /** 订阅URL */
  subscriptions_url: string;
  /** 组织URL */
  organizations_url: string;
  /** 仓库URL */
  repos_url: string;
  /** 事件URL */
  events_url: string;
  /** 接收事件URL */
  received_events_url: string;
  /** 权限设置 */
  permissions: {
    /** 拉取权限 */
    pull: boolean;
    /** 分类权限 */
    triage: boolean;
    /** 推送权限 */
    push: boolean;
    /** 维护权限 */
    maintain: boolean;
    /** 管理权限 */
    admin: boolean;
  };
  /** 角色名称 */
  role_name: string;
}

/** 协作者列表响应类型 */
export type CollaboratorListResponseType = CollaboratorInfo[]

/** 移除协作者响应类型 */
export interface RemoveCollaboratorResponseType {
  /** 状态信息 */
  info: string;
}
