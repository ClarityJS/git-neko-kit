import {
  UserNameParamType
} from '@/types/platform/github/base'
import {
  RepoInfoParamType,
  RepoInfoResponseType
} from '@/types/platform/github/repo'
import { AccountBaseType } from '@/types/platform/github/user'

/** 邀请协作者参数类型 */
export type CollaboratorParamType = RepoInfoParamType & UserNameParamType & {
  /**
   * 协作者权限 ,可选 pull，triage, push, maintain, admin，默认pull
   * pull - 只读访问，协作者可以查看仓库内容。
   * triage - 允许管理议题和拉取请求，包括标记、分配和修改状态。
   * push - 允许推送代码到仓库分支，同时拥有 pull 权限。
   * maintain - 允许管理仓库中的代码和议题，但不能更改仓库设置。
   * admin - 拥有仓库的完全控制权，包括更改设置和删除仓库。
   */
  permission?: 'pull' | 'triage' | 'push' | 'maintain' | 'admin';
}

/** 邀请协作者响应类型 */
export interface CollaboratorResponseType {
  /** 邀请唯一id */
  id: number;
  /** 邀请节点id */
  node_id: string;
  /** 邀请仓库信息 */
  repository: RepoInfoResponseType;
}

/** 协作者列表参数类型 */
export type CollaboratorListParamType = RepoInfoParamType & {
  /**
   * 筛选按隶属关系返回的协作者
   * outside - 列出所有外部协作者，包括仓库成员和外部 collaborator。
   * direct - 列出仓库成员。
   * all - 列出仓库成员和外部 collaborator。
  */
  affiliation?: 'outside' | 'direct' | 'all';
  /**
   * 筛选按权限关系返回的协作者
   * pull - 只读访问，协作者可以查看仓库内容。
   * triage - 允许管理议题和拉取请求，包括标记、分配和修改状态。
   * push - 允许推送代码到仓库分支，同时拥有 pull 权限。
   * maintain - 允许管理仓库中的代码和议题，但不能更改仓库设置。
   * admin - 拥有仓库的完全控制权，包括更改设置和删除仓库。
   */
  permission?: 'pull' | 'triage' | 'push' | 'maintain' | 'admin';
  /** 每页数量 */
  per_page?: number;
  /** 页码 */
  page?: number;
}

/** 协作者信息类型 */
export interface CollaboratorInfo extends AccountBaseType {
  /** 协作者邮箱 */
  email: string | null;
  /** 协作者姓名 */
  name: string | null;
  /** 粉丝URL */
  followers_url: string;
  /** 关注URL */
  following_url: string;
  /** Gists URL */
  gists_url: string;
  /** 标星URL */
  starred_url: string;
  /** 订阅URL */
  subscriptions_url: string;
  /** 组织URL */
  organizations_url: string;
  /** 仓库URL */
  repos_url: string;
  /** 事件URL */
  events_url: string;
  /** 接收事件URL */
  received_events_url: string;
  /** 权限设置 */
  permissions: {
    /** 拉取权限 */
    pull: boolean;
    /** 分类权限 */
    triage: boolean;
    /** 推送权限 */
    push: boolean;
    /** 维护权限 */
    maintain: boolean;
    /** 管理权限 */
    admin: boolean;
  };
  /** 角色名称 */
  role_name: string;
}

/** 协作者列表响应类型 */
export type CollaboratorListResponseType = CollaboratorInfo[]
