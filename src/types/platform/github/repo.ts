import {
  formatParamType,
  RepoBaseParamType,
  RepoOwnerParamType,
  UserNameParamType
} from '@/types/platform/base'
import { UserInfoResponseType } from '@/types/platform/github/user'

/** 仓库所有者参数类型 */
export type RepoUser = Omit<UserInfoResponseType, 'followers' | 'following' | 'blog' | 'bio'>

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

/** 仓库信息请求参数 */
export type RepoInfoParamType = RepoBaseParamType & {
  /** 是否格式化日期 */
  format?: formatParamType['format']
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
  /** * 仓库的名称 */
  name: string;
  /** * 仓库的完整名称，包含用户名或组织名 */
  full_name: string;
  /** * 仓库拥有者的信息 */
  owner: RepoUser;
  /** 仓库是否公开 */
  public: boolean;
  /** * 仓库是否私有 */
  private: boolean;
  /** * 仓库的可见性 */
  visibility: 'public' | 'private';
  /** * 仓库是否是 fork 仓库 */
  fork: boolean;
  /** * 仓库是否已归档 */
  archived: boolean;
  /** * 仓库是否被禁用 */
  disabled: boolean;
  /** * 仓库的 HTML 页面 URL */
  html_url: string;
  /** * 仓库的描述信息 */
  description: string | null;
  /** * 仓库的 Stargazer 数量 */
  stargazers_count: number;
  /** * 仓库的 Watcher 数量 */
  watchers_count: number;
  /** * 仓库的主编程语言 */
  language: string | null;
  /** * 仓库的 fork 数量 */
  forks_count: number;
  /** * 开放的 issue 数量 */
  open_issues_count: number;
  /** * 仓库的默认分支 */
  default_branch: string;
  /** * 仓库的创建时间 */
  created_at: string;
  /** * 仓库的更新时间 */
  updated_at: string;
  /** * 仓库的推送时间 */
  pushed_at: string;
}

/** 组织仓库列表参数类型 */
export interface OrgRepoListParmType extends RepoListBaseParamType {
  /** 组织名称 */
  org: string
  /** 类型，可选all， public， private， forks， sources， member， 默认为 all */
  type?: 'all' | 'public' | 'private' | 'forks' | 'sources' | 'member'
  /** 是否格式化日期 */
  format?: formatParamType['format']
}
/**
 * 组织仓库列表响应类型
 * 该类型包含了多个仓库的信息，每个仓库都有自己的详细信息。
 */
export type OrgRepoListResponseType = RepoInfoResponseType[]

/** 创建组织仓库请求参数 */
export interface OrgRepoCreateParamType extends RepoOwnerParamType {
  /** 仓库名称 */
  name: string;
  /** 仓库描述 */
  description?: string;
  /** 仓库主页 */
  homepage?: string;
  /** 仓库可见性 */
  visibility?: 'public' | 'private';
  /** 是否开启议题issue */
  has_issues?: boolean;
  /** 是否开启项目project */
  has_projects?: boolean;
  /** 是否开启wiki */
  has_wiki?: boolean;
  /** 是否开启下载 */
  has_downloads?: boolean;
  /** 是否设置为模板仓库 */
  is_template?: boolean;
  /** 仓库团队id, 这仅在组织中创建仓库时有效。 */
  team_id?: number;
  /** 仓库自动初始化 */
  auto_init?: boolean;
  /** 仓库的gitignore模板 */
  gitignore_template?: string;
  /** 仓库的license模板 */
  license_template?: string;
  /** 是否允许合并提交 */
  allow_squash_merge?: boolean;
  /** 是否允许变基合并提交 */
  allow_merge_commit?: boolean;
  /** 是否允许重新基础合并提交 */
  allow_rebase_merge?: boolean;
  /** 是否允许自动合并 */
  allow_auto_merge?: boolean;
  /** 是否删除分支后合并 */
  delete_branch_on_merge?: boolean;
  /** 合并提交标题格式 */
  squash_merge_commit_title?: 'PR_TITLE' | 'COMMIT_OR_PR_TITLE';
  /** 合并提交消息格式 */
  squash_merge_commit_message?: 'PR_BODY' | 'COMMIT_MESSAGES' | 'BLANK';
  /** 合并提交标题格式 */
  merge_commit_title?: 'PR_TITLE' | 'MERGE_MESSAGE';
  /** 合并提交消息格式 */
  merge_commit_message?: 'PR_BODY' | 'COMMIT_MESSAGES' | 'BLANK';
  /** 新存储库的自定义属性 */
  custom_properties?: { [key: string]: string };
  /** 是否格式化日期 */
  format?: formatParamType['format']
}
/** 创建组织仓库响应类型 */
export type OrgRepoCreateResponseType = RepoInfoResponseType

/** 用户仓库列表参数类型 */
export interface UserRepoListParamType extends RepoListBaseParamType {
  /** 用户名 */
  username: string
  /** 类型，可选all， owner， member， 默认为 all */
  type?: 'all' | 'owner' | 'member'
  /** 是否格式化日期 */
  format?: formatParamType['format']
}
/** 用户仓库列表类型 */
export type UserRepoListType = Array<RepoInfoResponseType & {
  /** * 仓库的角色名称 */
  role_name?: string;
}>

/** 仓库语言信息类型 */
export interface LanguageInfo {
  /** 编程语言名称 */
  language: string;
  /** 语言对应的颜色 */
  color: string;
  /** 在仓库中的占比（百分比） */
  percent: number;
  /** 该语言的代码字节数 */
  bytes: number;
}

/** 仓库语言列表参数类型 */
export type RepoLanguagesListParamType = RepoBaseParamType
/** 仓库语言列表类型 */
export interface RepoLanguagesListResponseType {
  /** 仓库的语言统计信息列表 */
  languages: LanguageInfo[];
}

/** 仓库文件列表参数类型 */

/** 仓库可见性响应类型 */
export interface RepoVisibilityResponseType {
  /** * 仓库的可见性 */
  visibility: RepoInfoResponseType['visibility'];
}

/** 仓库默认分支响应类型 */
export interface RepoDefaultBranchResponseType {
  /** * 仓库的默认分支名称 */
  default_branch: RepoInfoResponseType['default_branch'];
}

/** 仓库主要语言响应类型 */
export interface RepoMainLanguageResponseType {
  /** * 仓库的主要语言 */
  language: RepoInfoResponseType['language'];
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
  permission?: string;
  /** 是否格式化日期 */
  format?: formatParamType['format']
}

/** 邀请协作者响应类型 */
export interface AddCollaboratorResponseType {
  /** 被邀请者ID */
  id: number;
  /** 被邀请者用户名 */
  login: string;
  /** 被邀请者的别名 */
  name: string | null;
  /** 被邀请者的头像URL */
  avatar_url: string;
  /** 仓库的地址 */
  html_url: string;
  /** 被邀请者的权限 */
  permissions: string;
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
export interface CollaboratorInfoResponseType {
  /** 协作者id */
  id: number;
  /** 协作者登录名 */
  login: string;
  /** 头像URL */
  avatar_url: string;
  /** 协作者邮箱 */
  email: string | null;
  /** 协作者姓名 */
  name: string | null;
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
export type CollaboratorListResponseType = CollaboratorInfoResponseType[]

/** 移除协作者参数类型 */
export type RemoveCollaboratorParamType = RepoBaseParamType & UserNameParamType
/** 移除协作者响应类型 */
export interface RemoveCollaboratorResponseType {
  /** 状态信息 */
  info: string;
}
