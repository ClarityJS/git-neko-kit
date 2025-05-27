import { AccessTokenType } from '@/types/platform/base'
import { UserInfoResponseType } from '@/types/platform/github/user'

export type AppUser = Omit<UserInfoResponseType, 'bio' | 'blog' | 'followers' | 'following' | 'public_repos'>

/**
 * 定义 Base 应用所需的权限
 */
export interface AppPermissions {
  /** 对仓库内容的权限（例如读取、写入） */
  contents: string;
  /** 对部署的权限（例如读取、写入） */
  deployments: string;
  /** 对议题的权限（例如写） */
  issues: string;
  /** 对检查的权限 */
  checks: string;
  /** 对元数据的权限（例如读取） */
  metadata: string;
}
export interface AppInfoParamType {
  /**
   * 应用的标识符
   * 是https://github.com/settings/apps/:app_slug的
   * */
  app_slug: string;
  /** 访问令牌 */
  access_token?: AccessTokenType['access_token'];
}
/**
 * 应用的详细信息
 */
export interface AppInfoResponseType {
  /** 应用的唯一 ID */
  id: number;
  /** 应用的名称 */
  name: string;
  /** 应用的 Client ID */
  client_id: string;
  /** 应用的标识符（slug） */
  slug: string;
  /** 应用所有者的信息 */
  owner: AppUser;
  /** 应用的描述 */
  description: string;
  /** 应用的外部 URL */
  external_url: string;
  /** 应用的 Base 页面 URL */
  html_url: string;
  /** 应用所需的权限 */
  permissions: AppPermissions;
  /** 应用监听的事件列表 */
  events: string[];
  /** 应用创建时间的时间戳 */
  created_at: string;
  /** 应用最后更新时间的时间戳 */
  updated_at: string;
}

/** GitHub应用安装仓库信息响应类型 */
export interface AppRepoInfoResponseType {
  /** 安装的唯一ID */
  id: number;
  /** 安装页面URL */
  html_url: string;
  /** 应用ID */
  app_id: number;
  /** 应用标识符 */
  app_slug: string;
  /** 目标ID（用户或组织的ID） */
  target_id: number;
  /** 目标类型（如'Organization'） */
  target_type: string;
  /** 安装的账户信息，可以是用户或企业 */
  account: AppUser;
  /** 仓库选择类型 */
  repository_selection: 'all' | 'selected';
  /** 访问令牌URL */
  access_tokens_url: string;
  /** 仓库列表URL */
  repositories_url: string;
  /** 权限配置 */
  permissions: AppPermissions;
  /** 事件列表 */
  events: string[];
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
}
