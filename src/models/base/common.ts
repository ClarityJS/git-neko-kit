import { v4 as uuidv4 } from 'uuid'

import { ApiType, ReverseProxyCommonUrlType } from '@/types'

/**
 * 获取API基础URL方法
 * @param type - GIt类型, 默认github, 可选gitee, gitcode
 * @param proxyUrl - 代理URL，可选，默认不使用
 * @returns 返回URL
 */
export function ApiBaseUrl (type?: ApiType, proxyUrl?: ReverseProxyCommonUrlType): string {
  const urlMap: Record<ApiType, string> = {
    github: 'api.github.com',
    gitee: 'gitee.com/api/v5',
    gitcode: 'api.gitcode.com/api/v5'
  }

  return `https://${proxyUrl?.replace(/\/$/, '') ?? ''}/${urlMap[type ?? 'github']}`.replace(/\/$/, '')
}

/**
 * 获取基础URL方法
 * @param type - GIt类型, 默认github, 可选gitee, gitcode
 * @param proxyUrl - 代理URL，可选，默认不使用
 * @returns 返回URL
 */
export function BaseUrl (type?: ApiType, proxyUrl?: ReverseProxyCommonUrlType): string {
  const urlMap: Record<ApiType, string> = {
    github: 'github.com',
    gitee: 'gitee.com',
    gitcode: 'gitcode.com'
  }
  return `https://${proxyUrl?.replace(/\/$/, '') ?? ''}/${urlMap[type ?? 'github']}`.replace(/\/$/, '')
}

/**
 * 生成一个用户唯一的标识符
 * @remarks 暂时先不导出，后续可能会用到，先留着
 * @returns 生成的唯一标识符
 */
function create_state_id (): string {
  return uuidv4().replace(/-/g, '')
}
