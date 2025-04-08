export interface UserParamType {
  /** 用户名 */
  username: string;
}

interface UserBase {
  /** 用户登录名 */
  login: string;
  /** 用户ID */
  id: number;
  /** 用户节点ID */
  node_id: string;
  /** 用户头像URL */
  avatar_url: string;
  /** Gravatar ID */
  gravatar_id: string | null;
  /** 用户API URL */
  url: string;
  /** 用户主页URL */
  html_url: string;
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
  /** 用户类型 */
  type: string;
  /** 是否是站点管理员 */
  site_admin: boolean;
}

/** GitHub用户详细信息 */
export interface UserResponseType extends UserBase {
  /** 用户全名 */
  name: string | null;
  /** 公司 */
  company: string | null;
  /** 博客URL */
  blog: string | null;
  /** 所在地 */
  location: string | null;
  /** 邮箱 */
  email: string | null;
  /** 通知邮箱 */
  notification_email?: string | null;
  /** 是否可雇佣 */
  hireable: boolean | null;
  /** 个人简介 */
  bio: string | null;
  /** Twitter用户名 */
  twitter_username: string | null;
  /** 公开仓库数量 */
  public_repos: number;
  /** 公开Gists数量 */
  public_gists: number;
  /** 粉丝数 */
  followers: number;
  /** 关注数 */
  following: number;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
  /** 私有Gists数量 */
  private_gists?: number;
  /** 总私有仓库数 */
  total_private_repos?: number;
  /** 拥有的私有仓库数 */
  owned_private_repos?: number;
  /** 磁盘使用量(单位KB) */
  disk_usage?: number;
  /** 协作者数量 */
  collaborators?: number;
  /** 是否启用双重认证 */
  two_factor_authentication?: boolean;
  /** 订阅计划 */
  plan?: {
    /** 协作者数量 */
    collaborators: number;
    /** 计划名称 */
    name: string;
    /** 存储空间 */
    space: number;
    /** 私有仓库数量 */
    private_repos: number;
  };
  /** 是否是商业增强版 */
  business_plus?: boolean;
  /** LDAP DN */
  ldap_dn?: string;
}
