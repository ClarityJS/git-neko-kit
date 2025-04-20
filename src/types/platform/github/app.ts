import { Owner } from '@/types/platform/github/repo'

/**
 * 定义 Base 应用所需的权限
 */
export interface GitHubAppPermissions {
  /** 对仓库内容的权限（例如读取、写入） */
  contents: string;

  /** 对部署的权限（例如读取、写入） */
  deployments: string;

  /** 对议题的权限（例如写） */
  issues: string;

  /** 对检查的权限 */
  checks: string;

  /** 对元数据的权限（例如读取） */
  metadata: string;
}

/**
 * 定义 Base 应用的详细信息
 */
export interface GitHubAppInfoType {
  /** 应用的唯一 ID */
  id: number;

  /** 应用的 Client ID */
  client_id: string;

  /** 应用的标识符（slug） */
  slug: string;

  /** 应用的唯一 Node ID */
  node_id: string;

  /** 应用所有者的信息 */
  owner: Owner;

  /** 应用的名称 */
  name: string;

  /** 应用的描述 */
  description: string;

  /** 应用的外部 URL */
  external_url: string;

  /** 应用的 Base 页面 URL */
  html_url: string;

  /** 应用创建时间的时间戳 */
  created_at: string;

  /** 应用最后更新时间的时间戳 */
  updated_at: string;

  /** 应用所需的权限 */
  permissions: GitHubAppPermissions;

  /** 应用监听的事件列表 */
  events: string[];

  /** 应用的安装数量 */
  installations_count: number;
}
