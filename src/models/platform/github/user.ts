import {
  formatDate,
  getContributionData,
  isOrgMsg,
  NotOrgOrUserMsg,
  NotOrgOrUserParamMsg,
  NotPerrmissionMsg,
  NotUserMsg,
  NotUserParamMsg
} from '@/common'
import { Base } from '@/models/platform/github/base'
import {
  ApiResponseType,
  ContributionResult,
  UserIdParamType,
  UserNameParamType,
  UserResponseType
} from '@/types'

/**
 * Base 用户操作类
 *
 * 提供对GitHub用户的CRUD操作，包括：
 * - 获取用户信息
 * - 关注指定用户
 *
 * @class User
 * @property {Function} get - 封装的GET请求方法
 * @property {Function} post - 封装的POST请求方法
 * @property {string} BaseUrl - GitHub 基础URL
 * @property {string} ApiUrl - GitHub API端点URL
 * @property {string} jwtToken - 认证令牌
 */
export class User extends Base {
  constructor (base: Base) {
    super(base)
    this.userToken = base.userToken
    this.ApiUrl = base.ApiUrl
    this.BaseUrl = base.BaseUrl
  }

  /**
   * 获取指定的用户信息
   * 不止可以获取用户信息还可以获取组织信息
   * @param options - 用户参数
   * @param options.username - 用户名或组织名
   */
  public async get_user_info (options: UserNameParamType):
  Promise<ApiResponseType<UserResponseType>> {
    try {
      if (!options.username) {
        throw new Error(NotOrgOrUserParamMsg)
      }
      this.setRequestConfig({
        token: this.userToken
      })
      const req = await this.get(`/users/${options.username}`)
      if (req.statusCode === 401) {
        throw new Error(NotPerrmissionMsg)
      } else if (req.statusCode === 404) {
        throw new Error(NotOrgOrUserMsg)
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
   * 通过用户id获取用户信息
   * user_id 不是用户名, 而是用户的唯一标识符，
   * @param options - 用户参数
   * @param options.user_id - 用户id
   * @returns 用户信息
   */
  public async get_user_info_by_user_id (options: UserIdParamType):
  Promise<ApiResponseType<UserResponseType>> {
    try {
      if (!options.user_id) {
        throw new Error(NotUserParamMsg)
      }
      this.setRequestConfig({
        token: this.userToken
      })
      const req = await this.get(`/user/${options.user_id}`)
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
      throw new Error(`通过用户id获取用户${options.user_id}信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 通过访问令牌获取用户信息
   */
  public async get_user_info_by_token ():
  Promise<ApiResponseType<UserResponseType>> {
    try {
      this.setRequestConfig({
        token: this.userToken
      })
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
   * 获取用户贡献数据
   * @param options - 用户参数
   * @param options.username - 用户名
   * @returns 用户贡献数据
   */
  public async get_user_contribution (options: UserNameParamType):
  Promise<ApiResponseType<ContributionResult>> {
    try {
      if (!options.username) {
        throw new Error(NotUserParamMsg)
      }
      const userInfo = await this.get_user_info({ username: options.username })
      if (userInfo.data.type === 'Organization') {
        throw new Error(`${isOrgMsg}获取贡献日历`)
      }
      this.setRequestConfig({
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

      const res = await getContributionData(req.data)
      return {
        ...req,
        data: res
      }
    } catch (error) {
      throw new Error(`获取用户${options.username}贡献信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 快速获取获取用户id
   * 该方法会自动获取当前用户的id，需要传入token
   * @returns 用户id
   * @example
   * ```ts
   * const userId = await user.get_user_id()
   * console.log(userId)
   */
  public async get_user_id (): Promise<number | null> {
    try {
      return (await this.get_user_info_by_token()).data.id
    } catch {
      return null
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
  public async get_username (): Promise<string | null> {
    try {
      return (await this.get_user_info_by_token()).data.login
    } catch {
      return null
    }
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
    try {
      return (await this.get_user_info_by_token()).data.name
    } catch {
      return null
    }
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
    try {
      return (await this.get_user_info_by_token()).data.email
    } catch {
      return null
    }
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
  public async get_avatar_url (): Promise<string | null> {
    try {
      return (await this.get_user_info_by_token()).data.avatar_url
    } catch {
      return null
    }
  }
}
