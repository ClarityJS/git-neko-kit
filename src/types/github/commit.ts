import { RepoNameParamType, RepoOwnerParamType, RepoUrlParamType, ShaParamType } from '@/types/github/base'
import { UserBaseType } from '@/types/github/user'

export interface CommitInfoCommonParamType {
  /** 提交SHA */
  sha?: ShaParamType['sha'];
  /** 是否格式化消息 */
  format: boolean;
}

/**
 * 提交信息基础参数类型
 * 用于获取提交信息的基础参数类型，包含仓库的拥有者、仓库名称、提交SHA等信息。
 * */
export interface CommitInfoBaseParamType extends RepoOwnerParamType, RepoNameParamType, CommitInfoCommonParamType {}

/**
 * 提交信息URL参数类型
 * 用于获取提交信息的URL参数类型，包含仓库的URL和提交SHA等信息。
 * */
export interface CommitInfoUrlParamType extends RepoUrlParamType, CommitInfoCommonParamType {}

/** 提交参数类型 */
export type CommitInfoParamType = CommitInfoBaseParamType | CommitInfoUrlParamType
export interface GitUser {
  /** 用户姓名 */
  name: string | null;
  /** 用户邮箱 */
  email: string | null;
  /** 日期字符串 */
  date: string;
}

export interface Verification {
  /** 是否已验证 */
  verified: boolean;
  /** 验证原因 */
  reason: string;
  /** 验证负载 */
  payload: string | null;
  /** 验证签名 */
  signature: string | null;
  /** 验证时间 */
  verified_at: string | null;
}

export interface Commit {
  /** 提交的URL */
  url: string;
  /** 提交作者信息 */
  author: GitUser | null;
  /** 提交者信息 */
  committer: GitUser | null;
  /** 提交信息 */
  message: string;
  /**
   * 提交标题
   * 仅在开启格式化消息时返回
   * @example "feat: add new feature"
   */
  title?: string;
  /** 提交正文
   * 仅在开启格式化消息时返回
   * @example "This is a new feature that adds a new feature to the application."
   */
  body?: string;
  /** 评论数量 */
  comment_count: number;
  /** 提交树信息 */
  tree: {
    /** 树对象的SHA */
    sha: string;
    /** 树对象的URL */
    url: string;
  };
  /** 验证信息 */
  verification: Verification;
}

export interface DiffEntry {
  /** 文件SHA */
  sha: string;
  /** 文件名 */
  filename: string;
  /** 文件状态 */
  status: 'added' | 'removed' | 'modified' | 'renamed' | 'copied' | 'changed' | 'unchanged';
  /** 新增行数 */
  additions: number;
  /** 删除行数 */
  deletions: number;
  /** 总变更行数 */
  changes: number;
  /** 文件blob URL */
  blob_url: string;
  /** 文件原始URL */
  raw_url: string;
  /** 文件内容URL */
  contents_url: string;
  /** 文件差异补丁 */
  patch: string;
  /** 之前的文件名 */
  previous_filename: string | null;
}

export interface CommitStats {
  /** 新增行数 */
  additions: number;
  /** 删除行数 */
  deletions: number;
  /** 总变更行数 */
  total: number;
}

export interface ParentCommit {
  /** 父提交SHA */
  sha: string;
  /** 父提交URL */
  url: string;
  /** 父提交HTML URL */
  html_url: string;
}

export interface CommitInfoResponseType {
  /** 提交URL */
  url: string;
  /** 提交SHA */
  sha: string;
  /** 节点ID */
  node_id: string;
  /** HTML URL */
  html_url: string;
  /** 评论URL */
  comments_url: string;
  /** 提交信息 */
  commit: Commit;
  /** 提交作者 */
  author: UserBaseType | null;
  /** 提交者 */
  committer: UserBaseType | null;
  /** 父提交列表 */
  parents: ParentCommit[];
  /** 提交统计信息 */
  stats?: CommitStats;
  /** 变更文件列表 */
  files?: DiffEntry[];
}
