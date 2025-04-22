import {
  RepoNameParamType,
  RepoOwnerParamType,
  UserNameParamType
} from '@/types/platform/github/base'
import { RepoInfoResponseType } from '@/types/platform/github/repo'
/** 邀请协作者参数类型 */
export interface ContributorParamType extends RepoOwnerParamType, RepoNameParamType, UserNameParamType {
  /**
     * 协作者权限 ,可选 pull，triage, push, maintain, admin
     * pull - 仓库成员可以查看仓库
     */
  permission: 'pull' | 'triage' | 'push' | 'maintain' | 'admin'
}

/** 邀请协作者响应类型 */
export interface ContributorResponseType {
  /** 邀请唯一id */
  id: number;
  /** 邀请节点id */
  node_id: string;
  /** 邀请仓库信息 */
  repository: RepoInfoResponseType;
}
