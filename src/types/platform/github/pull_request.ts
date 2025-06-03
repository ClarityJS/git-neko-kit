import { PullRequestIdParamType, RepoBaseParamType } from '@/types/platform/base'

/** 拉取请求信息参数类型 */
export type PullRequestInfoParamType = PullRequestIdParamType & RepoBaseParamType
/** 拉取请求信息响应类型 */
export interface PullRequestInfoResponseType {
  /** 拉取请求的id */
  id: number
  /** 拉取请求的URL */
  html_url: string
  /** 拉取请求的状态 */
  state: string
}
