export interface AccountBaseType {
  /** 账号登录名 */
  login: string;
  /** 账号ID */
  id: number;
  /** 账号视图类型 */
  user_view_type: string;
  /** 账号节点ID */
  node_id: string;
  /** 账号头像URL */
  avatar_url: string;
  /** Gravatar ID */
  gravatar_id: string | null;
  /** 用户API URL */
  url: string;
  /** 账号主页URL */
  html_url: string;
  /** 仓库列表URL */
  repos_url: string;
  /** 账号类型 */
  type: string;
  /** 是否是站点管理员 */
  site_admin: boolean;
}

export interface UserPlanType {
  /** 协作者数量 */
  collaborators: number;
  /** 计划名称 */
  name: string;
  /** 存储空间 */
  space: number;
  /** 私有仓库数量 */
  private_repos: number;

}

/** GitHub用户详细信息 */
export interface UserInfoResponseType extends AccountBaseType {
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
  /** 订阅列表URL */
  subscriptions_url: string;
  /** 组织列表URL */
  organizations_url: string;
  /** 事件列表URL */
  events_url: string;
  /** 接收事件列表URL */
  received_events_url: string;
  /** 粉丝列表URL */
  followers_url: string;
  /** 关注列表URL */
  following_url: string;
  /** Gists列表URL */
  gists_url: string;
  /** 星标仓库URL */
  starred_url: string;
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
  plan?: UserPlanType
  /** 是否是商业增强版 */
  business_plus?: boolean;
  /** LDAP DN */
  ldap_dn?: string;
}
