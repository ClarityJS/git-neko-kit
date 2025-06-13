import { exec as execCmd } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

import convert, { type RGB } from 'color-convert'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import GitUrlParse from 'git-url-parse'
import LanguageColors from 'language-colors'
import { simpleGit } from 'simple-git'

import { MissingLocalRepoPathMsg, MissingRemoteRepoUrlMsg } from '@/common/errorMsg'
import { basePath } from '@/root'
import { ContributionResult, ExecOptions, ExecReturn, RepoBaseParamType } from '@/types'

/**
 * 执行 shell 命令
 * @param cmd 命令
 * @param options 选项
 * @param options.log 是否打印日志 默认不打印
 * @param options.booleanResult 是否只返回布尔值 表示命令是否成功执行 默认返回完整的结果
 * @example
 * ```ts
 * const { status, error, stdout, stderr } = await exec('ls -al')
 * // -> { status: true, error: null, stdout: '...', stderr: '...' }
 *
 * const status = await exec('ls -al', { booleanResult: true })
 * // -> true
 *
 * const { status, error, stdout, stderr } = await exec('ls -al', { log: true })
 * // -> 打印执行命令和结果
 * ```
 */
export function exec<T extends boolean = false> (
  cmd: string,
  options?: ExecOptions<T>
): Promise<ExecReturn<T>> {
  const logger = console
  return new Promise((resolve) => {
    if (options?.log) {
      logger.info([
        '[exec] 执行命令:',
        `pwd: ${options?.cwd ?? process.cwd()}`,
        `cmd: ${cmd}`,
        `options: ${JSON.stringify(options)}`
      ].join('\n'))
    }

    execCmd(cmd, options, (error, stdout, stderr) => {
      if (options?.log) {
        const info = error as Error
        if (info.message) info.message = `\x1b[91m${info.message}\x1b[0m`
        logger.info([
          '[exec] 执行结果:',
          `stderr: ${stderr.toString()}`,
          `stdout: ${stdout.toString()}`,
          `error: ${JSON.stringify(info, null, 2)}`
        ].join('\n'))
      }

      if (options?.booleanResult) {
        return resolve((!error) as ExecReturn<T>)
      }

      stdout = stdout.toString()
      stderr = stderr.toString()

      if (options?.trim) {
        stdout = stdout.trim()
        stderr = stderr.trim()
      }

      const value = {
        status: !error,
        error,
        stdout,
        stderr
      } as ExecReturn<T>
      resolve(value)
    })
  })
}

/**
 * 异步判断文件是否存在
 * @param path - 文件路径
 * @returns 是否存在
 * @example
 * ```ts
 * console.log(await exists('package.json')) // 输出 true
 * console.log(await exists('not-exists.json')) // 输出 false
 * ```
 */
export async function exists (path: string) {
  try {
    await fs.promises.access(path)
    return true
  } catch {
    return false
  }
}
/**
 * 读取 JSON 文件
 * @param file - 文件名
 * @param root - 根目录
 * @returns JSON 对象
 */
export function readJSON (file: string = '', root: string = ''): any {
  root = root || basePath
  try {
    const filePath = `${root}/${file}`
    if (!fs.existsSync(filePath)) {
      console.warn(`文件不存在: ${filePath}`)
      return {}
    }
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`读取 JSON 文件失败: ${file}`, error as Error)
    return {}
  }
}

/**
 * @param options - 初始化 日期
 */
async function initDate (locale: string = 'zh-cn') {
  const normalizedLocale = String(locale).toLowerCase()
  await import(`dayjs/locale/${normalizedLocale}.js`)
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
  const date = dayjs(dateString).locale(locale)
  return date.format(format)
}

/**
 * 获取相对时间
 * @param dateString - 日期字符串
 * @param locale - 语言环境，默认为 'zh-cn'
 * @returns 相对时间
 * @example
 * ```ta
 * console.log(await get_relative_time('2023-04-01 12:00:00')) // 输出 "1 小时前"
 * ```
 */
export async function get_relative_time (
  dateString: string,
  locale: string = 'zh-cn'):
  Promise<string> {
  await initDate(locale)
  dayjs.extend(relativeTime)
  return dayjs(dateString).fromNow()
}

/**
 * 解析 Git 仓库地址
 * @param url - Git 仓库地址
 * @returns Git 仓库信息
 * @example
 * ```ts
 * console.log(parse_git_url('https://github.com/user/repo.git')) // 输出 { owner: 'user', repo: 'repo' }
 * // 其他原始git地址也支持解析
 * console.log(parse_git_url('https://ghproxy.com/github.com/user/repo.git')) // 输出 { owner: 'user', repo: 'repo' }
 * console.log(parse_git_url('https://ghproxy.com/https://github.com/user/repo.git')) // 输出 { owner: 'user', repo: 'repo' }
 * // 代理地址解析只支持https协议
 * ```
 */
