import {
  formatDate,
  NotOrgMsg,
  NotOrgOrUserMsg,
  NotParamMsg,
  NotPerrmissionMsg,
  NotUserMsg,
  parse_git_url
} from '@/common'
import { Base } from '@/models/platform/github/base'
import type {
  ApiResponseType,
  OrgRepoCreateParamType,
  OrgRepoListParmsType,
  OrgRepoListType,
  RepoInfoParamType,
  RepoInfoResponseType,
  RepoVisibilityResponseType,
  UserByTokenRepoListParmsType,
  UserRepoListParmsType,
  UserRepoListType
} from '@/types'

/**
 * GitHub 仓库操作类
 *
 * 提供对GitHub仓库的完整CRUD操作接口，包括：
 * - 组织/用户仓库的查询、创建、删除
 * - 仓库详细信息的获取
 * - 仓库可见性检查
 * - 支持通过URL或owner/repo两种方式操作仓库
 *
 */
export class Repo extends Base {
  constructor (base: Base) {
    super(base)
    this.userToken = base.userToken
    this.ApiUrl = base.ApiUrl
    this.BaseUrl = base.BaseUrl
  }

  /**
   * 获取组织仓库列表
   * @param options - 请求参数对象
   * @param options.org - 组织名称
   * @param options.type - 仓库类型，可选值：'all' | 'public' | 'private' | 'forks' | 'sources' | 'member', 默认值：'all'
   * @param options.sort - 排序字段，可选值：'created' | 'updated' | 'pushed' | 'full_name', 默认值：'created'
   * @param options.direction - 排序方向，可选值：'asc' | 'desc', 默认值：'desc'
   * @param options.per_page - 每页数量（1-100）, 默认值：30
   * @param options.page - 页码 默认值：1
   * @returns 组织仓库列表
   */
  public async get_org_repos_list (
    options: OrgRepoListParmsType
  ): Promise<ApiResponseType<OrgRepoListType>> {
    try {
      if (!options.org) {
        throw new Error(NotParamMsg)
      }
      this.setRequestConfig({
        token: this.userToken
      })
      const queryParams = new URLSearchParams()
      if (options?.type) queryParams.set('type', options.type)
      if (options?.sort) queryParams.set('sort', options.sort)
      if (options?.direction) queryParams.set('direction', options.direction)
      if (options?.per_page) queryParams.set('per_page', options.per_page.toString())
      if (options?.page) queryParams.set('page', options.page.toString())
      const queryString = queryParams.toString()
      const url = queryString
        ? `/orgs/${options.org}/repos?${queryString}`
        : `/orgs/${options.org}/repos`
      const req = await this.get(url)
      if (req.statusCode === 404) {
        throw new Error(NotOrgMsg)
      } else if (req.statusCode === 401) {
        throw new Error(NotPerrmissionMsg)
      }
      if (req.data) {
        req.data = await Promise.all(
          req.data.map(async (repo: RepoInfoResponseType) => ({
            ...repo,
            created_at: await formatDate(repo.created_at),
            updated_at: await formatDate(repo.updated_at),
            pushed_at: await formatDate(repo.pushed_at)
          }))
        )
      }
      return req
    } catch (error) {
      throw new Error(`获取组织仓库列表失败: ${(error as Error).message}`)
    }
  }

