import { logger } from '@/common'
/* eslint-disable no-var */
declare global {
  /** 全局变量日志 */
  var logger: logger
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** 日志等级 */
      LOG_LEVEL: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'mark' | 'off'
      /** 端口号 */
      PORT: number
    }
  }
}

export {}
