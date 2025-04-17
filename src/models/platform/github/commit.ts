import {
  formatDate,
  NotCommitMsg,
  NotCommitOrRepoMsg,
  NotParamMsg,
  NotPerrmissionMsg,
  parse_git_url
} from '@/common'
import { Base } from '@/models/platform/github/base'
import {
  ApiResponseType,
  CommitInfoParamType,
  CommitInfoResponseType
} from '@/types'

/**
 * Base 提交操作类
 *
 * 提供Commit相关的操作方法，包括获取最新提交记录、获取指定的提交记录等。

 *
 * @class Commit
 * @property {Function} get - 封装的GET请求方法
 * @property {Function} post - 封装的POST请求方法
 * @property {string} BaseUrl - GitHub 基础URL
 * @property {string} ApiUrl - GitHub API端点URL
 * @property {string} jwtToken - 认证令牌
 */
export class Commit extends Base {
  constructor (base: Base) {
    super(base)
    this.userToken = base.userToken
    this.ApiUrl = base.ApiUrl
    this.BaseUrl = base.BaseUrl
  }

  /**
   * 获取提交信息
   * @param options - 提交信息参数对象，必须包含以下组合之一：
   * - {url: string, sha: string} 仓库URL和提交哈希
   * - {owner: string, repo: string, sha: string} 仓库拥有者、名称和提交哈希
   * - options.format - 可选，是否格式化提交信息, 默认为false
   */
  public async get_commit_info (
    options: CommitInfoParamType
  ): Promise<ApiResponseType<CommitInfoResponseType>> {
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
        throw new Error(NotParamMsg)
      }
      if (!options.sha) {
        const repoInfo = await this.get_repo()
        const req = await repoInfo.get_repo_info({ owner, repo })
        sha = req.data?.default_branch
      } else {
        sha = options.sha
      }
      const req = await this.get(`/repos/${owner}/${repo}/commits/${sha}`)
      if (req.statusCode === 404) {
        throw new Error(NotCommitOrRepoMsg)
      } else if (req.statusCode === 401) {
        throw new Error(NotPerrmissionMsg)
      } else if (req.statusCode === 422) {
        throw new Error(NotCommitMsg)
      }

      if (req.data?.commit) {
        req.data.commit = {
          ...req.data.commit,
          author: req.data.commit.author
            ? {
                ...req.data.commit.author,
                date: await formatDate(req.data.commit.author.date)
              }
            : null,
          committer: req.data.commit.committer
            ? {
                ...req.data.commit.committer,
                date: await formatDate(req.data.commit.committer.date)
              }
            : null,
          verification: req.data.commit.verification
            ? {
                ...req.data.commit.verification,
                verified_at: req.data.commit.verification.verified_at
                  ? await formatDate(req.data.commit.verification.verified_at)
                  : null
              }
            : null
        }
      }

      if (options.format) {
        const message = req.data?.commit?.message ?? ''
        const [title, ...bodyParts] = message.split('\n')
        req.data = {
          ...req.data,
          commit: {
            ...req.data.commit,
            title: title.trim(),
            body: bodyParts.join('\n').trim()
          }
        }
      }
      return req
    } catch (error) {
      throw new Error(`获取提交信息失败: ${(error as Error).message}`)
    }
  }
}
