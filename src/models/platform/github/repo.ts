import {
  formatDate,
  get_langage_color,
  isNotPerrmissionMsg,
  NotOrgMsg,
  NotOrgOrUserMsg,
  NotParamMsg,
  NotPerrmissionMsg,
  NotRepoMsg,
  NotRepoOrPerrmissionMsg,
  NotUserMsg,
  NotUserParamMsg,
  parse_git_url
} from '@/common'
import { GitHubClient } from '@/models/platform/github/base'
import type {
  AddCollaboratorResponseType,
  ApiResponseType,
  CollaboratorInfoResponseType,
  CollaboratorListParamType,
  CollaboratorListResponseType,
  CollaboratorParamType,
  OrgRepoCreateParamType,
  OrgRepoCreateResponseType,
  OrgRepoListParmType,
  OrgRepoListType,
  RemoveCollaboratorParamType,
  RemoveCollaboratorResponseType,
  RepoDefaultBranchResponseType,
  RepoInfoParamType,
  RepoInfoResponseType,
  RepoLanguagesListParamType,
  RepoLanguagesListType,
  RepoMainLanguageResponseType,
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
export class Repo extends GitHubClient {
  constructor (base: GitHubClient) {
    super(base)
    this.userToken = base.userToken
    this.ApiUrl = base.ApiUrl
    this.BaseUrl = base.BaseUrl
  }

  /**
   * 获取组织仓库列表
   * 权限: Metadata - Read-only , 如果获取公开仓库可无需此权限
   * @param options - 请求参数对象
   * - org - 组织名称
   * - type - 仓库类型，可选值：'all' | 'public' | 'private' | 'forks' | 'sources' | 'member', 默认值：'all'
   * - sort - 排序字段，可选值：'created' | 'updated' | 'pushed' | 'full_name', 默认值：'created'
   * - direction - 排序方向，可选值：'asc' | 'desc', 默认值：'desc'
   * - per_page - 每页数量（1-100）, 默认值：30
   * - page - 页码 默认值：1
   * @returns 组织仓库列表
   * @example
   * ```ts
   * const repos = await repo.get_org_repos_list({ org: 'org' })
   * console.log(repos)
   * ```
   */
  public async get_org_repos_list (
    options: OrgRepoListParmType
  ): Promise<ApiResponseType<OrgRepoListType>> {
    if (!options.org) {
      throw new Error(NotParamMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { org, ...queryOptions } = options
      const params: Record<string, string> = {}
      if (queryOptions?.type) params.type = queryOptions.type
      if (queryOptions?.sort) params.sort = queryOptions.sort
      if (queryOptions?.direction) params.direction = queryOptions.direction
      if (queryOptions?.per_page) params.per_page = queryOptions.per_page.toString()
      if (queryOptions?.page) params.page = queryOptions.page.toString()
      const url = `/orgs/${org}/repos`
      const res = await this.get(url, params) as ApiResponseType<OrgRepoListType>
      switch (res.statusCode) {
        case 404:
          throw new Error(NotOrgMsg)
        case 401:
          throw new Error(NotPerrmissionMsg)
      }
      const isFormat = options.format ?? this.format
      if (res.data) {
        res.data = await Promise.all(
          res.data.map(async (repo: RepoInfoResponseType) => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            owner: {
              id: repo.owner.id,
              login: repo.owner.login,
              name: repo.owner.name,
              avatar_url: repo.owner.avatar_url,
              type: repo.owner.type,
              html_url: repo.owner.html_url,
              company: repo.owner.company,
              email: repo.owner.email,
              bio: repo.owner.bio,
              blog: repo.owner.blog,
              followers: repo.owner.followers,
              following: repo.owner.following
            },
            public: !repo.private,
            private: repo.private,
            visibility: repo.private ? 'private' : 'public',
            fork: repo.fork,
            archived: repo.archived,
            disabled: repo.disabled,
            html_url: repo.html_url,
            description: repo.description,
            created_at: isFormat
              ? await formatDate(repo.created_at)
              : repo.created_at,
            updated_at: isFormat
              ? await formatDate(repo.updated_at)
              : repo.updated_at,
            stargazers_count: repo.stargazers_count,
            watchers_count: repo.watchers_count,
            language: repo.language,
            forks_count: repo.forks_count,
            open_issues_count: repo.open_issues_count,
            default_branch: repo.default_branch
          }))
        )
      }
      return res
    } catch (error) {
      throw new Error(`获取组织仓库列表失败: ${(error as Error).message}`)
    }
  }

  /**
   * 查询仓库详细信息
   * 权限: Metadata - read-only , 如果获取公开仓库可无需此权限
   * @param options - 请求参数对象
   * - type - 仓库类型，可选值：可选all， public， private
   * - visibility - 仓库可见性，可选值：'public' | 'private' | 'internal', 默认值：'all'
   * - affiliation - 仓库关联，可选值：'owner' | 'collaborator' | 'organization_member', 默认值：'owner,collaborator,organization_member'
   * - sort - 排序字段，可选值：'created' | 'updated' | 'pushed' | 'full_name', 默认值：'created'
   * - direction - 排序方向，可选值：'asc' | 'desc', 默认值：'desc'
   * - per_page - 每页数量（1-100）, 默认值：30
   * - page - 页码 默认值：1
   * @returns 仓库详细信息
   * @example
   * ```ts
   * const repos = await repo.get_repos_list({ username: 'username' })
   * console.log(repos)
   * ```
   */
  public async get_user_repos_list_by_token (
    options?: UserByTokenRepoListParamType
  ): Promise<ApiResponseType<UserRepoListType>> {
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { ...queryOptions } = options
      const params: Record<string, string> = {}
      if (!options?.visibility && !options?.affiliation && queryOptions?.type) {
        params.type = queryOptions.type
      }
      if (queryOptions?.visibility) params.visibility = queryOptions.visibility
      if (queryOptions?.affiliation) {
        params.affiliation = queryOptions.affiliation
      }
      if (queryOptions?.sort) params.sort = queryOptions.sort
      if (queryOptions?.direction) params.direction = queryOptions.direction
      if (queryOptions?.per_page) {
        params.per_page = queryOptions.per_page.toString()
      }
      if (queryOptions?.page) params.page = queryOptions.page.toString()

      const url = '/uses/repos'
      const res = await this.get(url, params) as ApiResponseType<UserRepoListType>
      if (res.statusCode === 401) {
        throw new Error(NotPerrmissionMsg)
      }
      const isFormat = options?.format ?? this.format
      if (res.data) {
        res.data = await Promise.all(
          res.data.map(async (repo: RepoInfoResponseType) => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            owner: {
              id: repo.owner.id,
              login: repo.owner.login,
              name: repo.owner.name,
              avatar_url: repo.owner.avatar_url,
              type: repo.owner.type,
              html_url: repo.owner.html_url,
              company: repo.owner.company,
              email: repo.owner.email,
              bio: repo.owner.bio,
              blog: repo.owner.blog,
              followers: repo.owner.followers,
              following: repo.owner.following
            },
            public: !repo.private,
            private: repo.private,
            visibility: repo.private ? 'private' : 'public',
            fork: repo.fork,
            archived: repo.archived,
            disabled: repo.disabled,
            html_url: repo.html_url,
            description: repo.description,
            created_at: isFormat
              ? await formatDate(repo.created_at)
              : repo.created_at,
            updated_at: isFormat
              ? await formatDate(repo.updated_at)
              : repo.updated_at,
            stargazers_count: repo.stargazers_count,
            watchers_count: repo.watchers_count,
            language: repo.language,
            forks_count: repo.forks_count,
            open_issues_count: repo.open_issues_count,
            default_branch: repo.default_branch
          }))
        )
      }
      return res
    } catch (error) {
      throw new Error(`获取授权用户仓库列表失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取用户仓库列表
   * 权限:
   * - Metadata: Read-only, 如果只获取公开仓库可无需此权限
   * @param options - 请求参数对象
   * - username - 用户名
   * 优先获取授权用户仓库列表，若授权用户不存在则获取指定用户仓库列表
   * - type - 仓库类型，可选值：all， owner， member，, 默认值：'all'
   * - sort - 排序字段，可选值：'created' | 'updated' | 'pushed' | 'full_name', 默认值：'created'
   * - direction - 排序方向，可选值：'asc' | 'desc', 默认值：'desc'
   * - per_page - 每页数量（1-100）, 默认值：30
   * - page - 页码 默认值：1
   * @returns 用户仓库列表
   */
  public async get_user_repos_list (
    options: UserRepoListParamType
  ): Promise<ApiResponseType<UserRepoListType>> {
    try {
      if (!options.username) throw new Error(NotUserParamMsg)
      this.setRequestConfig({
        token: this.userToken
      })
      const { username, ...queryOptions } = options
      const params: Record<string, string> = {}
      if (queryOptions?.type) params.type = queryOptions.type
      if (queryOptions?.sort) params.sort = queryOptions.sort
      if (queryOptions?.direction) params.direction = queryOptions.direction
      if (queryOptions?.per_page) {
        params.per_page = queryOptions.per_page.toString()
      }
      if (queryOptions?.page) params.page = queryOptions.page.toString()

      const isFormat = options?.format ?? this.format
      const url = `/users/${username}/repos`
      const res = await this.get(url, params) as ApiResponseType<UserRepoListType>

      switch (res.statusCode) {
        case 404:
          throw new Error(NotUserMsg)
        case 401:
          throw new Error(NotPerrmissionMsg)
      }

      if (res.data) {
        res.data = await Promise.all(
          res.data.map(async (repo: RepoInfoResponseType) => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            owner: {
              id: repo.owner.id,
              login: repo.owner.login,
              name: repo.owner.name,
              avatar_url: repo.owner.avatar_url,
              type: repo.owner.type,
              html_url: repo.owner.html_url,
              company: repo.owner.company,
              email: repo.owner.email,
              bio: repo.owner.bio,
              blog: repo.owner.blog,
              followers: repo.owner.followers,
              following: repo.owner.following
            },
            public: !repo.private,
            private: repo.private,
            visibility: repo.private ? 'private' : 'public',
            fork: repo.fork,
            archived: repo.archived,
            disabled: repo.disabled,
            html_url: repo.html_url,
            description: repo.description,
            created_at: isFormat
              ? await formatDate(repo.created_at)
              : repo.created_at,
            updated_at: isFormat
              ? await formatDate(repo.updated_at)
              : repo.updated_at,
            stargazers_count: repo.stargazers_count,
            watchers_count: repo.watchers_count,
            language: repo.language,
            forks_count: repo.forks_count,
            open_issues_count: repo.open_issues_count,
            default_branch: repo.default_branch
          }))
        )
      }

      return res
    } catch (error) {
      throw new Error(`获取用户仓库列表失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取仓库信息
   * 权限:
   * - Metadata: Read-only, 如果只获取公开仓库可无需此权限
   * @param options - 仓库信息参数对象，必须包含以下两种组合之一：
   * - options.url 仓库URL地址
   * - options.owner 仓库拥有者
   * - options.repo 仓库名称
   * url参数和owner、repo参数传入其中的一种
   * @example
   * ```ts
   * const repo = await repo.get_repo_info({ url: 'https://github.com/CandriaJS/git-neko-kit' })
   * console.log(repo)
   * ```
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
      const res = await this.get(`/repos/${owner}/${repo}`) as ApiResponseType<RepoInfoResponseType>
      switch (res.statusCode) {
        case 401:
          throw new Error(NotPerrmissionMsg)
        case 404:
          throw new Error(NotOrgOrUserMsg)
      }
      const isFormat = options?.format ?? this.format
      if (res.data) {
        res.data = {
          id: res.data.id,
          name: res.data.name,
          full_name: res.data.full_name,
          owner: {
            id: res.data.owner.id,
            login: res.data.owner.login,
            name: res.data.owner.name,
            avatar_url: res.data.owner.avatar_url,
            type: res.data.owner.type,
            html_url: res.data.owner.html_url,
            company: res.data.owner.company,
            email: res.data.owner.email,
            bio: res.data.owner.bio,
            blog: res.data.owner.blog,
            followers: res.data.owner.followers,
            following: res.data.owner.following
          },
          public: !res.data.private,
          private: res.data.private,
          visibility: res.data.private ? 'private' : 'public',
          fork: res.data.fork,
          archived: res.data.archived,
          disabled: res.data.disabled,
          html_url: res.data.html_url,
          description: res.data.description,
          created_at: isFormat
            ? await formatDate(res.data.created_at)
            : res.data.created_at,
          updated_at: isFormat
            ? await formatDate(res.data.updated_at)
            : res.data.updated_at,
          stargazers_count: res.data.stargazers_count,
          watchers_count: res.data.watchers_count,
          language: res.data.language,
          forks_count: res.data.forks_count,
          open_issues_count: res.data.open_issues_count,
          default_branch: res.data.default_branch
        }
      }
      return res
    } catch (error) {
      throw new Error(`获取仓库信息失败: ${(error as Error).message}`)
    }
  }

  public async get_repo_languages_list (
    options: RepoLanguagesListParamType
  ): Promise<ApiResponseType<RepoLanguagesListType>> {
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
      const res = await this.get(`/repos/${owner}/${repo}/languages`) as ApiResponseType<RepoLanguagesListType>
      switch (res.statusCode) {
        case 401:
          throw new Error(NotPerrmissionMsg)
        case 404:
          throw new Error(NotRepoMsg)
      }
      if (res.data) {
        const totalBytes = Object.values(res.data).reduce<number>((sum, bytes) => sum + (bytes as number), 0)
        res.data = {
          languages: await Promise.all(
            Object.entries(res.data).map(([language, bytes]) => {
              const languageLower = String(language).toLowerCase()
              return {
                language,
                color: get_langage_color(languageLower),
                percent: Number(((bytes as number / totalBytes) * 100).toFixed(2)),
                bytes: bytes as number
              }
            })
          )
        }
      }
      return res
    } catch (error) {
      throw new Error(`获取仓库语言列表失败: ${(error as Error).message}`)
    }
  }

  /**
   * 创建组织仓库
   * 权限：
   * - Administration: Read and write
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
  ): Promise<ApiResponseType<OrgRepoCreateResponseType>> {
    try {
      const { owner, ...repoOptions } = options
      const body = {
        ...repoOptions
      }
      const res = await this.post(`/orgs/${owner}/repos`, body) as ApiResponseType<OrgRepoCreateResponseType>
      if (res.statusCode === 401) {
        throw new Error(NotPerrmissionMsg)
      }
      const isFormat = options?.format ?? this.format
      if (res.data) {
        res.data = {
          id: res.data.id,
          name: res.data.name,
          full_name: res.data.full_name,
          owner: {
            id: res.data.owner.id,
            login: res.data.owner.login,
            name: res.data.owner.name,
            avatar_url: res.data.owner.avatar_url,
            type: res.data.owner.type,
            html_url: res.data.owner.html_url,
            company: res.data.owner.company,
            email: res.data.owner.email,
            bio: res.data.owner.bio,
            blog: res.data.owner.blog,
            followers: res.data.owner.followers,
            following: res.data.owner.following
          },
          public: !res.data.private,
          private: res.data.private,
          visibility: res.data.private ? 'private' : 'public',
          fork: res.data.fork,
          archived: res.data.archived,
          disabled: res.data.disabled,
          html_url: res.data.html_url,
          description: res.data.description,
          created_at: isFormat
            ? await formatDate(res.data.created_at)
            : res.data.created_at,
          updated_at: isFormat
            ? await formatDate(res.data.updated_at)
            : res.data.updated_at,
          stargazers_count: res.data.stargazers_count,
          watchers_count: res.data.watchers_count,
          language: res.data.language,
          forks_count: res.data.forks_count,
          open_issues_count: res.data.open_issues_count,
          default_branch: res.data.default_branch
        }
      }
      return res
    } catch (error) {
      throw new Error(`创建组织仓库失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取协作者列表
   * 权限：
   * - Metadata: Read
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
   * const result = await collaborator.get_collaborators_list(options)
   * console.log(result)
   * ```
   */
  public async get_collaborators_list (
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
      const { ...queryOptions } = options
      const params: Record<string, string> = {}
      if (queryOptions.affiliation) params.milestone = queryOptions.affiliation.toString()
      if (queryOptions.permission) params.permission = queryOptions.permission.toString()
      if (queryOptions.per_page) params.per_page = queryOptions.per_page.toString()
      if (queryOptions.page) params.page = queryOptions.page.toString()
      const res = await this.get(`/repos/${owner}/${repo}/collaborators`, params) as ApiResponseType<CollaboratorListResponseType>
      if (res.data) {
        res.data = await Promise.all(
          res.data.map((repo: CollaboratorInfoResponseType) => ({
            id: repo.id,
            login: repo.login,
            avatar_url: repo.avatar_url,
            email: repo.email,
            name: repo.name,
            permissions: repo.permissions,
            role_name: repo.role_name
          }))
        )
      }
      return res
    } catch (error) {
      throw new Error(`获取仓库协作者列表失败: ${(error as Error).message}`)
    }
  }

  /**
   * 邀请协作者
   * 权限：
   * - Administration: Read and write
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
   * ```
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
      const res = await this.put(
        `/repos/${owner}/${repo}/collaborators/${username}`,
        {
          permission: options.permission ?? 'pull'
        }
      ) as ApiResponseType<AddCollaboratorResponseType>
      if (res.statusCode === 404) throw new Error(NotRepoOrPerrmissionMsg)
      if (res.statusCode === 422) {
        const msg = (res.data as unknown as { message: string }).message
        if (msg) {
          if (msg.includes('is not a valid permission')) throw new Error(isNotPerrmissionMsg)
        }
      }

      const isFormat = options?.format ?? this.format

      if (res.data) {
        res.data = {
          id: res.data.id,
          repository: {
            id: res.data.repository.id,
            name: res.data.repository.name,
            full_name: res.data.repository.full_name,
            owner: {
              id: res.data.repository.owner.id,
              login: res.data.repository.owner.login,
              name: res.data.repository.owner.name,
              avatar_url: res.data.repository.owner.avatar_url,
              type: res.data.repository.owner.type,
              html_url: res.data.repository.owner.html_url,
              company: res.data.repository.owner.company,
              email: res.data.repository.owner.email,
              bio: res.data.repository.owner.bio,
              blog: res.data.repository.owner.blog,
              followers: res.data.repository.owner.followers,
              following: res.data.repository.owner.following
            },
            public: !res.data.repository.private,
            private: res.data.repository.private,
            visibility: res.data.repository.private ? 'private' : 'public',
            fork: res.data.repository.fork,
            archived: res.data.repository.archived,
            disabled: res.data.repository.disabled,
            html_url: res.data.repository.html_url,
            description: res.data.repository.description,
            created_at: isFormat
              ? await formatDate(res.data.repository.created_at)
              : res.data.repository.created_at,
            updated_at: isFormat
              ? await formatDate(res.data.repository.updated_at)
              : res.data.repository.updated_at,
            stargazers_count: res.data.repository.stargazers_count,
            watchers_count: res.data.repository.watchers_count,
            language: res.data.repository.language,
            forks_count: res.data.repository.forks_count,
            open_issues_count: res.data.repository.open_issues_count,
            default_branch: res.data.repository.default_branch
          }
        }
      }
      return res
    } catch (error) {
      throw new Error(`添加协作者${username}失败: ${(error as Error).message}`)
    }
  }

  /**
   * 删除协作者
   * 权限：
   * - Administration: Read and write
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
    options: RemoveCollaboratorParamType
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
      const res = await this.delete(`/repos/${owner}/${repo}/collaborators/${username}`) as ApiResponseType<RemoveCollaboratorResponseType>
      if (res.statusCode === 404) throw new Error(NotRepoOrPerrmissionMsg)
      if (res.status && res.statusCode === 204) {
        res.data = {
          info: `移除协作者${username}成功`
        }
      } else {
        res.data = {
          info: `移除协作者${username}失败`
        }
      }
      return res
    } catch (error) {
      throw new Error(`移除协作者${username}失败: ${(error as Error).message}`)
    }
  }

  /**
   * 删除协作者
   * @deprecated 请使用remove_collaborator方法
   * @param options 删除协作者对象
   * @returns 返回删除协作者结果
   * @example
   * ```ts
   * const result = await collaborator.delete_collaborator({
   *  owner: 'owner',
   *  repo:'repo',
   *  username: 'username'
   * })
   * console.log(result)
  * ```
  */
  public async delete_collaborator (
    options: RemoveCollaboratorParamType
  ): Promise<ApiResponseType<RemoveCollaboratorResponseType>> {
    return this.remove_collaborator(options)
  }

  /**
   * 快速获取仓库可见性
   * 权限:
   * - Metadata: Read-only, 如果只获取公开仓库可无需此权限
   * @param options
   * - url 仓库URL地址
   * - owner 仓库拥有者
   * - repo 仓库名称
   * url参数和owner、repo参数传入其中的一种
   * @remarks 优先使用url参数，若url参数不存在则使用owner和repo参数
   * @returns 仓库可见性，
   * @example
   * ```ts
   * const visibility = await repo.get_repo_visibility({url: 'https://github.com/CandriaJS/git-neko-kit'})
   * console.log(visibility) // 输出 public 或 private
   * ```
   */
  public async get_repo_visibility (
    options: RepoInfoParamType
  ): Promise<RepoVisibilityResponseType['visibility']> {
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
      return (await this.get_repo_info({ owner, repo })).data.visibility
    } catch (error) {
      throw new Error(`获取仓库可见性失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取仓库默认分支
   * 权限:
   * - Metadata: Read-only, 如果只获取公开仓库可无需此权限
   * @param options
   * - url 仓库URL地址
   * - owner 仓库拥有者
   * - repo 仓库名称
   * url参数和owner、repo参数传入其中的一种
   * @example
   * ```ts
   * const defaultBranch = await repo.get_repo_default_branch({url: 'https://github.com/CandriaJS/meme-plugin')}
   * console.log(defaultBranch) // 输出 main
   * ```ts
   */
  public async get_repo_default_branch (
    options: RepoInfoParamType
  ): Promise<RepoDefaultBranchResponseType['default_branch'] | null> {
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
      return (await this.get_repo_info({ owner, repo })).data.default_branch
    } catch (error) {
      throw new Error(`获取仓库默认分支失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取仓库主要语言
   * 权限:
   * - Metadata: Read-only, 如果只获取公开仓库可无需此权限
   * @param options
   * - url 仓库URL地址
   * - owner 仓库拥有者
   * - repo 仓库名称
   * url参数和owner、repo参数传入其中的一种
   * @example
   * ```ts
   * const language =  await repo.get_repo_language({url: 'URL_ADDRESS.com/CandriaJS/meme-plugin')}
   * console.log(language) // 输出 JavaScript
   * ```ts
   */
  public async get_repo_main_language (
    options: RepoInfoParamType
  ): Promise<RepoMainLanguageResponseType['language']> {
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
      return (await this.get_repo_info({ owner, repo })).data.language
    } catch (error) {
      throw new Error(`获取仓库语言失败: ${(error as Error).message}`)
    }
  }
}
