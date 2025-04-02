/** 反向代理地址 */
export type ReverseProxyCommonUrlType = string
/** Git类型 */
export type ApiType = 'github' | 'gitee' | 'gitcode'

/** 通用代理配置 */
export interface CommonProxy {
  type: 'common'
  /** 代理基础地址 */
  address: string
}

/** HTTP 代理配置 */
export interface HttpProxy {
  type: 'http'
  address: string
}

/** HTTPS 代理配置 */
export interface HttpsProxy {
  type: 'https'
  address: string
}

/** SOCKS5 代理配置 */
export interface SocksProxy {
  type: 'socks'
  address: string
}

/** 代理配置参数类型 */
export type ProxyParamsType =
  | HttpProxy
  | HttpsProxy
  | SocksProxy
  | CommonProxy
