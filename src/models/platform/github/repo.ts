import {
  formatDate,
  isNotPerrmissionMsg,
  NotOrgMsg,
  NotOrgOrUserMsg,
  NotParamMsg,
  NotPerrmissionMsg,
  NotRepoOrPerrmissionMsg,
  NotUserMsg,
  parse_git_url
} from '@/common'
import { Base } from '@/models/platform/github/base'
import type {
  AddCollaboratorResponseType,
  ApiResponseType,
  CollaboratorListParamType,
  CollaboratorListResponseType,
  CollaboratorParamType,
  OrgRepoCreateParamType,
  OrgRepoListParmsType,
  OrgRepoListType,
  RemoveCollaboratorResponseType,
  RepoDefaultBranchResponseType,
  RepoInfoParamType,
  RepoInfoResponseType,
  RepoVisibilityResponseType,
  UserByTokenRepoListParamType,
  UserRepoListParamType,
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
      const res = await this.get(url)
      if (res.statusCode === 404) {
        throw new Error(NotOrgMsg)
      } else if (res.statusCode === 401) {
        throw new Error(NotPerrmissionMsg)
      }
      const isFormat = options.format ?? this.format
      if (isFormat) {
        if (res.data) {
          res.data = await Promise.all(
            res.data.map(async (repo: RepoInfoResponseType) => ({
              ...repo,
              created_at: await formatDate(repo.created_at),
              updated_at: await formatDate(repo.updated_at),
              pushed_at: await formatDate(repo.pushed_at)
            }))
          )
        }
      }
      return res
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
  public async get_user_repos_list_by_token (options?: UserByTokenRepoListParamType): Promise<ApiResponseType<UserRepoListType>> {
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
      const res = await this.get(url)
      if (res.statusCode === 401) {
        throw new Error(NotPerrmissionMsg)
      }
      const isFormat = options?.format ?? this.format
      if (isFormat) {
        if (res.data) {
          res.data = await Promise.all(
            res.data.map(async (repo: RepoInfoResponseType) => ({
              ...repo,
              created_at: await formatDate(repo.created_at),
              updated_at: await formatDate(repo.updated_at),
              pushed_at: await formatDate(repo.pushed_at)
            }))
          )
        }
      }
      return res
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
    options: UserRepoListParamType
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
      const isFormat = options?.format ?? this.format
      const queryString = queryParams.toString()
      let res
      try {
        res = await this.get_user_repos_list_by_token({
          ...options,
          format: isFormat
        })
      } catch (error) {
        const url = `/users/${options.username}/repos?${queryString}`
        res = await this.get(url)
      }

      switch (res.statusCode) {
        case 404:
          throw new Error(NotUserMsg)
        case 401:
          throw new Error(NotPerrmissionMsg)
      }

      if (isFormat) {
        if (res.data) {
          res.data = await Promise.all(
            res.data.map(async (repo: RepoInfoResponseType) => ({
              ...repo,
              created_at: await formatDate(repo.created_at),
              updated_at: await formatDate(repo.updated_at),
              pushed_at: await formatDate(repo.pushed_at)
            }))
          )
        }
      }

      return res
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
      const res = await this.get(`/repos/${owner}/${repo}`)
      switch (res.statusCode) {
        case 401:
          throw new Error(NotPerrmissionMsg)
        case 404:
          throw new Error(NotOrgOrUserMsg)
      }
      const isFormat = options?.format ?? this.format
      if (isFormat) {
        if (res.data) {
          res.data.created_at = await formatDate(res.data.created_at)
          res.data.updated_at = await formatDate(res.data.updated_at)
          res.data.pushed_at = await formatDate(res.data.pushed_at)
        }
      }
      return res
    } catch (error) {
      throw new Error(`获取仓库信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 创建组织仓库
   * @param options 创建组织仓库参数
   * - owner: 组织名称
   * - name: 仓库名称
   * - description: 仓库描述
   * - homepage: 仓库主页URL
   * - visibility: 仓库可见性，可选值：'public' | 'private', 默认值：'public'
   * - has_issues: 是否启用issues功能, 默认值：true
   * - has_projects: 是否启用projects功能, 默认值：true
   * - has_wiki: 是否启用wiki功能, 默认值：true
   * - has_downloads: 是否启用下载功能 默认值：true
   * - is_template: 是否设置为模板仓库 默认值：false
   * - team_id: 关联团队ID（组织仓库专用）
   * - auto_init: 是否自动初始化仓库 默认值：false
   * - gitignore_template: gitignore模板名称（需配合auto_init使用）
   * - license_template: license模板名称（需配合auto_init使用）
   * - allow_squash_merge: 是否允许squash merge, 默认值：true
   * - allow_merge_commit: 是否允许普通合并, 默认值：true
   * - allow_rebase_merge: 是否允许rebase合并 默认值：true
   * - allow_auto_merge: 是否允许自动合并 默认值：false
   * - delete_branch_on_merge: 合并后是否自动删除分支 默认值：false
   * - squash_merge_commit_title: squash合并提交标题格式 默认值：'PR_TITLE'
   * - squash_merge_commit_message: squash合并提交信息格式 默认值：'PR_BODY'
   * - merge_commit_title: 合并提交标题格式 默认值：'PR_TITLE'
   * - merge_commit_message: 合并提交信息格式 默认值：'PR_BODY'
   * - custom_properties: 自定义键值对属性
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
      const res = await this.post(`/orgs/${owner}/repos`, body)
      if (res.statusCode === 401) {
        throw new Error(NotPerrmissionMsg)
      }
      const isFormat = options?.format ?? this.format
      if (isFormat) {
        if (res.data) {
          res.data.created_at = await formatDate(res.data.created_at)
          res.data.updated_at = await formatDate(res.data.updated_at)
          res.data.pushed_at = await formatDate(res.data.pushed_at)
        }
      }
      return res
    } catch (error) {
      throw new Error(`创建组织仓库失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取协作者列表
   * @param options 获取协作者列表对象
   * - owner: 仓库拥有者
   * - repo: 仓库名称
   * - url: 仓库地址
   * url和owner、repo参数传入其中的一种
   * - affiliation: 协作者类型，可选outside, direct, all，默认为all
   * - permission: 协作者权限，可选pull，triage, push, maintain, admin，默认为pull
   * - per_page: 每页数量，默认为30
   * - page: 页码，默认为1
   * @returns 返回获取协作者列表结果
   * @example
   * ```ts
   * const result = await collaborator.get_collaborator_list(options)
   * console.log(result)
   * ```
   */
  public async get_collaborator_list (
    options: CollaboratorListParamType
  ): Promise<ApiResponseType<CollaboratorListResponseType>> {
    try {
      this.setRequestConfig({
        token: this.userToken
      })
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
      const res = await this.get(`/repos/${owner}/${repo}/collaborators`, { ...options })
      return res
    } catch (error) {
      throw new Error(`获取仓库协作者列表失败: ${(error as Error).message}`)
    }
  }

  /**
     * 邀请协作者
     * @param options 邀请协作者对象
     * - owner: 仓库拥有者
     * - repo: 仓库名称
     * - url: 仓库地址
     * owner和repo或者url选择一个即可
     * - username: 要邀请协作者用户名
     * - permission: 协作者权限，可选pull，triage, push, maintain, admin，默认为pull
     * @returns 返回邀请协作者结果
     * @example
     * ```ts
     * const result = await collaborator.add_collaborator({
     *  owner: 'owner',
     *  repo: 'repo',
     *  username: 'username',
     *  permission: 'pull'
     * })
     * console.log(result)
     })
     */
  public async add_collaborator (
    options: CollaboratorParamType
  ): Promise<ApiResponseType<AddCollaboratorResponseType>> {
    let owner, repo, username
    try {
      this.setRequestConfig({
        token: this.userToken
      })
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
      username = options?.username
      const res = await this.put(`/repos/${owner}/${repo}/collaborators/${username}`, {
        permission: options.permission ?? 'pull'
      })
      if (res.statusCode === 404) throw new Error(NotRepoOrPerrmissionMsg)
      if (res.statusCode === 422 && res.data.message) {
        if (res.data.message.includes('is not a valid permission.')) {
          throw new Error(isNotPerrmissionMsg)
        }
      }

      return res
    } catch (error) {
      throw new Error(`添加协作者${username}失败: ${(error as Error).message}`)
    }
  }

  /**
   * 删除协作者
   * @param options 删除协作者对象
   * - owner: 仓库拥有者
   * - repo: 仓库名称
   * - url: 仓库地址
   * owner和repo或者url选择一个即可
   * - username: 要删除协作者用户名
   * @returns 返回删除协作者结果
   * @example
   * ```ts
   * const result = await collaborator.remove_collaborator({
   *  owner: 'owner',
   *  repo:'repo',
   *  username: 'username'
   * })
   * console.log(result)
   * ```
   */
  public async remove_collaborator (
    options: CollaboratorParamType
  ): Promise<ApiResponseType<RemoveCollaboratorResponseType>> {
    let owner, repo, username
    try {
      this.setRequestConfig({
        token: this.userToken
      })
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
      username = options?.username
      const res = await this.delete(`/repos/${owner}/${repo}/collaborators/${username}`)
      if (res.statusCode === 404) throw new Error(NotRepoOrPerrmissionMsg)
      if (res.status && res.statusCode === 204) {
        res.data = {
          info: `删除协作者${username}成功`
        }
      } else {
        res.data = {
          info: `删除协作者${username}失败`
        }
      }
      return res
    } catch (error) {
      throw new Error(`删除协作者${username}失败: ${(error as Error).message}`)
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
      const res = await this.get_repo_info({ owner, repo })
      let visibility = 'public'
      if (res.data) {
        visibility = res.data?.visibility
      }
      return visibility
    } catch (error) {
      return null
    }
  }

  /**
   * 获取仓库默认分支
   * @param options
   * - url 仓库URL地址
   * - owner 仓库拥有者
   * - repo 仓库名称
   * url参数和owner、repo参数传入其中的一种
   * @example
   * ```ts
   * const defaultBranch = await repo.get_repo_default_branch({url: 'https://github.com/ClarityJS/meme-plugin')}
   * console.log(defaultBranch) // 输出 main
   * ```ts
   */
  public async get_repo_default_branch (options: RepoInfoParamType): Promise<RepoDefaultBranchResponseType['default_branch']> {
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
      const res = await this.get_repo_info({ owner, repo })
      let default_branch = 'main'
      if (res.data) {
        default_branch = res.data?.default_branch
      }
      return default_branch
    } catch (error) {
      console.error(error)
      throw new Error(NotParamMsg)
    }
  }
}
