import fs from 'node:fs'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'
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
 * @param options - 初始化 日期
 */
async function initDate (locale: string = 'zh-cn') {
  const normalizedLocale = locale.toLowerCase()
  await import(`dayjs/locale/${normalizedLocale}.js`)
  dayjs.locale(normalizedLocale)
}

/**
 * 格式化日期
 * @param dateString - 日期字符串
 * @param locale - 语言环境，默认为 'zh-cn'
 * @param format - 日期格式，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 * @example
 * ```ts
 * console.log(await formatDate('2025-04-16T10:00:00') // 输出 "2025-04-16 10:00:00"
 * ```
 */
export async function formatDate (
  dateString: string,
  locale: string = 'zh-cn',
  format: string = 'YYYY-MM-DD HH:mm:ss'
): Promise<string> {
  await initDate(locale)
  const date = dayjs(dateString)
  return date.format(format)
}

/**
 * 获取相对时间
 * @param dateString - 日期字符串
 * @returns 相对时间
 * @example
 * ```ta
 * console.log(await get_relative_time('2023-04-01 12:00:00')) // 输出 "1 小时前"
 */
export async function get_relative_time (
  dateString: string,
  locale:string = 'zh-cn'):
  Promise<string> {
  await initDate(locale)
  dayjs.extend(relativeTime)
  return dayjs(dateString).fromNow()
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
    path = path.replace(/^\//, '').replace(/\/$/, '')
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
async function listSplit<T> (items: T[], n: number): Promise<T[][]> {
  return Promise.resolve(Array.from({ length: Math.ceil(items.length / n) }, (_, i) =>
    items.slice(i * n, i * n + n)
  )
  )
}

/**
 * 从HTML中解析贡献数据
 * @param html - 包含贡献数据的HTML字符串
 * @returns 解析后的贡献数据，包括总贡献数和按周分组的贡献数据
 */
export async function getContributionData (html: string): Promise<ContributionResult> {
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

  const contributions = await listSplit(sortedData, 7)
  return {
    total: counts.reduce((sum, count) => sum + count, 0),
    contributions
  }
}
