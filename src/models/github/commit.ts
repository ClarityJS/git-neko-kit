import { parse_git_url } from '@/common'
import { GitHub } from '@/models/github/github'
import { Repo } from '@/models/github/repo'
import { ApiResponseType, CommitInfoParamType, CommitInfoResponseType } from '@/types'

/**
 * GitHub 提交操作类
 *
 * 提供Commit相关的操作方法，包括获取最新提交记录、获取指定的提交记录等。

 *
 * @class Commit
 * @property {Function} get - 封装的GET请求方法
 * @property {Function} post - 封装的POST请求方法
 * @property {string} BaseUrl - GitHub API基础URL
 * @property {string} ApiUrl - GitHub API端点URL
 * @property {string} jwtToken - 认证令牌
 */
export class Commit {
  private get: GitHub['get']
  private post: GitHub['post']
  private BaseUrl: string
  private userToken: string | null
  private repo: Repo
  constructor (private options: GitHub) {
    this.get = options.get.bind(options)
    this.post = options.post.bind(options)
    this.BaseUrl = options.BaseUrl
    this.userToken = options.userToken
    this.repo = new Repo(options)
  }

  public async get_commit_info (options: CommitInfoParamType):
  Promise<ApiResponseType<CommitInfoResponseType>> {
    try {
      let owner, repo, url, sha
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
      if (!options.sha) {
        const req = await this.repo.get_repo_info({ owner, repo })
        sha = req.data?.default_branch
      } else {
        sha = options.sha
      }
      const req = await this.get(`/repos/${owner}/${repo}/commits/${sha}`)
      return req
    } catch (error) {
      throw new Error(`获取提交信息失败: ${(error as Error).message}`)
    }
  }
}
