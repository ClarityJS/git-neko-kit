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
