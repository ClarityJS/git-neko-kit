import fs from 'node:fs'

import { basePath } from '@/root'

/**
 * 读取 JSON 文件
 * @param file 文件名
 * @param root 根目录
 * @returns JSON 对象
 */
export function readJSON (file = '', root = ''): any {
  root = root || basePath
  try {
    const filePath = `${root}/${file}`
    fs.existsSync(filePath)
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (e) {
    console.error(`读取 JSON 文件失败: ${file}`)
    return {}
  }
}
