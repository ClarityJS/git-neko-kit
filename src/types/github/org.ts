import { RepoInfoResponseType, RepoOwnerParamType } from '@/types/github/repo'
export interface OrgReoParmsType {
  /** 组织名称 */
  org: string
  /** 类型，可选all， public， private， forks， sources， member， 默认为 all */
  type?: 'all' | 'public' | 'private' | 'forks' | 'sources' | 'member'
  /** 排序方式，可选created， updated， pushed， full_name， 默认为 full_name */
  sort?: 'created' | 'updated' | 'pushed' | 'full_name'
  /** 排序方式，可选asc， desc， 默认为 desc */
  direction?: 'asc' | 'desc'
  /** 每页数量 */
  per_page?: number
  /** 页码 */
  page?: number
}

/**
 * 仓库信息数组
 */
export type OrgRepoListType = RepoInfoResponseType[]

/** 创建组织仓库请求参数 */
export interface OrgRepoCreateParamType extends RepoOwnerParamType {
  /** 仓库描述 */
  description?: string;
  /** 仓库主页 */
  homepage?: string;
  /** 是否为私有仓库 */
  private?: boolean;
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
}
