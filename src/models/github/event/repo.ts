import GitUrlParse from 'git-url-parse'

import { GitHub } from '@/models/github/event/github'
import type { OrgReoParmsType, OrgRepoListType, RepoInfoResponseType, RepoParamType } from '@/types'

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
  public async info (options: RepoParamType): Promise<RepoInfoResponseType> {
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
}
