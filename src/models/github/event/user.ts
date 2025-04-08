import { formatDate } from '@/common'
import { GitHub } from '@/models/github/event/github'
import { ApiResponseType, UserParamType, UserResponseType } from '@/types'

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
  constructor (private options: GitHub) {
    this.get = options.get.bind(options)
    this.post = options.post.bind(options)
    this.BaseUrl = options.BaseUrl
    this.userToken = options.userToken ?? null
  }

  /**
   * 通过访问令牌获取用户信息
   * @deprecated 暂未实现
   */
  private async get_user_info_by_access () {
  }

  /**
   * 获取指定的用户信息
   * 不止可以获取用户信息还可以获取组织信息
   * @param options - 用户参数
   * @param options.username - 用户名或组织名
   */
  public async get_user_info (options: UserParamType): Promise<ApiResponseType<UserResponseType>> {
    if (!options.username) {
      throw new Error('用户名或组织名不能为空')
    }
    this.options.setRequestConfig({
      token: this.userToken
    })
    try {
      const req = await this.get(`/users/${options.username}`)
      if (req.statusCode === 401) {
        throw new Error('未授权访问或令牌过期无效')
      } else if (req.statusCode === 404) {
        throw new Error('用户或组织不存在')
      }
      if (req.data) {
        req.data.created_at = formatDate(req.data.created_at)
        req.data.updated_at = formatDate(req.data.updated_at)
      }
      return req
    } catch (error) {
      throw new Error(`获取用户或组织信息失败: ${(error as Error).message}`)
    }
  }
}
