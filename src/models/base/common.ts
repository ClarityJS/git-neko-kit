import { v4 as uuidv4 } from 'uuid'

import { ApiType, ProxyType, ProxyUrlType } from '@/types'

/**
 * 获取API基础URL方法
 * @param type - GIt类型, 默认github, 可选gitee, gitcode
 * @param proxyUrl - 代理URL，可选，默认不使用
 * @param proxyType - 代理类型，默认common，可选reverse, common
 * @returns 返回URL
 */
export function ApiBaseUrl (
  type: ApiType = 'github',
  proxyUrl?: ProxyUrlType,
  proxyType: ProxyType = 'common'
): string {
  const urlMap: Record<ApiType, string> = {
    github: 'api.github.com',
    gitee: 'gitee.com/api/v5',
    gitcode: 'api.gitcode.com/api/v5'
  }

  if (!proxyUrl) {
    return `https://${urlMap[type ?? 'github']}`.replace(/\/$/, '')
  }

  const protocol = proxyUrl.match(/^(https?):/)?.[1] ?? 'https'
  const cleanUrl = `${protocol}://${proxyUrl.replace(/^https?:\/\/|\/$/g, '')}`

  return proxyType === 'common'
    ? cleanUrl
    : `${cleanUrl}/${urlMap[type]}`
}

/**
 * 获取基础URL方法
 * @param type - GIt类型, 默认github, 可选gitee, gitcode
 * @param proxyUrl - 代理URL，可选，默认不使用
 * @returns 返回URL
 */
export function BaseUrl (
  type: ApiType = 'github',
  proxyUrl?: ProxyUrlType,
  proxyType: ProxyType = 'common'
): string {
  const urlMap: Record<ApiType, string> = {
    github: 'github.com',
    gitee: 'gitee.com',
    gitcode: 'gitcode.com'
  }
  if (!proxyUrl) {
    return `https://${urlMap[type ?? 'github']}`.replace(/\/$/, '')
  }
  const protocol = proxyUrl.match(/^(https?):/)?.[1] ?? 'https'
  const cleanUrl = `${protocol}://${proxyUrl.replace(/^https?:\/\/|\/$/g, '')}`

  return proxyType === 'common'
    ? cleanUrl
    : `${cleanUrl}/${urlMap[type]}`
}

/**
 * 生成一个用户唯一的标识符
 * @returns 生成的唯一标识符
 * @example
 * ```ts
 * const stateId = await create_state_id() // 输出 "34523452345234523452345234523452"
 * ```
 */
export async function create_state_id (): Promise<string> {
  return Promise.resolve(uuidv4().replace(/-/g, ''))
}
