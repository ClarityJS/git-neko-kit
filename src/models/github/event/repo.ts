import { formatDate, parse_git_url } from '@/common'
import { GitHub } from '@/models/github/event/github'
import type {
  ApiResponseType,
  OrgReoParmsType,
  OrgRepoCreateParamType,
  OrgRepoListType,
  RepoInfoParamType,
  RepoInfoResponseType
} from '@/types'

/**
 * GitHub 仓库操作类
 *
 * 提供对GitHub仓库的CRUD操作，包括：
 * - 获取组织仓库列表
 * - 查询仓库详细信息
 * - 创建组织仓库
 *
 * @class Repo
 * @property {Function} get - 封装的GET请求方法
 * @property {Function} post - 封装的POST请求方法
 * @property {string} BaseUrl - GitHub API基础URL
 * @property {string} ApiUrl - GitHub API端点URL
 * @property {string} jwtToken - 认证令牌
 */
export class Repo {
  private get: GitHub['get']
  private post: GitHub['post']
  private BaseUrl: string
  private userToken: string | null
  constructor (private options: GitHub) {
    this.get = options.get.bind(options)
    this.post = options.post.bind(options)
    this.BaseUrl = options.BaseUrl
    this.userToken = options.userToken ?? null
  }

  /**
   * 获取组织仓库列表
   * @param options - 请求参数对象
   * @param options.org - 组织名称
   * @param options.type' - 仓库类型，可选值：'all' | 'public' | 'private' | 'forks' | 'sources' | 'member' @default 'all'
   * @param options.sort - 排序字段，可选值：'created' | 'updated' | 'pushed' | 'full_name' @default 'created'
   * @param options.direction - 排序方向，可选值：'asc' | 'desc' @default 'desc'
   * @param options.per_page - 每页数量（1-100） @default 30
   * @param options.page - 页码 @default 1
   * @returns 组织仓库列表
   */
  public async get_org_repos_list (
    options: OrgReoParmsType
  ): Promise<ApiResponseType<OrgRepoListType>> {
    try {
      const params = {
        type: options.type,
        sort: options.sort,
        direction: options.direction,
        per_page: options.per_page,
        page: options.page
      }
      const req = await this.get(`/orgs/${options.org}/repos`, params)
      if (req.statusCode === 404) {
        throw new Error('组织不存在')
      } else if (req.statusCode === 401) {
        throw new Error('未授权访问或令牌过期无效')
      }
      if (req.data) {
        req.data = req.data.map((repo: RepoInfoResponseType) => ({
          ...repo,
          created_at: formatDate(repo.created_at),
          updated_at: formatDate(repo.updated_at),
          pushed_at: formatDate(repo.pushed_at)
        }))
      }
      return req
    } catch (error) {
      throw new Error(`获取组织仓库列表失败: : ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 获取仓库信息
   * @param options - 仓库信息参数（必须提供以下两种组合之一）
   * @param options.url - 仓库URL地址（与owner+repo二选一）
   * @param options.owner - 仓库拥有者（与url参数二选一）
   * @param options.repo - 仓库名称（与url参数二选一）
   * @returns 仓库详细信息
   */
  public async get_repo_info (
    options: RepoInfoParamType
  ): Promise<ApiResponseType<RepoInfoResponseType>> {
    this.options.setRequestConfig({
      token: this.userToken
    })
    /* 解析仓库地址 */
    let owner, repo, url
    if ('url' in options) {
      url = options.url
      const info = parse_git_url(url, this.BaseUrl)
      owner = info?.owner
      repo = info?.repo
    } else if ('owner' in options && 'repo' in options) {
      owner = options.owner
      repo = options.repo
    } else {
      throw new Error('参数错误')
    }
    try {
      const req = await this.get(`/repos/${owner}/${repo}`)
      if (req.statusCode === 404) {
        throw new Error('组织不存在')
      } else if (req.statusCode === 401) {
        throw new Error('未授权访问或令牌过期无效')
      }
      if (req.data) {
        req.data.created_at = formatDate(req.data.created_at)
        req.data.updated_at = formatDate(req.data.updated_at)
        req.data.pushed_at = formatDate(req.data.pushed_at)
      }
      return req
    } catch (error) {
      throw new Error(`获取仓库信息失败: : ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 创建组织仓库
   * @param options 创建组织仓库参数
   * @param options.owner - 组织名称
   * @param options.name - 仓库名称
   * @param options.description - 仓库描述
   * @param options.homepage - 仓库主页URL
   * @param options.visibility - 仓库可见性，可选值：'public' | 'private' @default 'public'
   * @param options.has_issues - 是否启用issues功能 @default true
   * @param options.has_projects - 是否启用projects功能 @default true
   * @param options.has_wiki - 是否启用wiki功能 @default true
   * @param options.has_downloads - 是否启用下载功能 @default true
   * @param options.is_template - 是否设置为模板仓库 @default false
   * @param options.team_id - 关联团队ID（组织仓库专用）
   * @param options.auto_init - 是否自动初始化仓库 @default false
   * @param options.gitignore_template - gitignore模板名称（需配合auto_init使用）
   * @param options.license_template - license模板名称（需配合auto_init使用）
   * @param options.allow_squash_merge - 是否允许squash merge @default true
   * @param options.allow_merge_commit - 是否允许普通合并 @default true
   * @param options.allow_rebase_merge - 是否允许rebase合并 @default true
   * @param options.allow_auto_merge - 是否允许自动合并 @default false
   * @param options.delete_branch_on_merge - 合并后是否自动删除分支 @default false
   * @param options.squash_merge_commit_title - squash合并提交标题格式 @default 'PR_TITLE'
   * @param options.squash_merge_commit_message - squash合并提交信息格式 @default 'PR_BODY'
   * @param options.merge_commit_title - 合并提交标题格式 @default 'PR_TITLE'
   * @param options.merge_commit_message - 合并提交信息格式 @default 'PR_BODY'
   * @param options.custom_properties - 自定义键值对属性
   * @returns 返回创建成功的仓库信息
   */
  public async create_org_repo (
    options: OrgRepoCreateParamType
  ): Promise<ApiResponseType<RepoInfoResponseType>> {
    try {
      const { owner, name, ...repoOptions } = options
      const body = {
        name,
        ...repoOptions
      }
      const req = await this.post(`/orgs/${owner}/repos`, body)
      if (req.statusCode === 401) {
        throw new Error('未授权访问或令牌过期无效')
      }
      if (req.data) {
        req.data.created_at = formatDate(req.data.created_at)
        req.data.updated_at = formatDate(req.data.updated_at)
        req.data.pushed_at = formatDate(req.data.pushed_at)
      }
      return req
    } catch (error) {
      throw new Error(`创建组织仓库失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }
}
