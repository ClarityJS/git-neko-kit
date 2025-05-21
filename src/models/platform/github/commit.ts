import _ from 'lodash'

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
  CommitInfoResponseType,
  DiffEntry,
  ParentCommit
} from '@/types'

/**
 * Commit 提交操作类
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
   * 权限:
   * — Contents: read-only
   * @param options - 提交信息参数对象
   * - url 仓库URL地址
   * - owner 仓库拥有者
   * - repo 仓库名称
   * url参数和owner、repo参数传入其中的一种
   * - sha 提交的SHA值，如果不提供，则默认获取仓库的默认分支的最新提交信息
   * - format - 可选，是否格式化提交信息, 默认为false
   * @returns 提交信息
   * @example
   * ```ts
   * const commitInfo = await commit.get_commit_info({ owner: 'owner', repo: 'repo' })
   * console.log(commitInfo)
   * ```
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
        const default_branch = await repoInfo.get_repo_default_branch({ owner, repo })
        sha = default_branch
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
      if (res.data) {
        const message = res.data?.commit?.message ?? ''
        const [title, ...bodyParts] = message.split('\n')
        res.data = {
          url: res.data.url,
          sha: res.data.sha,
          html_url: res.data.html_url,
          comments_url: res.data.comments_url,
          commit: {
            url: res.data.commit.url,
            author: {
              id: res.data.author.id,
              login: res.data.author.login,
              name: res.data.commit.author.name,
              email: res.data.commit.author.email,
              html_url: res.data.author.html_url,
              type: _.capitalize(String(res.data.author.type).toLowerCase()),
              date: isFormat
                ? formatDate(res.data.commit.author.date)
                : res.data.commit.author.date
            },
            committer: {
              id: res.data.committer.id,
              login: res.data.committer.login,
              name: res.data.commit.committer.name,
              email: res.data.commit.committer.email,
              html_url: res.data.committer.html_url,
              type: _.capitalize(String(res.data.committer.type).toLowerCase()),
              date: isFormat
                ? formatDate(res.data.commit.committer.date)
                : res.data.commit.committer.date
            },
            message: res.data.commit.message,
            ...(isFormat && {
              title,
              body: bodyParts
            }),
            tree: {
              url: res.data.commit.tree.url,
              sha: res.data.commit.tree.sha
            }

          },
          parents: res.data.parents.map((parent: ParentCommit) => ({
            sha: parent.sha,
            url: parent.url
          })),
          status: {
            additions: res.data.stats.additions,
            deletions: res.data.stats.deletions,
            total: res.data.stats.total
          },
          files: res.data.files.map((file: DiffEntry) => ({
            sha: file.sha,
            filename: file.filename,
            status: file.status,
            additions: file.additions,
            deletions: file.deletions,
            changes: file.changes,
            blob_url: file.blob_url,
            raw_url: file.raw_url
          }))
        }
      }
      return res
    } catch (error) {
      throw new Error(`获取提交信息失败: ${(error as Error).message}`)
    }
  }
}
