/** 代理地址类型 */
export type ProxyUrlType = string
/** 代理类型 */
export type ProxyType = 'reverse' | 'common'
/** Git类型 */
export type GitType = 'github' | 'gitee' | 'gitcode'

/**
 * 通用代理配置
 */
export interface CommonProxyType {
  type: 'common'
  /** 代理基础地址 */
  address: ProxyUrlType
}

/**
 * 反向代理配置
 */
export interface ReverseProxyType {
  type: 'reverse'
  /** 代理基础地址 */
  address: ProxyUrlType
}
/**
 * HTTP 代理配置
 */
export interface HttpProxyType {
  type: 'http'
  address: ProxyUrlType
}

/**
 * HTTPS 代理配置
 */
export interface HttpsProxyType {
  type: 'https'
  address: ProxyUrlType
}

/**
 * SOCKS5 代理配置
 */
export interface SocksProxyType {
  type: 'socks'
  address: ProxyUrlType
}

/**
 * SOCKS5 代理配置
 */
export interface Socks5ProxyType {
  type: 'socks5'
  address: ProxyUrlType
}

/** 代理配置参数类型 */
export type ProxyParamsType =
  | HttpProxyType
  | HttpsProxyType
  | SocksProxyType
  | Socks5ProxyType
  | CommonProxyType
  | ReverseProxyType
