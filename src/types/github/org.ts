import { RepoInfoResponseType } from '@/types/github/repo'
export interface OrgReoParmsType {
  /** 组织名称 */
  org: string
  /** 类型，可选all， public， private， forks， sources， member， 默认为 all */
  type?: 'all' | 'public' | 'private' | 'forks' | 'sources' | 'member'
  /** 排序方式，可选created， updated， pushed， full_name， 默认为 full_name */
  sort?: 'created' | 'updated' | 'pushed' | 'full_name'
  /** 排序方式，可选asc， desc， 默认为 desc */
  direction?: 'asc' | 'desc'
  /** 每页数量 */
  per_page?: number
  /** 页码 */
  page?: number
}

/**
 * 仓库信息数组
 */
export type OrgRepoListType = RepoInfoResponseType[]
