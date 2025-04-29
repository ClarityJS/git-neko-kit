import { formatParamType, RepoOwnerParamType } from '@/types/platform/github/base'
import { AccountBaseType } from '@/types/platform/github/user'

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
  format: formatParamType['format']
}

/**
 * 组织的基本信息
 */
export interface OrganizationBaseType extends AccountBaseType {
  /** 组织的名称 */
  name?: string;
  /** 组织的描述 */
  description: string | null;
  /** 组织的公司名称 */
  company?: string;
  /** 组织的博客 URL */
  blog: string | null;
  /** 组织的所在地 */
  location?: string;
  /** 组织的邮箱地址 */
  email?: string;
  /** 组织的 Twitter 用户名 */
  twitter_username?: string | null;
  /** 组织是否已验证 */
  is_verified?: boolean;
  /** 账户类型（例如 "Organization"） */
  type: string;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
  /** 归档时间 */
  archived_at: string | null;
}
/**
 * 组织的计划信息
 */
export interface OrganizationPlanType {
  name: string;
  space: number;
  private_repos: number;
  filled_seats?: number;
  seats?: number;
}

/**
 * 组织的 API URL 信息
 */
export interface OrganizationUrlType {
  /** 组织的 Webhook 列表 API URL */
  hooks_url: string;
  /** 组织的 Issues 列表 API URL */
  issues_url: string;
  /** 组织的成员列表 API URL 模板 */
  members_url: string;
  /** 组织的公开成员列表 API URL 模板 */
  public_members_url: string;
}

/**
 * 组织的仓库和 Gists 信息
 */
export interface OrganizationRepositoryAndGistsType {
  /** 组织的公开仓库数量 */
  public_repos: number;
  /** 组织的公开 Gists 数量 */
  public_gists: number;
  /** 组织的总私有仓库数量 */
  total_private_repos?: number;
  /** 组织拥有的私有仓库数量 */
  owned_private_repos?: number;
  /** 组织的私有 Gists 数量 */
  private_gists?: number | null;
  /** 组织的磁盘使用量 */
  disk_usage?: number | null;
}

/**
 * 组织的成员信息
 */
export interface OrganizationMemberType {
  /** 组织的关注者数量 */
  followers: number;
  /** 组织关注的数量 */
  following: number;
  /** 私有仓库中的协作者数量 */
  collaborators?: number | null;
}

/**
 * 组织的权限和配置信息
 */
export interface OrganizationPermissionsAndConfigType {
  /** 组织是否启用了组织项目 */
  has_organization_projects: boolean;
  /** 组织是否启用了仓库项目 */
  has_repository_projects: boolean;
  /** 组织的账单邮箱地址 */
  billing_email?: string | null;
  /** 组织的计划信息 */
  plan?: OrganizationPlanType;
  /** 默认的仓库权限 */
  default_repository_permission?: string | null;
  /** 成员是否可以创建仓库 */
  members_can_create_repositories?: boolean | null;
  /** 是否启用了两因素认证要求 */
  two_factor_requirement_enabled?: boolean | null;
  /** 成员允许的仓库创建类型 */
  members_allowed_repository_creation_type?: string;
  /** 成员是否可以创建公开仓库 */
  members_can_create_public_repositories?: boolean;
  /** 成员是否可以创建私有仓库 */
  members_can_create_private_repositories?: boolean;
  /** 成员是否可以创建内部仓库 */
  members_can_create_internal_repositories?: boolean;
  /** 成员是否可以创建 Pages */
  members_can_create_pages?: boolean;
  /** 成员是否可以创建公开 Pages */
  members_can_create_public_pages?: boolean;
  /** 成员是否可以创建私有 Pages */
  members_can_create_private_pages?: boolean;
  /** 成员是否可以 Fork 私有仓库 */
  members_can_fork_private_repositories?: boolean | null;
  /** 是否要求 Web 提交签名 */
  web_commit_signoff_required?: boolean;
  /** 控制是否允许为组织中的仓库添加和使用部署密钥 */
  deploy_keys_enabled_for_repositories?: boolean;
}

/**
 *  组织的安全配置信息
 */
export interface OrganizationSecurityConfigType {
  /** 对于新仓库和转移到此组织的仓库，是否启用了 GitHub Advanced Security */
  advanced_security_enabled_for_new_repositories?: boolean;
  /** 对于新仓库和转移到此组织的仓库，是否自动启用了 Dependabot alerts */
  dependabot_alerts_enabled_for_new_repositories?: boolean;
  /** 对于新仓库和转移到此组织的仓库，是否自动启用了 Dependabot security updates */
  dependabot_security_updates_enabled_for_new_repositories?: boolean;
  /** 对于新仓库和转移到此组织的仓库，是否自动启用了 dependency graph */
  dependency_graph_enabled_for_new_repositories?: boolean;
  /** 对于新仓库和转移到此组织的仓库，是否自动启用了 secret scanning */
  secret_scanning_enabled_for_new_repositories?: boolean;
  /** 对于新仓库和转移到此组织的仓库，是否自动启用了 secret scanning push protection */
  secret_scanning_push_protection_enabled_for_new_repositories?: boolean;
  /** 是否向因 push protection 而被阻止推送 secret 的贡献者显示自定义链接 */
  secret_scanning_push_protection_custom_link_enabled?: boolean;
  /** 显示给因 push protection 而被阻止推送 secret 的贡献者 */
  secret_scanning_push_protection_custom_link?: string | null;
}

/**
 * GitHub 组织的完整信息
 */
export interface OrganizationInfoType
  extends OrganizationBaseType,
  OrganizationUrlType,
  OrganizationRepositoryAndGistsType,
  OrganizationMemberType,
  OrganizationPermissionsAndConfigType,
  OrganizationSecurityConfigType {}
