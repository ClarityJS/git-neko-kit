import {
  formatDate,
  getContributionData,
  isOrgMsg,
  NotOrgOrRepoMsg,
  NotOrgOrUserParamMsg,
  NotPerrmissionMsg,
  NotUserMsg,
  NotUserParamMsg
} from '@/common'
import { GitHub } from '@/models/github/github'
import {
  ApiResponseType,
  ContributionResult,
  UserNameParamType,
  UserResponseType
} from '@/types'

/**
 * GitHub 用户操作类
 *
 * 提供对GitHub用户的CRUD操作，包括：
 * - 获取用户信息
 * - 关注指定用户
 *
 * @class User
 * @property {Function} get - 封装的GET请求方法
 * @property {Function} post - 封装的POST请求方法
 * @property {string} BaseUrl - GitHub API基础URL
 * @property {string} ApiUrl - GitHub API端点URL
 * @property {string} jwtToken - 认证令牌
 */
export class User {
  private get: GitHub['get']
  private post: GitHub['post']
  private BaseUrl: string
  private userToken: string | null

  /**
   * 构造函数
   * @param options - GitHub实例配置对象
   */
  constructor (private options: GitHub) {
    this.get = options.get.bind(options)
    this.post = options.post.bind(options)
    this.BaseUrl = options.BaseUrl
    this.userToken = options.userToken
  }

  /**
   * 通过访问令牌获取用户信息
   */
  public async get_user_info_by_token ():
  Promise<ApiResponseType<UserResponseType>> {
    this.options.setRequestConfig({
      token: this.userToken
    })
    try {
      const req = await this.get('/user')
      if (req.statusCode === 401) {
        throw new Error(NotPerrmissionMsg)
      } else if (req.statusCode === 404) {
        throw new Error(NotUserMsg)
      }
      if (req.data) {
        req.data.created_at = await formatDate(req.data.created_at)
        req.data.updated_at = await formatDate(req.data.updated_at)
      }
      return req
    } catch (error) {
      throw new Error(`获取授权用户信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取指定的用户信息
   * 不止可以获取用户信息还可以获取组织信息
   * @param options - 用户参数
   * @param options.username - 用户名或组织名
   */
  public async get_user_info (options: UserNameParamType):
  Promise<ApiResponseType<UserResponseType>> {
    if (!options.username) {
      throw new Error(NotOrgOrUserParamMsg)
    }
    this.options.setRequestConfig({
      token: this.userToken
    })
    try {
      const req = await this.get(`/users/${options.username}`)
      if (req.statusCode === 401) {
        throw new Error(NotPerrmissionMsg)
      } else if (req.statusCode === 404) {
        throw new Error(NotOrgOrRepoMsg)
      }
      if (req.data) {
        req.data.created_at = await formatDate(req.data.created_at)
        req.data.updated_at = await formatDate(req.data.updated_at)
      }
      return req
    } catch (error) {
      throw new Error(`获取用户或组织信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取用户贡献数据
   * @param options - 用户参数
   * @param options.username - 用户名
   * @returns 用户贡献数据
   */
  public async get_user_contribution (options: UserNameParamType):
  Promise<ApiResponseType<ContributionResult>> {
    if (!options.username) {
      throw new Error(NotUserParamMsg)
    }
    try {
      const userInfo = await this.get_user_info({ username: options.username })
      if (userInfo.data.type === 'Organization') {
        throw new Error(`${isOrgMsg}获取贡献日历`)
      }
      this.options.setRequestConfig({
        url: this.BaseUrl
      })
      const req = await this.get(`/${options.username}`, {
        action: 'show',
        controller: 'profiles',
        tab: 'contributions',
        user_id: options.username
      }, {
        'X-Requested-With': 'XMLHttpRequest'
      })

      if (req.statusCode === 404) {
        throw new Error(NotUserParamMsg)
      }

      const res = getContributionData(req.data)
      return {
        ...req,
        data: res
      }
    } catch (error) {
      throw new Error(`获取用户贡献信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 快速获取获取用户名
   * 该方法会自动获取当前用户的用户名，需要传入token
   * @returns 用户名
   * @example
   * ```ts
   * const username = await user.get_username()
   * console.log(username)
   * ```
   */
  public async get_username (): Promise<string> {
    return (await this.get_user_info_by_token()).data.login
  }

  /**
   * 快速获取获取用户昵称
   * 该方法会自动获取当前用户的昵称，需要传入token
   * @remarks 用户昵称可能会为null
   * @returns 昵称
   * @example
   * ```ts
   * const nickname = await user.get_nickname()
   * console.log(nickname)
   * ```
   */
  public async get_nickname (): Promise<string | null> {
    return (await this.get_user_info_by_token()).data.name
  }

  /**
   * 快速获取获取用户邮箱
   * 该方法会自动获取当前用户的邮箱，需要传入token
   * @returns 邮箱
   * @example
   * ```ts
   * const email = await user.get_email()
   * console.log(email)
   * ```
   */
  public async get_user_email (): Promise<string | null> {
    return (await this.get_user_info_by_token()).data.email
  }

  /**
   * 快速获取获取用户头像地址
   * 该方法会自动获取当前用户的头像地址，需要传入token
   * @returns 头像地址
   * @example
   * ```ts
   * const avatarUrl = await user.get_avatar_url()
   * console.log(avatarUrl)
   * ```
   */
  public async get_avatar_url (): Promise<string> {
    return (await this.get_user_info_by_token()).data.avatar_url
  }
}
