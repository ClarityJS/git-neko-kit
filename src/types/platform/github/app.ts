import { Owner } from '@/types/platform/github/repo'

/**
 * 定义 Base 应用所需的权限
 */
export interface GitHubAppPermissions {
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

/**
 * 定义 Base 应用的详细信息
 */
export interface GitHubAppInfoType {
  /** 应用的唯一 ID */
  id: number;

  /** 应用的 Client ID */
  client_id: string;

  /** 应用的标识符（slug） */
  slug: string;

  /** 应用的唯一 Node ID */
  node_id: string;

  /** 应用所有者的信息 */
  owner: Owner;

  /** 应用的名称 */
  name: string;

  /** 应用的描述 */
  description: string;

  /** 应用的外部 URL */
  external_url: string;

  /** 应用的 Base 页面 URL */
  html_url: string;

  /** 应用创建时间的时间戳 */
  created_at: string;

  /** 应用最后更新时间的时间戳 */
  updated_at: string;

  /** 应用所需的权限 */
  permissions: GitHubAppPermissions;

  /** 应用监听的事件列表 */
  events: string[];

  /** 应用的安装数量 */
  installations_count: number;
}

/** GitHub 账户基础信息类型 */
export interface GitHubAccountBaseType {
  /** 账户名称 */
  name: string | null;
  /** 账户邮箱 */
  email: string | null;
  /** 账户登录名 */
  login: string;
  /** 账户ID */
  id: number;
  /** 账户节点ID */
  node_id: string;
  /** 账户头像URL */
  avatar_url: string;
  /** Gravatar ID */
  gravatar_id: string | null;
  /** API URL */
  url: string;
  /** 主页URL */
  html_url: string;
}

/** GitHub 账户完整信息类型 */
export interface GitHubAccountType extends GitHubAccountBaseType {
  /** 粉丝列表URL */
  followers_url: string;
  /** 关注列表URL */
  following_url: string;
  /** Gists列表URL */
  gists_url: string;
  /** 星标仓库URL */
  starred_url: string;
  /** 订阅列表URL */
  subscriptions_url: string;
  /** 组织列表URL */
  organizations_url: string;
  /** 仓库列表URL */
  repos_url: string;
  /** 事件列表URL */
  events_url: string;
  /** 接收事件列表URL */
  received_events_url: string;
  /** 账户类型 */
  type: string;
  /** 是否是站点管理员 */
  site_admin: boolean;
}

/** GitHub 应用权限类型 */
export interface GitHubAppDetailedPermissions {
  /** GitHub Actions工作流权限 */
  actions?: 'read' | 'write';
  /** 仓库管理权限 */
  administration?: 'read' | 'write';
  /** 代码检查权限 */
  checks?: 'read' | 'write';
  /** Codespaces权限 */
  codespaces?: 'read' | 'write';
  /** 仓库内容权限 */
  contents?: 'read' | 'write';
  /** Dependabot密钥权限 */
  dependabot_secrets?: 'read' | 'write';
  /** 部署权限 */
  deployments?: 'read' | 'write';
  /** 环境权限 */
  environments?: 'read' | 'write';
  /** Issues权限 */
  issues?: 'read' | 'write';
  /** 元数据权限 */
  metadata?: 'read' | 'write';
  /** 包管理权限 */
  packages?: 'read' | 'write';
  /** Pages权限 */
  pages?: 'read' | 'write';
  /** Pull Requests权限 */
  pull_requests?: 'read' | 'write';
  /** 仓库自定义属性权限 */
  repository_custom_properties?: 'read' | 'write';
  /** Webhook权限 */
  repository_hooks?: 'read' | 'write';
  /** 仓库项目权限 */
  repository_projects?: 'read' | 'write' | 'admin';
  /** 密钥扫描警报权限 */
  secret_scanning_alerts?: 'read' | 'write';
  /** 密钥管理权限 */
  secrets?: 'read' | 'write';
  /** 安全事件权限 */
  security_events?: 'read' | 'write';
  /** 单文件权限 */
  single_file?: 'read' | 'write';
  /** 状态权限 */
  statuses?: 'read' | 'write';
  /** 漏洞警报权限 */
  vulnerability_alerts?: 'read' | 'write';
  /** 工作流文件权限 */
  workflows?: 'write';
}

/** GitHub应用安装仓库信息响应类型 */
export interface GitHubAppRepoInfoResponseType {
  /** 安装的唯一ID */
  id: number;
  /** 安装的账户信息，可以是用户或企业 */
  account: GitHubAccountType | null;
  /** 仓库选择类型 */
  repository_selection: 'all' | 'selected';
  /** 访问令牌URL */
  access_tokens_url: string;
  /** 仓库列表URL */
  repositories_url: string;
  /** 安装页面URL */
  html_url: string;
  /** 应用ID */
  app_id: number;
  /** 目标ID（用户或组织的ID） */
  target_id: number;
  /** 目标类型（如'Organization'） */
  target_type: string;
  /** 权限配置 */
  permissions: GitHubAppDetailedPermissions;
  /** 事件列表 */
  events: string[];
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
  /** 单文件名称 */
  single_file_name: string | null;
  /** 是否有多个单文件 */
  has_multiple_single_files: boolean;
  /** 单文件路径列表 */
  single_file_paths: string[];
  /** 应用标识符 */
  app_slug: string;
  /** 暂停操作的用户信息 */
  suspended_by: GitHubAccountBaseType | null;
}
