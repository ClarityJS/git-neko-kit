import { capitalize } from 'lodash-es'

import {
  DeleteReleaseSuccessMsg,
  isNotDeleteReleaseMsg,
  MissingRepoOwnerOrNameMsg,
  NotReleaseIdMsg,
  NotReleaseOrRepoMsg,
  NotTagParamMsg
} from '@/common'
import { GitHubClient } from '@/models/platform/github/base'
import type {
  ApiResponseType,
  CreateReleaseParamType,
  CreateReleaseResponseType,
  DeleteReleaseParamType,
  DeleteReleaseResponseType,
  ReleaseInfoByTagParamType,
  ReleaseInfoByTagResponseType,
  ReleaseInfoParamType,
  ReleaseInfoResponseType,
  ReleaseLatestParamTypeType,
  ReleaseLatestResponseType,
  ReleaseListParamType,
  ReleaseListResponseType,
  UpdateReleaseParamType,
  UpdateReleaseResponseType
} from '@/types'

/**
 * Release 提交操作类
 *
 * 提供对GitHub Release的CRUD操作，包括：
 * - 获取一个Release信息
 * - 获取一个仓库下Release列表
 */
export class Release extends GitHubClient {
  constructor (base: GitHubClient) {
    super(base)
    this.userToken = base.userToken
    this.ApiUrl = base.ApiUrl
    this.BaseUrl = base.BaseUrl
  }

