export interface AccessTokenType {
  /** 访问令牌 */
  access_token: string;
}
export interface AccessCodeType {
  /** 授权码 */
  code: string;
}
export interface RefreshTokenType {
  /** 刷新令牌 */
  refresh_token: string;
}
export interface UserNameParamType {
  /** 用户名 */
  username: string;
}
export interface OrganizationNameParamType {
  /** 组织登录名 */
  org: string;
}
export interface UserIdParamType {
  /** 用户id */
  user_id: number;
}

export interface RepoOwnerParamType {
  /** 仓库的拥有者 */
  owner: string;
}
export interface RepoNameParamType {
  /** 仓库的名称 */
  repo: string;
}

export interface RepoUrlParamType {
  /** 仓库地址 */
  url: string;
}

export interface ShaParamType {
  /** 仓库的SHA值 */
  sha: string;
}

export interface formatParamType {
  /** 是否格式化 */
  format: boolean;
}

/**
 * 一个仓库基本参数
 * 包含：
 * - owner: 仓库拥有者
 * - repo: 仓库名称
 */
export type RepoBaseParamType = RepoOwnerParamType & RepoNameParamType

/**
 * 一个仓库参数, 可以是基本参数，也可以是仓库地址
 * 包含：
 * - owner: 仓库拥有者
 * - repo: 仓库名称
 * - url: 仓库地址
 */
export type RepoParamType = RepoBaseParamType | RepoUrlParamType

/**
 * 议题参数
 */
export interface IssueIdParamType {
  /** 问题id */
  issue_id: number | string;
}

/** guthub基础入口类型 */
export interface GitHubAuthType {
  /** 私钥内容 */
  Private_Key: string
  /** Base App Client ID */
  Client_ID: string
  /** Base App Client Secret */
  Client_Secret: string
  /** WebHook Secret */
  WebHook_Secret: string
  /** 是否格式化 */
  format?: formatParamType['format']
}
