import GitUrlParse from 'git-url-parse'

import { GitHub } from '@/models/github/event/github'
import type { RepoInfoType, RepoParamType } from '@/types'

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
   * 获取仓库信息
   * @param param options.owner 仓库的拥有者
   * @param param options.repo 仓库的名称
   * 二选一，推荐使用 options.owner 和 options.repo
   * @param param options.url 仓库地址
   * @returns
   */
  async info (options: RepoParamType): Promise<RepoInfoType | Error > {
    // 解析仓库地址
    let owner, repo
    if ('url' in options) {
      const info = GitUrlParse(options.url)
      owner = info?.owner
      repo = info?.name
    } else if ('owner' in options && 'repo' in options) {
      owner = options.owner
      repo = options.repo
    } else {
      return new Error('参数错误')
    }
    const req = await this.get(`/repos/${owner}/${repo}`)
    return req
  }
}
