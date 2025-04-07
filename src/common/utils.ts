import fs from 'node:fs'

import GitUrlParse from 'git-url-parse'

import { basePath } from '@/root'
import { RepoBaseParamType } from '@/types'

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