  /**
   * 获取一个Release信息
   * 权限:
   * — Contents: read-only
   * 如果请求公共仓库可无需以上权限
   * @param options Release参数信息
   * - release_id: Release ID
   * - owner: 拥有者
   * - repo: 仓库名
   * @returns Release信息
   * @example
   * ```ts
   * const release = await get_release_info({ owner: 'owner', repo:'repo', release_id: 1 })
   * console.log(release) // Release信息
   * ```
   */
  public async get_release_info (
    options: ReleaseInfoParamType
  ): Promise<ApiResponseType<ReleaseInfoResponseType>> {
    if (!options.owner || !options.repo) throw new Error(MissingRepoOwnerOrNameMsg)
    if (!options.release_id) throw new Error(NotReleaseIdMsg)
    try {
      const { owner, repo, release_id } = options
      const res = await this.get(`/repos/${owner}/${repo}/releases/${release_id}`)
      if (res.statusCode === 404) {
        throw new Error(NotReleaseOrRepoMsg)
      }
      if (res.data) {
        const ReleaseData: ReleaseInfoResponseType = {
          id: res.data.id,
          tag_name: res.data.tag_name,
          target_commitish: res.data.target_commitish,
          name: res.data.name ?? null,
          body: res.data.body ?? null,
          prerelease: Boolean(res.data.prerelease),
          author: {
            id: res.data.author.id,
            login: res.data.author.login,
            name: res.data.author.name,
            email: res.data.author.email,
            html_url: res.data.author.html_url,
            avatar_url: res.data.author.avatar_url,
            type: capitalize((res.data.author).type.toLowerCase())
          },
          assets: res.data.assets.map((asset: Record<string, any>) => ({
            url: asset.url,
            browser_download_url: asset.browser_download_url
          })),
          created_at: res.data.created_at
        }
        res.data = ReleaseData
      }
      return res
    } catch (error) {
      throw new Error(`获取Release信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取最新Release信息
   * 权限:
   * — Contents: read-only
   * 如果请求公共仓库可无需以上权限
   * @param options 仓库信息
   * - owner: 拥有者
   * - repo: 仓库名
   * - url: 仓库地址
   * ower和repo参数与url参数传入其中一种
   * @returns Release信息
   * @example
   * ```ts
   * const release = await get_release_latest({ owner: 'owner', repo:'repo' })
   * console.log(release) // Release信息
   * ```
   * */
  public async get_release_latest (
    options: ReleaseLatestParamTypeType
  ): Promise<ApiResponseType<ReleaseLatestResponseType>> {
    if (!options.owner || !options.repo) throw new Error(MissingRepoOwnerOrNameMsg)
    try {
      const { owner, repo } = options
      const url = `/repos/${owner}/${repo}/releases/latest`
      const res = await this.get(url)
      if (res.statusCode === 404) {
        throw new Error(NotReleaseOrRepoMsg)
      }
      if (res.data) {
        const ReleaseData: ReleaseLatestResponseType = {
          id: res.data.id,
          tag_name: res.data.tag_name,
          target_commitish: res.data.target_commitish,
          name: res.data.name ?? null,
          body: res.data.body ?? null,
          prerelease: Boolean(res.data.prerelease),
          author: {
            id: res.data.author.id,
            login: res.data.author.login,
            name: res.data.author.name,
            email: res.data.author.email,
            html_url: res.data.author.html_url,
            avatar_url: res.data.author.avatar_url,
            type: capitalize((res.data.author).type.toLowerCase())
          },
          assets: res.data.assets.map((asset: Record<string, any>) => ({
            url: asset.url,
            browser_download_url: asset.browser_download_url
          })),
          created_at: res.data.created_at
        }
        res.data = ReleaseData
      }
      return res
    } catch (error) {
      throw new Error(`获取最新Release信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取指定标签的Release信息
   * @param options Release参数信息
   * - release_id: Release ID
   * - owner: 拥有者
   * - repo: 仓库名
   * - url: 仓库地址
   * - tag: 标签名称
   * ower和repo参数与url参数传入其中一种
   * @returns 获取指定标签的Release信息
   * @example
   * ```ts
   * const release = await get_release_by_tag({ owner: 'owner', repo:'repo', release_id: 1 })
   * console.log(release) // Release信息
   * ```
   */
  public async get_release_by_tag (
    options: ReleaseInfoByTagParamType
  ): Promise<ApiResponseType<ReleaseInfoByTagResponseType>> {
    if (!options.owner || !options.repo) throw new Error(MissingRepoOwnerOrNameMsg)
    if (!options.tag) throw new Error(NotTagParamMsg)
    try {
      const { owner, repo, tag } = options
      const url = `/repos/${owner}/${repo}/releases/tags/${tag}`
      const res = await this.get(url)
      if (res.statusCode === 404) {
        throw new Error(NotReleaseOrRepoMsg)
      }
      if (res.data) {
        const ReleaseData: ReleaseInfoByTagResponseType = {
          id: res.data.id,
          tag_name: res.data.tag_name,
          target_commitish: res.data.target_commitish,
          name: res.data.name ?? null,
          body: res.data.body ?? null,
          prerelease: Boolean(res.data.prerelease),
          author: {
            id: res.data.author.id,
            login: res.data.author.login,
            name: res.data.author.name,
            email: res.data.author.email,
            html_url: res.data.author.html_url,
            avatar_url: res.data.author.avatar_url,
            type: capitalize((res.data.author).type.toLowerCase())
          },
          assets: res.data.assets.map((asset: Record<string, any>) => ({
            url: asset.url,
            browser_download_url: asset.browser_download_url
          })),
          created_at: res.data.created_at
        }
        res.data = ReleaseData
      }
      return res
    } catch (error) {
      throw new Error(`通过Tag获取Release 信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取一个仓库下Release列表
   * 权限:
   * — Contents: read-only
   * 如果请求公共仓库可无需以上权限
   * @param options 仓库信息
   * - owner: 拥有者
   * - repo: 仓库名
   * - url: 仓库地址
   * - per_page: 每页数量
   * - page: 页码
   * ower和repo参数与url参数传入其中一种
   * @returns Release列表
   * @example
   * ```ts
   * const releases = await get_releases_list({ owner: 'owner', repo: 'repo' })
   * console.log(releases) // Release列表
   * ```
   */
  public async get_releases_list (
    options: ReleaseListParamType
  ): Promise<ApiResponseType<ReleaseListResponseType>> {
    if (!options.owner || !options.repo) throw new Error(MissingRepoOwnerOrNameMsg)
    try {
      const { owner, repo } = options
      const { ...queryOptions } = options
      const params: Record<string, string> = {}
      if (queryOptions.per_page) params.per_page = queryOptions.per_page.toString()
      if (queryOptions.page) params.per_page = queryOptions.page.toString()
      const url = `/repos/${owner}/${repo}/releases`
      const res = await this.get(url, params)
      if (res.statusCode === 404) {
        throw new Error(NotReleaseOrRepoMsg)
      }
      if (res.data) {
        const ReleaseData:ReleaseListResponseType = res.data.map((
          release: Record<string, any>): ReleaseInfoResponseType => ({
          id: release.id,
          tag_name: release.tag_name,
          target_commitish: release.target_commitish,
          name: release.name ?? null,
          body: release.body ?? null,
          prerelease: Boolean(release.prerelease),
          author: {
            id: release.author.id,
            login: release.author.login,
            name: release.author.name,
            email: release.author.email,
            html_url: release.author.html_url,
            avatar_url: release.author.avatar_url,
            type: capitalize((release.author).type.toLowerCase())
          },
          assets: release.assets.map((asset: any) => ({
            url: asset.url,
            browser_download_url: asset.browser_download_url
          })),
          created_at: release.created_at
        }))
        res.data = ReleaseData
      }
      return res
    } catch (error) {
      throw new Error(`获取Release列表失败: ${(error as Error).message}`)
    }
  }

  /**
   * 创建一个Release
   * 权限:
   * — Contents: write
   * — Contents: write / Workflows: write
   * 需以上权限之一
   * @param options Release信息
   * - owner: 拥有者
   * - repo: 仓库名
   * - tag_name: 标签名
   * - target_commitish: 目标提交哈希
   * - name: 发布名称
   * - body: 发布描述
   * - prerelease: 是否为预发布
   * @returns Release信息
   * @example
   * ```ts
   * const release = await create_release({ owner: 'owner', repo:'repo', tag_name: 'v1.0.0', target_commitish: 'main', name: 'v1.0.0', body: 'v1.0.0', prerelease: false })
   * console.log(release) // Release信息
   * ```
   */
  public async create_release (
    options: CreateReleaseParamType
  ): Promise<ApiResponseType<CreateReleaseResponseType>> {
    try {
      if (!options.owner || !options.repo) {
        throw new Error(MissingRepoOwnerOrNameMsg)
      }
      const { owner, repo, ...ReleaseOptions } = options
      const url = `/repos/${owner}/${repo}/releases`
      const res = await this.post(url, ReleaseOptions)
      if (res.statusCode === 404) {
        throw new Error(NotReleaseOrRepoMsg)
      }
      if (res.data) {
        const ReleaseData: CreateReleaseResponseType = {
          id: res.data.id,
          tag_name: res.data.tag_name,
          target_commitish: res.data.target_commitish,
          name: res.data.name ?? null,
          body: res.data.body ?? null,
          prerelease: Boolean(res.data.prerelease),
          author: {
            id: res.data.author.id,
            login: res.data.author.login,
            name: res.data.author.name,
            email: res.data.author.email,
            html_url: res.data.author.html_url,
            avatar_url: res.data.author.avatar_url,
            type: capitalize((res.data.author).type.toLowerCase())
          },
          assets: res.data.assets.map((asset: Record<string, any>) => ({
            url: asset.url,
            browser_download_url: asset.browser_download_url
          })),
          created_at: res.data.created_at
        }
        res.data = ReleaseData
      }
      return res
    } catch (error) {
      throw new Error(`创建Release失败: ${(error as Error).message}`)
    }
  }

  /**
    * 创建Release
   * 权限:
   * — Contents: write
   * @param options Release信息
   * - owner: 拥有者
   * - repo: 仓库名
   * - tag_name: 标签名
   * - target_commitish: 目标提交哈希
   * - name: 发布名称
   * - body: 发布描述
   * - prerelease: 是否为预发布
    * @returns 创建Release的响应对象
    * @example
    * ```ts
    * const release = base.get_release()
    * const res = await release.create_release({
    *   tag_name: 'v1.0.0',
    *   target_commitish: 'master',
    *   name: 'v1.0.0',
    *   body: 'Release v1.0.0',
    *   prerelease: false
    * })
    * console.log(res)
    * ```
    */
  public async update_release (
    options: UpdateReleaseParamType
  ): Promise<ApiResponseType<UpdateReleaseResponseType>> {
    try {
      if (!options.owner || !options.repo) {
        throw new Error(MissingRepoOwnerOrNameMsg)
      }
      const { owner, repo, ...ReleaseOptions } = options
      const url = `/repos/${owner}/${repo}/releases`
      const res = await this.patch(url, null, ReleaseOptions)
      if (res.statusCode === 404) {
        throw new Error(NotReleaseOrRepoMsg)
      }
      if (res.data) {
        const ReleaseData: UpdateReleaseResponseType = {
          id: res.data.id,
          tag_name: res.data.tag_name,
          target_commitish: res.data.target_commitish,
          name: res.data.name ?? null,
          body: res.data.body ?? null,
          prerelease: Boolean(res.data.prerelease),
          author: {
            id: res.data.author.id,
            login: res.data.author.login,
            name: res.data.author.name,
            email: res.data.author.email,
            html_url: res.data.author.html_url,
            avatar_url: res.data.author.avatar_url,
            type: capitalize((res.data.author).type.toLowerCase())
          },
          assets: res.data.assets.map((asset: Record<string, any>) => ({
            url: asset.url,
            browser_download_url: asset.browser_download_url
          })),
          created_at: res.data.created_at
        }
        res.data = ReleaseData
      }
      return res
    } catch (error) {
      throw new Error(`更新Release失败: ${(error as Error).message}`)
    }
  }

  /**
   * 删除Release
   * 权限:
   * — Contents: write
   * @param options Release参数信息
   * - release_id: Release ID
   * - owner: 拥有者
   * - repo: 仓库名
   * - url: 仓库地址
   * ower和repo参数与url参数传入其中一种
   * @returns 删除结果
   * @example
   * ```ts
   * const release = await delete_release({ owner: 'owner', repo:'repo', release_id: 1 })
   * console.log(release) // 删除结果
   * ```
   */
  public async delete_release (
    options: DeleteReleaseParamType
  ): Promise<ApiResponseType<DeleteReleaseResponseType>> {
    if (!options.owner || !options.repo) throw new Error(MissingRepoOwnerOrNameMsg)
    try {
      const { owner, repo } = options
      if (!options.release_id) throw new Error(NotReleaseIdMsg)
      const { release_id } = options
      const url = `/repos/${owner}/${repo}/releases/${release_id}`
      const res = await this.delete(url)
      let msg
      if (res.statusCode === 204) {
        msg = DeleteReleaseSuccessMsg
      } else {
        msg = isNotDeleteReleaseMsg
      }
      res.data = {
        info: msg
      }
      return res
    } catch (error) {
      throw new Error(`删除Release失败${(error as Error).message}`)
    }
  }
}
