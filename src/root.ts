import path from 'node:path'
import { fileURLToPath } from 'node:url'

const filePath = fileURLToPath(import.meta.url).replace(/\\/g, '/')
/** 项目根目录 */
export const basePath = path.resolve(filePath, '../../').replace(/\\/g, '/')

/** src目录, 打包后是dist目录 */
export const dirPath = path.resolve(filePath, '../').replace(/\\/g, '/')
