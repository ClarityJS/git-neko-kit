import {
  formatParamType,
  RepoBaseParamType,
  RepoUrlParamType,
  ShaParamType
} from '@/types/platform/base'
import { UserInfoResponseType } from '@/types/platform/github/user'

export interface CommitInfoCommonParamType {
  /** 提交SHA */
  sha?: ShaParamType['sha'];
  /** 是否格式化消息和日期 */
  format?: formatParamType['format'];
}

/**
 * 提交信息基础参数类型
 * 用于获取提交信息的基础参数类型，包含仓库的拥有者、仓库名称、提交SHA等信息。
 * */
export type CommitInfoBaseParamType = RepoBaseParamType & CommitInfoCommonParamType

/**
 * 提交信息URL参数类型
 * 用于获取提交信息的URL参数类型，包含仓库的URL和提交SHA等信息。
 * */
export type CommitInfoUrlParamType = RepoUrlParamType & CommitInfoCommonParamType

/** Git提交用户信息 */
export interface GitUser extends Omit<UserInfoResponseType, 'company' | 'bio' | 'blog' | 'followers' | 'following'> {
  /** 日期字符串 */
  date: string;
}
/**
 * 验证信息类型
 * 这个只有GitHub平台返回
 */
// export interface Verification {
//   /** 是否已验证 */
//   verified: boolean;
//   /** 验证原因 */
//   reason: string;
//   /** 验证负载 */
//   payload: string | null;
//   /** 验证签名 */
//   signature: string | null;
//   /** 验证时间 */
//   verified_at: string | null;
// }

export interface Commit {
  /** 提交的URL */
  url: string;
  /** 提交作者信息 */
  author: GitUser;
  /** 提交者信息 */
  committer: GitUser;
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
   * @example "-  add new feature"
   */
  body?: string;
  /** 提交树信息 */
  tree: {
    /** 树对象的SHA */
    sha: string;
    /** 树对象的URL */
    url: string;
  };
  /** 验证信息 */
  // verification: Verification;
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
  /** gitcode不返回这个两个 */
  // /** 文件内容URL */
  // contents_url: string;
  // /** 文件差异补丁 */
  // patch: string;
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
}

/** 提交参数类型 */
export type CommitInfoParamType = CommitInfoBaseParamType | CommitInfoUrlParamType
/** 提交信息响应类型 */
export interface CommitInfoResponseType {
  /** 提交URL */
  url: string;
  /** 提交SHA */
  sha: string;
  /** HTML URL */
  html_url: string;
  /** 评论URL */
  comments_url: string;
  /** 提交信息 */
  commit: Commit;
  /** 父提交列表 */
  parents: ParentCommit[];
  /** 提交统计信息 */
  stats: CommitStats;
  /** 变更文件列表 */
  files: DiffEntry[];
}
