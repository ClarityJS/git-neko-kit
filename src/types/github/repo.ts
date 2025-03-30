export interface RepoParam {
  /** 仓库拥有者 */
  owner: string;
  /** 仓库名称 */
  repo: string;
}
export interface RepoUrlParam {
  /** 仓库地址 */
  url: string;
}
export type RepoParamType = RepoParam | RepoUrlParam

/** * 仓库许可证信息 */
interface License {
  /** * 许可证的键，例如 'mit' */
  key: string;
  /** * 许可证的名称，例如 'MIT License' */
  name: string;
  /** * 许可证的 SPDX ID，例如 'MIT' */
  spdx_id: string;
  /** * 许可证的 URL 地址 */
  url: string;
  /** * 许可证的节点 ID */
  node_id: string;
}

/** * 仓库拥有者信息 */
interface Owner {
  /** * 拥有者的 GitHub 用户名 */
  login: string;
  /** * 拥有者的 GitHub 用户 ID */
  id: number;
  /** * 拥有者的节点 ID */
  node_id: string;
  /** * 拥有者的头像 URL */
  avatar_url: string;
  /** * 拥有者的 Gravatar ID */
  gravatar_id: string;
  /** * 拥有者的 GitHub API URL */
  url: string;
  /** * 拥有者的 GitHub 主页 URL */
  html_url: string;
  /** * 拥有者的粉丝列表 URL */
  followers_url: string;
  /** * 拥有者的关注列表 URL */
  following_url: string;
  /** * 拥有者的 Gists URL */
  gists_url: string;
  /** * 拥有者的 starred 仓库列表 URL */
  starred_url: string;
  /** * 拥有者的订阅列表 URL */
  subscriptions_url: string;
  /** * 拥有者的组织 URL */
  organizations_url: string;
  /** * 拥有者的仓库列表 URL */
  repos_url: string;
  /** * 拥有者的事件 URL */
  events_url: string;
  /** * 拥有者的接收事件 URL */
  received_events_url: string;
  /** * 拥有者的类型，例如 'User' 或 'Organization' */
  type: string;
  /** * 用户查看类型，通常是 'public' */
  user_view_type: string;
  /** * 是否是站点管理员 */
  site_admin: boolean;
}

