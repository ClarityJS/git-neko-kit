/** 组织信息参数类型 */
export interface OrgInfoParamType {
  /** 组织名称 */
  org: string
}
/** 组织信息响应类型 */
export interface OrgInfoResponseType {
  /** 组织ID */
  id: number;
  /** 组织名称 */
  login: string;
  /** 组织描述 */
  name: string;
  /** 组织头像 */
  avatar_url: string;
  /** 组织描述 */
  description: string;
  /** 组织地址 */
  html_url: string;
}