  /**
   * 查询仓库详细信息
   * @param options - 请求参数对象
   * @param options.type - 仓库类型，可选值：可选all， public， private
   * @param options.visibility - 仓库可见性，可选值：'public' | 'private' | 'internal', 默认值：'all'
   * @param options.affiliation - 仓库关联，可选值：'owner' | 'collaborator' | 'organization_member', 默认值：'owner,collaborator,organization_member'
   * @param options.sort - 排序字段，可选值：'created' | 'updated' | 'pushed' | 'full_name', 默认值：'created'
   * @param options.direction - 排序方向，可选值：'asc' | 'desc', 默认值：'desc'
   * @param options.per_page - 每页数量（1-100）, 默认值：30
   * @param options.page - 页码 默认值：1
   * @returns 仓库详细信息
   */
  public async get_user_repos_list_by_token (options?: UserByTokenRepoListParmsType): Promise<ApiResponseType<UserRepoListType>> {
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const queryParams = new URLSearchParams()
      if (!options?.visibility && !options?.affiliation && options?.type) {
        queryParams.set('type', options.type)
      }
      if (options?.visibility) queryParams.set('visibility', options.visibility)
      if (options?.affiliation) queryParams.set('affiliation', options.affiliation)
      if (options?.sort) queryParams.set('sort', options.sort)
      if (options?.direction) queryParams.set('direction', options.direction)
      if (options?.per_page) queryParams.set('per_page', options.per_page.toString())
      if (options?.page) queryParams.set('page', options.page.toString())

      const queryString = queryParams.toString()
      const url = queryString
        ? `/user/repos?${queryString}`
        : '/uses/repos'
      const req = await this.get(url)
      if (req.statusCode === 401) {
        throw new Error(NotPerrmissionMsg)
      }
      if (req.data) {
        req.data = await Promise.all(
          req.data.map(async (repo: RepoInfoResponseType) => ({
            ...repo,
            created_at: await formatDate(repo.created_at),
            updated_at: await formatDate(repo.updated_at),
            pushed_at: await formatDate(repo.pushed_at)
          }))
        )
      }
      return req
    } catch (error) {
      throw new Error(`获取授权用户仓库列表失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取用户仓库列表
   * @param options - 请求参数对象
   * @param options.username - 用户名
   * @remarks 优先获取授权用户仓库列表，若授权用户不存在则获取指定用户仓库列表
   * @param options.type - 仓库类型，可选值：all， owner， member，, 默认值：'all'
   * @param options.sort - 排序字段，可选值：'created' | 'updated' | 'pushed' | 'full_name', 默认值：'created'
   * @param options.direction - 排序方向，可选值：'asc' | 'desc', 默认值：'desc'
   * @param options.per_page - 每页数量（1-100）, 默认值：30
   * @param options.page - 页码 默认值：1
   * @returns 用户仓库列表
   */
  public async get_user_repos_list (
    options: UserRepoListParmsType
  ): Promise<ApiResponseType<UserRepoListType>> {
    try {
      if (!options.username) throw new Error(NotParamMsg)
      this.setRequestConfig({
        token: this.userToken
      })
      const queryParams = new URLSearchParams()
      if (options?.type) queryParams.set('type', options.type)
      if (options?.sort) queryParams.set('sort', options.sort)
      if (options?.direction) queryParams.set('direction', options.direction)
      if (options?.per_page) queryParams.set('per_page', options.per_page.toString())
      if (options?.page) queryParams.set('page', options.page.toString())

      const queryString = queryParams.toString()
      const url = queryString
        ? `/users/${options.username}/repos?${queryString}`
        : `/users/${options.username}/repos`
      const req = await this.get(url)
      if (req.statusCode === 404) {
        throw new Error(NotUserMsg)
      } else if (req.statusCode === 401) {
        throw new Error(NotPerrmissionMsg)
      }
      if (req.data) {
        req.data = await Promise.all(
          req.data.map(async (repo: RepoInfoResponseType) => ({
            ...repo,
            created_at: await formatDate(repo.created_at),
            updated_at: await formatDate(repo.updated_at),
            pushed_at: await formatDate(repo.pushed_at)
          }))
        )
      }
      return req
    } catch (error) {
      throw new Error(`获取用户仓库列表失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取仓库信息
   * @param options - 仓库信息参数对象，必须包含以下两种组合之一：
   * - options.url 仓库URL地址
   * - options.owner 仓库拥有者
   * - options.repo 仓库名称
   * url参数和owner、repo参数传入其中的一种
   */
  public async get_repo_info (
    options: RepoInfoParamType
  ): Promise<ApiResponseType<RepoInfoResponseType>> {
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      /* 解析仓库地址 */
      let owner, repo
      if ('url' in options) {
        const url = options.url.trim()
        const info = parse_git_url(url)
        owner = info?.owner
        repo = info?.repo
      } else if ('owner' in options && 'repo' in options) {
        owner = options?.owner
        repo = options?.repo
      } else {
        throw new Error(NotParamMsg)
      }
      const req = await this.get(`/repos/${owner}/${repo}`)
      if (req.statusCode === 404) {
        throw new Error(NotOrgOrUserMsg)
      } else if (req.statusCode === 401) {
        throw new Error(NotPerrmissionMsg)
      }
      if (req.data) {
        req.data.created_at = await formatDate(req.data.created_at)
        req.data.updated_at = await formatDate(req.data.updated_at)
        req.data.pushed_at = await formatDate(req.data.pushed_at)
      }
      return req
    } catch (error) {
      throw new Error(`获取仓库信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 创建组织仓库
   * @param options 创建组织仓库参数
   * @param options.owner - 组织名称
   * @param options.name - 仓库名称
   * @param options.description - 仓库描述
   * @param options.homepage - 仓库主页URL
   * @param options.visibility - 仓库可见性，可选值：'public' | 'private', 默认值：'public'
   * @param options.has_issues - 是否启用issues功能, 默认值：true
   * @param options.has_projects - 是否启用projects功能, 默认值：true
   * @param options.has_wiki - 是否启用wiki功能, 默认值：true
   * @param options.has_downloads - 是否启用下载功能 默认值：true
   * @param options.is_template - 是否设置为模板仓库 默认值：false
   * @param options.team_id - 关联团队ID（组织仓库专用）
   * @param options.auto_init - 是否自动初始化仓库 默认值：false
   * @param options.gitignore_template - gitignore模板名称（需配合auto_init使用）
   * @param options.license_template - license模板名称（需配合auto_init使用）
   * @param options.allow_squash_merge - 是否允许squash merge, 默认值：true
   * @param options.allow_merge_commit - 是否允许普通合并, 默认值：true
   * @param options.allow_rebase_merge - 是否允许rebase合并 默认值：true
   * @param options.allow_auto_merge - 是否允许自动合并 默认值：false
   * @param options.delete_branch_on_merge - 合并后是否自动删除分支 默认值：false
   * @param options.squash_merge_commit_title - squash合并提交标题格式 默认值：'PR_TITLE'
   * @param options.squash_merge_commit_message - squash合并提交信息格式 默认值：'PR_BODY'
   * @param options.merge_commit_title - 合并提交标题格式 默认值：'PR_TITLE'
   * @param options.merge_commit_message - 合并提交信息格式 默认值：'PR_BODY'
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
        throw new Error(NotPerrmissionMsg)
      }
      if (req.data) {
        req.data.created_at = await formatDate(req.data.created_at)
        req.data.updated_at = await formatDate(req.data.updated_at)
        req.data.pushed_at = await formatDate(req.data.pushed_at)
      }
      return req
    } catch (error) {
      throw new Error(`创建组织仓库失败: ${(error as Error).message}`)
    }
  }

  /**
   * 快速获取仓库可见性
   * @param options
   * - url 仓库URL地址
   * - owner 仓库拥有者
   * - repo 仓库名称
   * url参数和owner、repo参数传入其中的一种
   * @remarks 优先使用url参数，若url参数不存在则使用owner和repo参数
   * @returns 仓库可见性，
   * @example
   * ```ts
   * const visibility = await repo.get_repo_visibility({url: 'https://github.com/ClarityJS/git-neko-kit'})
   * console.log(visibility) // 输出 public 或 private
   * ```
   */
  public async get_repo_visibility (options: RepoInfoParamType): Promise<RepoVisibilityResponseType['visibility'] | null> {
    try {
      let owner, repo
      if ('url' in options) {
        const url = options.url.trim()
        const info = parse_git_url(url)
        owner = info?.owner
        repo = info?.repo
      } else if ('owner' in options && 'repo' in options) {
        owner = options?.owner
        repo = options?.repo
      } else {
        throw new Error(NotParamMsg)
      }
      const req = await this.get_repo_info({ owner, repo })
      let visibility = 'public'
      if (req.data) {
        visibility = req.data?.visibility
      }
      return visibility
    } catch (error) {
      return null
    }
  }
}