/** * 仓库信息 */
export interface RepoInfoType {
  /** * 仓库的唯一 ID */
  id: number;
  /** * 仓库的节点 ID */
  node_id: string;
  /** * 仓库的名称 */
  name: string;
  /** * 仓库的完整名称，包含用户名或组织名 */
  full_name: string;
  /** * 仓库是否私有 */
  private: boolean;
  /** * 仓库拥有者的信息 */
  owner: Owner;
  /** * 仓库的 HTML 页面 URL */
  html_url: string;
  /** * 仓库的描述信息 */
  description: string;
  /** * 仓库是否是 fork 仓库 */
  fork: boolean;
  /** * 仓库的 API URL */
  url: string;
  /** * 获取仓库 fork 列表的 URL */
  forks_url: string;
  /** * 获取仓库 keys 列表的 URL */
  keys_url: string;
  /** * 获取仓库协作者列表的 URL */
  collaborators_url: string;
  /** * 获取仓库团队信息的 URL */
  teams_url: string;
  /** * 获取仓库 hooks 列表的 URL */
  hooks_url: string;
  /** * 获取仓库 issue 事件列表的 URL */
  issue_events_url: string;
  /** * 获取仓库所有事件的 URL */
  events_url: string;
  /** * 获取仓库分配人信息的 URL */
  assignees_url: string;
  /** * 获取仓库分支列表的 URL */
  branches_url: string;
  /** * 获取仓库标签列表的 URL */
  tags_url: string;
  /** * 获取仓库 blob 信息的 URL */
  blobs_url: string;
  /** * 获取仓库 git 标签信息的 URL */
  git_tags_url: string;
  /** * 获取仓库 git 引用信息的 URL */
  git_refs_url: string;
  /** * 获取仓库 git 树信息的 URL */
  trees_url: string;
  /** * 获取仓库状态信息的 URL */
  statuses_url: string;
  /** * 获取仓库语言信息的 URL */
  languages_url: string;
  /** * 获取仓库 Stargazers 列表的 URL */
  stargazers_url: string;
  /** * 获取仓库贡献者列表的 URL */
  contributors_url: string;
  /** * 获取仓库订阅者列表的 URL */
  subscribers_url: string;
  /** * 获取仓库订阅信息的 URL */
  subscription_url: string;
  /** * 获取仓库提交历史的 URL */
  commits_url: string;
  /** * 获取仓库 git 提交历史的 URL */
  git_commits_url: string;
  /** * 获取仓库评论的 URL */
  comments_url: string;
  /** * 获取仓库问题评论的 URL */
  issue_comment_url: string;
  /** * 获取仓库文件内容的 URL */
  contents_url: string;
  /** * 获取仓库比较信息的 URL */
  compare_url: string;
  /** * 获取仓库合并信息的 URL */
  merges_url: string;
  /** * 获取仓库归档的 URL */
  archive_url: string;
  /** * 获取仓库下载的 URL */
  downloads_url: string;
  /** * 获取仓库所有 issues 的 URL */
  issues_url: string;
  /** * 获取仓库所有 pull requests 的 URL */
  pulls_url: string;
  /** * 获取仓库所有里程碑的 URL */
  milestones_url: string;
  /** * 获取仓库所有通知的 URL */
  notifications_url: string;
  /** * 获取仓库所有标签的 URL */
  labels_url: string;
  /** * 获取仓库所有发布版本的 URL */
  releases_url: string;
  /** * 获取仓库所有部署的 URL */
  deployments_url: string;
  /** * 仓库的创建时间 */
  created_at: string;
  /** * 仓库的更新时间 */
  updated_at: string;
  /** * 仓库的推送时间 */
  pushed_at: string;
  /** * 仓库的 Git URL */
  git_url: string;
  /** * 仓库的 SSH URL */
  ssh_url: string;
  /** * 仓库的克隆 URL */
  clone_url: string;
  /** * 仓库的 SVN URL */
  svn_url: string;
  /** * 仓库的主页 URL，若无则为空字符串 */
  homepage: string;
  /** * 仓库的大小（单位：KB） */
  size: number;
  /** * 仓库的 Stargazer 数量 */
  stargazers_count: number;
  /** * 仓库的 Watcher 数量 */
  watchers_count: number;
  /** * 仓库的主编程语言 */
  language: string;
  /** * 是否开启 issue 功能 */
  has_issues: boolean;
  /** * 是否开启项目功能 */
  has_projects: boolean;
  /** * 是否允许下载 */
  has_downloads: boolean;
  /** * 是否开启 Wiki 功能 */
  has_wiki: boolean;
  /** * 是否开启 Pages 功能 */
  has_pages: boolean;
  /** * 是否开启讨论区功能 */
  has_discussions: boolean;
  /** * 仓库的 fork 数量 */
  forks_count: number;
  /** * 仓库的镜像 URL */
  mirror_url: string | null;
  /** * 仓库是否已归档 */
  archived: boolean;
  /** * 仓库是否被禁用 */
  disabled: boolean;
  /** * 开放的 issue 数量 */
  open_issues_count: number;
  /** * 仓库的许可证信息 */
  license: License;
  /** * 是否允许 fork 仓库 */
  allow_forking: boolean;
  /** * 是否是模板仓库 */
  is_template: boolean;
  /** * 是否要求提交时签署承诺 */
  web_commit_signoff_required: boolean;
  /** * 仓库的主题标签 */
  topics: string[];
  /** * 仓库的可见性（如 public, private） */
  visibility: string;
  /** * 仓库的 fork 数量 */
  forks: number;
  /** * 仓库的开放问题数量 */
  open_issues: number;
  /** * 仓库的 Watcher 数量 */
  watchers: number;
  /** * 仓库的默认分支 */
  default_branch: string;
  /** * 临时克隆令牌 */
  temp_clone_token: string | null;
  /** * 仓库的网络计数 */
  network_count: number;
  /** * 仓库的订阅者数量 */
  subscribers_count: number;
}
