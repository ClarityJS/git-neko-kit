import fs from 'node:fs'

import GitUrlParse from 'git-url-parse'

import { basePath } from '@/root'
import { ContributionResult, RepoBaseParamType } from '@/types'

/**
 * 读取 JSON 文件
 * @param file - 文件名
 * @param root - 根目录
 * @returns JSON 对象
 */
export function readJSON<T = Record<string, unknown>> (file = '', root = ''): T {
  root = root || basePath
  try {
    const filePath = `${root}/${file}`
    if (!fs.existsSync(filePath)) {
      console.warn(`文件不存在: ${filePath}`)
      return {} as T
    }
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data) as T
  } catch (e) {
    console.error(`读取 JSON 文件失败: ${file}`, e)
    return {} as T
  }
}

/**
 * 格式化日期
 * @parm DataString - 日期字符串
 * @param Locale - 语言环境
 * @returns 格式化后的日期字符串
 */
export function formatDate (DateString: string, Locale: string = 'zh-CN'): string {
  return new Date(DateString).toLocaleString(Locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

/**
 * 解析 Git 仓库地址
 * @param url - Git 仓库地址
 * @param GitUrl - 原始Git 仓库地址
 * @returns Git 仓库信息
 */
export function parse_git_url (url: string, GitUrl: string): RepoBaseParamType {
  if (!url.startsWith(GitUrl)) {
    const parsedUrl = new URL(url)
    let path = parsedUrl.pathname
    if (path.includes('://')) {
      path = new URL(path.startsWith('/') ? path.substring(1) : path).pathname
    }
    const baseUrl = GitUrl.endsWith('/') ? GitUrl : `${GitUrl}/`
    path = path.replace(/^\/|\/$/g, '')
    url = baseUrl + path
  }
  const info = GitUrlParse(url)
  return {
    owner: info.owner,
    repo: info.name
  }
}
/**
 * 将数组按指定大小分割成二维数组
 * @param items - 要分割的数组
 * @param n - 每个子数组的大小
 * @returns 分割后的二维数组
 */
function listSplit<T> (items: T[], n: number): T[][] {
  return Array.from({ length: Math.ceil(items.length / n) }, (_, i) =>
    items.slice(i * n, i * n + n)
  )
}

/**
 * 从HTML中解析贡献数据
 * @param html - 包含贡献数据的HTML字符串
 * @returns 解析后的贡献数据，包括总贡献数和按周分组的贡献数据
 */
export function getContributionData (html: string): ContributionResult {
  const dateRegex = /data-date="(.*?)" id="contribution-day-component/g
  const countRegex = /<tool-tip .*?class="sr-only position-absolute">(.*?) contribution/g
  const dates = Array.from(html.matchAll(dateRegex), m => m[1])
  const counts = Array.from(html.matchAll(countRegex), m =>
    m[1].toLowerCase() === 'no' ? 0 : parseInt(m[1])
  )
  if (!dates.length || !counts.length) {
    return { total: 0, contributions: [] }
  }
  const sortedData = dates
    .map((date, index) => ({ date, count: counts[index] }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const contributions = listSplit(sortedData, 7)
  return {
    total: counts.reduce((sum, count) => sum + count, 0),
    contributions
  }
}