export function parse_git_url (url: string): RepoBaseParamType {
  const proxyRegex = /^https?:\/\/[^/]+\/(?:https?:\/\/)?([^/]+\/[^/]+\/[^/]+)/
  const proxyMatch = url.match(proxyRegex)

  if (proxyMatch) {
    const path = proxyMatch[1]
    url = path.startsWith('https') ? path : `https://${path}`
  }

  const info = GitUrlParse(url)
  return {
    owner: info.owner,
    repo: info.name
  }
}

async function get_git_version (): Promise<string> {
  const { stdout } = await exec('git --version')
  return stdout.toString().trim()
}
/**
 * 获取本地仓库的默认分支
 * @param local_path - 本地仓库路径
 * @returns 默认分支名称
 * @example
 * ```ts
 * console.log(await get_local_repo_default_branch('/path/to/repo')) // 输出 'main'
 * ```
 */
export async function get_local_repo_default_branch (local_path: string): Promise<string> {
  if (!local_path) throw new Error(MissingLocalRepoPathMsg)
  try {
    try {
      await get_git_version()
    } catch (error) {
      throw new Error('喵呜~, Git 未安装或未正确配置')
    }
    const git_path = path.join(local_path, '.git')
    const isGitRepo = await exists(git_path)
    if (!isGitRepo) {
      throw new Error(`路径 ${local_path} 不是一个有效的 Git 仓库`)
    }

    const repo = simpleGit(local_path)
    const head = await repo.revparse(['--abbrev-ref', 'HEAD'])
    if (!head) {
      throw new Error('无法获取仓库分支信息，请确保仓库已初始化')
    }

    return head.trim()
  } catch (error) {
    throw new Error(`获取本地仓库默认分支失败: ${(error as Error).message}`)
  }
}

/**
 * 获取远程仓库的默认分支
 * @param remote_url - 远程仓库URL
 * @returns 默认分支名称
 * @example
 * ```ts
 * console.log(await get_remote_repo_default_branch('https://github.com/CandriaJS/git-neko-kit')) // 输出 'main'
 * ```
 */
export async function get_remote_repo_default_branch (remote_url: string): Promise<string> {
  if (!remote_url) throw new Error(MissingRemoteRepoUrlMsg)
  try {
    let gitVersion: string
    try {
      gitVersion = await get_git_version()
    } catch (error) {
      throw new Error('喵呜~, Git 未安装或未正确配置')
    }
    const git_url = new URL(remote_url)
    if (git_url.protocol !== 'https:' && git_url.protocol !== 'http:') {
      throw new Error('远程仓库URL必须是HTTP或HTTPS协议')
    }
    const { owner, repo: RepoName } = parse_git_url(git_url.href)
    if (!(owner || RepoName)) throw new Error(`url: ${git_url.href} 不是一个有效的 Git 仓库地址`)
    const repo = simpleGit()
    const remoteInfo = await repo.raw(['ls-remote', '--symref', remote_url, 'HEAD'])
    const defaultBranchMatch = remoteInfo.match(/^ref: refs\/heads\/([^\t\n]+)/m)
    if (!defaultBranchMatch) {
      throw new Error('无法从远程仓库获取默认分支信息')
    }
    return defaultBranchMatch[1]
  } catch (error) {
    throw new Error(`获取远程仓库默认分支失败: ${(error as Error).message}`)
  }
}

/**
 * 将 RGB 颜色值转换为十六进制颜色代码
 * @param rgb - RGB颜色值数组，必须是包含3个0-255之间整数的数组
 * @returns 十六进制颜色代码
 * @example
 * ```ts
 * console.log(RgbToHex([255, 128, 0])) // 输出 "#ff8000"
 * ```
 */
export function RgbToHex (rgb: RGB): string {
  if (!Array.isArray(rgb)) {
    throw new Error('RGB值必须是数组类型')
  }
  if (rgb.length !== 3) {
    throw new Error('RGB数组必须包含且仅包含3个值')
  }

  if (!rgb.every(n => Number.isInteger(n) && n >= 0 && n <= 255)) {
    throw new Error('RGB值必须都是0-255之间的整数')
  }

  return `#${convert.rgb.hex(rgb)}`
}

/**
 * 根据语言名称获取对应的颜色值
 * @param language - 语言名称
 * @returns 颜色值的十六进制字符串
 * @example
 * ```ts
 * console.log(get_langage_color('JavaScript')) // 输出 "#f1e05a"
 * ```
 */
export function get_langage_color (language: string): string {
  language = String(language).toLowerCase()
  return RgbToHex(LanguageColors[language].color) ?? '#ededed'
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
export async function get_contribution_data (html: string): Promise<ContributionResult> {
  try {
    if (!html) {
      return { total: 0, contributions: [] }
    }
    const dateRegex = /data-date="(.*?)" id="contribution-day-component/g
    const countRegex = /<tool-tip .*?class="sr-only position-absolute">(.*?) contribution/g
    const dates = Array.from(html.matchAll(dateRegex), m => m[1])
    const counts = Array.from(html.matchAll(countRegex), m =>
      String(m[1]).toLowerCase() === 'no' ? 0 : parseInt(m[1])
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
  } catch (error) {
    throw new Error(`解析贡献数据失败: ${error}`)
  }
}
