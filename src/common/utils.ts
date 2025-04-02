import fs from 'node:fs'

import { basePath } from '@/root'

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
