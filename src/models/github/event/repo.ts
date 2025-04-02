import GitUrlParse from 'git-url-parse'

import { GitHub } from '@/models/github/event/github'
import type { OrgReoParmsType, OrgRepoCreateParamType, OrgRepoListType, RepoInfoParamType, RepoInfoResponseType } from '@/types'

export class Repo {
  private get: GitHub['get']
  private post: GitHub['post']
  private BaseUrl: string
  private ApiUrl: string
  private jwtToken: string
  constructor (private options: GitHub, jwtToken: string) {
    this.get = options.get.bind(options)
    this.post = options.post.bind(options)
    this.ApiUrl = options.ApiUrl
    this.BaseUrl = options.BaseUrl
    this.jwtToken = jwtToken
  }

  /**
   * 获取组织仓库列表
   * @param options 组织仓库列表参数
   * @param options.org 组织名称
   * @param options.type 类型，可选all， public， private， forks， sources， member， 默认为 all
   * @param options.sort 排序方式，可选created， updated， pushed， full_name， 默认为 full_name
   * @param options.direction 排序方式，可选asc， desc， 默认为 desc
   * @param options.per_page 每页数量，默认为 30
   * @param options.page 页码，默认为 1
   * @return 返回仓库列表信息
s
   */
  public async get_org_repos_list (options: OrgReoParmsType): Promise<OrgRepoListType> {
    try {
      const req = await this.get(`/orgs/${options.org}/repos`, {
        org: options.org,
        type: options.type ?? 'all',
        sort: options.sort ?? 'created',
        direction: options.direction ?? 'desc',
        per_page: options.per_page ?? 30,
        page: options.page ?? 1
      })
      return req
    } catch (error) {
      throw new Error(`获取组织仓库列表失败: : ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 获取仓库信息
   * @param options 仓库信息参数
   * @param options.owner 仓库的拥有者
   * @param options.repo 仓库的名称
   * 二选一，推荐使用 options.owner 和 options.repo
   * @param options.url 仓库地址
   * @returns
   */
  public async info (options: RepoInfoParamType): Promise<RepoInfoResponseType> {
    /* 解析仓库地址 */
    let owner, repo, url
    if ('url' in options) {
      url = options.url
      /* 处理反代地址, 仅http协议 */
      if (!url.startsWith(this.BaseUrl)) {
        const parsedUrl = new URL(url)
        let path = parsedUrl.pathname
        if (path.includes('://')) {
          path = new URL(path.startsWith('/') ? path.substring(1) : path).pathname
        }
        const baseUrl = this.BaseUrl.endsWith('/') ? this.BaseUrl : `${this.BaseUrl}/`
        path = path.replace(/^\/+/, '')
        url = baseUrl + path
      }
      const info = GitUrlParse(url)
      owner = info?.owner
      repo = info?.name
    } else if ('owner' in options && 'repo' in options) {
      owner = options.owner
      repo = options.repo
    } else {
      throw new Error('参数错误')
    }
    try {
      const req = await this.get(`/repos/${owner}/${repo}`)
      return req
    } catch (error) {
      throw new Error(`获取仓库信息失败: : ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 创建组织仓库
   * @param options 创建组织仓库参数
   * @param options.owner 组织名称
   * @param options.name 仓库名称
   * 以上为必选参数，以下为可选参数
   * @param options.description 仓库描述
   * @param options.homepage 仓库主页
   * @param options.visibility 仓库可见性，可选public， private， 默认为 public
   * @param options.has_issues 是否开启议题issue
   * @param options.has_projects 是否开启项目project
   * @param options.has_wiki 是否开启wiki
   * @param options.has_downloads 是否开启下载
   * @param options.is_template 是否设置为模板仓库
   * @param options.team_id 仓库团队id, 这仅在组织中创建仓库时有效。
   * @param options.auto_init 仓库自动初始化
   * @param options.gitignore_template 仓库的gitignore模板
   * @param options.license_template 仓库的license模板
   * @param options.allow_squash_merge 是否允许合并提交
   * @param options.allow_merge_commit 是否允许变基合并提交
   * @param options.allow_rebase_merge 是否允许重新基础合并提交
   * @param options.allow_auto_merge 是否允许自动合并
   * @param options.delete_branch_on_merge 是否删除分支后合并
   * @param options.squash_merge_commit_title Squash 合并提交标题的格式选项，可选PR_TITLE， COMMIT_OR_PR_TITLE， 默认为 PR_TITLE
   * @param options.squash_merge_commit_message Squash 合并提交消息的格式选项，可选PR_BODY， COMMIT_MESSAGES， BLANK， 默认为 PR_BODY
   * @param options.merge_commit_title 合并提交标题的格式选项，可选PR_TITLE， MERGE_MESSAGE， 默认为 PR_TITLE
   * @param options.merge_commit_message 合并提交消息的格式选项，可选PR_BODY， PR_TITLE， BLANK， 默认为 PR_BODY
   * @param options.custom_properties 自定义属性，可选键值对，默认为 {}
   * @returns 返回仓库信息
   */
  public async create_org_repo (options: OrgRepoCreateParamType) {
    try {
      const { owner, name, ...repoOptions } = options
      const body: Partial<OrgRepoCreateParamType> = {}
      Object.assign(body, repoOptions)
      const req = await this.post(`/orgs/${owner}/repos`, body)
      return req
    } catch (error) {
      throw new Error(`创建组织仓库失败: : ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }
}
