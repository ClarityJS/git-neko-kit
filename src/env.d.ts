declare namespace NodeJS {
  interface ProcessEnv {
    /** 日志等级 */
    LOG_LEVEL: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'mark' | 'off'
    /** 端口号 */
    PORT: number
  }
}

export {}
