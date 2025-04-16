import { RepoOwnerParamType } from '@/types/platform/github/base'

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
}
