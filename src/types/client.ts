import { AppClientType, formatParamType } from '@/types/platform/base'

/** GitHub客户端类型 */
export interface GitHubClientType extends AppClientType {
  /** 是否格式化 */
  format?: formatParamType['format']
}

/** 客户端类型 */
export interface ClientType {
  github: GitHubClientType;
}
