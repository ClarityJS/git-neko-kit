/**
 * 代表 GitHub 应用所有者的详细信息
 */
interface Owner {
  /** 用户的登录名 */
  login: string;

  /** 用户的唯一 ID */
  id: number;

  /** 用户的唯一 Node ID */
  node_id: string;

  /** 用户的头像 URL */
  avatar_url: string;

  /** 用户的 Gravatar ID（如果有） */
  gravatar_id: string;

  /** 用户的 API URL */
  url: string;

  /** 用户的 HTML URL */
  html_url: string;

  /** 用户的粉丝列表 URL */
  followers_url: string;

  /** 用户的关注列表 URL */
  following_url: string;

  /** 用户的 Gist 列表 URL */
  gists_url: string;

  /** 用户的收藏仓库列表 URL */
  starred_url: string;

  /** 用户的订阅列表 URL */
  subscriptions_url: string;

  /** 用户所在组织的列表 URL */
  organizations_url: string;

  /** 用户的仓库列表 URL */
  repos_url: string;

  /** 用户的事件列表 URL */
  events_url: string;

  /** 用户接收到的事件列表 URL */
  received_events_url: string;

  /** 用户类型（例如 "Organization" 或 "User"） */
  type: string;

  /** 用户的视图类型（例如公开或私密） */
  user_view_type: string;

  /** 是否为站点管理员 */
  site_admin: boolean;
}

/**
 * 定义 GitHub 应用所需的权限
 */
interface Permissions {
  /** 对仓库内容的权限（例如读取、写入） */
  contents: string;

  /** 对部署的权限（例如读取、写入） */
  deployments: string;

  /** 对问题的权限（例如写） */
  issues: string;

  /** 对合并队列的权限（例如写） */
  merge_queues: string;

  /** 对元数据的权限（例如读取） */
  metadata: string;

  /** 对拉取请求的权限（例如写） */
  pull_requests: string;

  /** 对星标仓库的权限（例如写） */
  starring: string;
}

/**
 * 定义 GitHub 应用的详细信息
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

  /** 应用的 GitHub 页面 URL */
  html_url: string;

  /** 应用创建时间的时间戳 */
  created_at: string;

  /** 应用最后更新时间的时间戳 */
  updated_at: string;

  /** 应用所需的权限 */
  permissions: Permissions;

  /** 应用监听的事件列表 */
  events: string[];

  /** 应用的安装数量 */
  installations_count: number;
}
