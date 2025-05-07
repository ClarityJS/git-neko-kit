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
 * 提供对GitHub Commit的CRUD操作，包括：
 * - 获取一个提交信息
 */
export class Commit extends Base {
  constructor (base: Base) {
    super(base)
    this.userToken = base.userToken
    this.ApiUrl = base.ApiUrl
    this.BaseUrl = base.BaseUrl
  }

  /**
   * 获取一个提交信息
   * @param options - 提交信息参数对象
   * - url 仓库URL地址
   * - owner 仓库拥有者
   * - repo 仓库名称
   * url参数和owner、repo参数传入其中的一种
   * - sha 提交的SHA值，如果不提供，则默认获取仓库的默认分支的最新提交信息
   * - format - 可选，是否格式化提交信息, 默认为false
   */
  public async get_commit_info (
    options: CommitInfoParamType
  ): Promise<ApiResponseType<CommitInfoResponseType>> {
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      let owner, repo, url, sha
      if ('url' in options) {
        url = options.url
        const info = parse_git_url(url)
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
        const res = await repoInfo.get_repo_info({ owner, repo })
        sha = res.data?.default_branch
      } else {
        sha = options.sha
      }
      const res = await this.get(`/repos/${owner}/${repo}/commits/${sha}`)
      switch (res.statusCode) {
        case 401:
          throw new Error(NotPerrmissionMsg)
        case 404:
          throw new Error(NotCommitOrRepoMsg)
        case 422:
          throw new Error(NotCommitMsg)
      }

      const isFormat = options.format ?? this.format
      if (isFormat) {
        if (res.data?.commit) {
          res.data.commit = {
            ...res.data.commit,
            author: res.data.commit.author
              ? {
                  ...res.data.commit.author,
                  date: await formatDate(res.data.commit.author.date)
                }
              : null,
            committer: res.data.commit.committer
              ? {
                  ...res.data.commit.committer,
                  date: await formatDate(res.data.commit.committer.date)
                }
              : null,
            verification: res.data.commit.verification
              ? {
                  ...res.data.commit.verification,
                  verified_at: res.data.commit.verification.verified_at
                    ? await formatDate(res.data.commit.verification.verified_at)
                    : null
                }
              : null
          }
        }
        const message = res.data?.commit?.message ?? ''
        const [title, ...bodyParts] = message.split('\n')
        res.data = {
          ...res.data,
          commit: {
            ...res.data.commit,
            title: title.trim(),
            body: bodyParts.join('\n').trim()
          }
        }
      }
      return res
    } catch (error) {
      throw new Error(`获取提交信息失败: ${(error as Error).message}`)
    }
  }
}
