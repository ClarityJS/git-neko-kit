import {
  RepoParamType
} from '@/types/platform/github/base'
import { AccountBaseType } from '@/types/platform/github/user'
/** 反应信息类型 */
export interface ReactionInfoType {
  /** 反应 API URL */
  url: string;
  /** 总反应数 */
  total_count: number;
  /** 👍 反应数 */
  '+1': number;
  /** 👎 反应数 */
  '-1': number;
  /** 😄 反应数 */
  laugh: number;
  /** 😕 反应数 */
  confused: number;
  /** ❤️ 反应数 */
  heart: number;
  /** 🎉 反应数 */
  hooray: number;
  /** 👀 反应数 */
  eyes: number;
  /** 🚀 反应数 */
  rocket: number;
}
/** 获Release信息 */
export type ReleaseListParamTypeType = RepoParamType

/** 获Release信息参数类型 */
export type ReleaseInfoParamTypeType = RepoParamType & {
  /** 发布ID */
  release_id: number
}
/** 获Release信息响应类型 */
// ... existing code ...
export interface ReleaseInfoResponseType {
  /** 发布版本的 API URL */
  url: string;
  /** 发布版本的 HTML 页面 URL */
  html_url: string;
  /** 发布版本的资源 URL */
  assets_url: string;
  /** 发布版本的上传 URL */
  upload_url: string;
  /** tar 包下载 URL */
  tarball_url: string | null;
  /** zip 包下载 URL */
  zipball_url: string | null;
  /** 发布版本的 ID */
  id: number;
  /** 节点 ID */
  node_id: string;
  /** 标签名称 */
  tag_name: string;
  /** 目标分支或提交 */
  target_commitish: string;
  /** 发布版本名称 */
  name: string | null;
  /** 发布说明 */
  body: string | null;
  /** 是否为草稿 */
  draft: boolean;
  /** 是否为预发布版本 */
  prerelease: boolean;
  /** 创建时间 */
  created_at: string;
  /** 发布时间 */
  published_at: string | null;
  /** 发布者信息 */
  author: AccountBaseType & {
    /** 用户名 */
    name: string | null;
    /** 邮箱 */
    email: string | null;
  };
  /** 发布资源列表 */
  assets: Array<{
    /** 资源 URL */
    url: string;
    /** 资源下载 URL */
    browser_download_url: string;
    /** 资源 ID */
    id: number;
    /** 节点 ID */
    node_id: string;
    /** 资源名称 */
    name: string;
    /** 资源标签 */
    label: string | null;
    /** 资源状态 */
    state: 'uploaded' | 'open';
    /** 资源类型 */
    content_type: string;
    /** 资源大小 */
    size: number;
    /** 下载次数 */
    download_count: number;
    /** 创建时间 */
    created_at: string;
    /** 更新时间 */
    updated_at: string;
    /** 上传者信息 */
    uploader: null | {
      /** 用户名 */
      name: string | null;
      /** 邮箱 */
      email: string | null;
      /** 登录名 */
      login: string;
      /** 用户 ID */
      id: number;
      /** 节点 ID */
      node_id: string;
      /** 头像 URL */
      avatar_url: string;
      /** Gravatar ID */
      gravatar_id: string | null;
      /** API URL */
      url: string;
      /** HTML 页面 URL */
      html_url: string;
      /** 粉丝列表 URL */
      followers_url: string;
      /** 关注列表 URL */
      following_url: string;
      /** Gists 列表 URL */
      gists_url: string;
      /** 标星列表 URL */
      starred_url: string;
      /** 订阅列表 URL */
      subscriptions_url: string;
      /** 组织列表 URL */
      organizations_url: string;
      /** 仓库列表 URL */
      repos_url: string;
      /** 事件列表 URL */
      events_url: string;
      /** 接收事件列表 URL */
      received_events_url: string;
      /** 用户类型 */
      type: string;
      /** 是否为管理员 */
      site_admin: boolean;
    };
  }>;
  /** 发布说明的 HTML 格式 */
  body_html: string;
  /** 发布说明的纯文本格式 */
  body_text: string;
  /** 提及次数 */
  mentions_count: number;
  /** 讨论 URL */
  discussion_url: string;
  /** 反应信息 */
  reactions: ReactionInfoType;
}
