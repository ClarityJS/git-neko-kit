import os from 'node:os'

import chalk from 'chalk'
import log4js from 'log4js'

import { pkg } from '@/common/version'

let islog4jsLog = false

const logLevel = process.env.LOG_LEVEL ?? 'info'

if (!islog4jsLog) {
  log4js.configure({
    appenders: {
      console: {
        type: 'console',
        layout: {
          type: 'pattern',
          pattern: `%[[${pkg.name}]%[[%d{hh:mm:ss.SSS}][%4.4p]%] %m`
        }
      },
      dailyFile: {
        type: 'dateFile',
        filename: `${os.homedir()}/${pkg.name}/logs/logger`,
        pattern: 'yyyy-MM-dd.log',
        alwaysIncludePattern: true,
        keepFileExt: true,
        layout: {
          type: 'pattern',
          pattern: `%[[${pkg.name}]%[[%d{hh:mm:ss.SSS}][%4.4p]%] %m`
        }
      },
      errorFile: {
        type: 'file',
        filename: `${os.homedir()}/${pkg.name}/logs/error.log`,
        maxLogSize: 10485760,
        backups: 3,
        compress: true,
        layout: {
          type: 'pattern',
          pattern: `%[[${pkg.name}]%[[%d{hh:mm:ss.SSS}][%4.4p]%] %m`
        }
      }
    },
    categories: {
      default: { appenders: ['console', 'dailyFile'], level: logLevel },
      error: { appenders: ['console', 'errorFile'], level: 'error' }
    }
  })
  islog4jsLog = true
}

class Logger {
  private logger = log4js.getLogger()
  private errorLogger = log4js.getLogger('error')

  constructor () {
    this.logger.level = logLevel
    this.errorLogger.level = 'error'
  }

  info (message: string) {
    this.logger.info(message)
  }

  error (message: string) {
    this.errorLogger.error(message)
  }

  warn (message: string) {
    this.logger.warn(message)
  }

  debug (message: string) {
    this.logger.debug(message)
  }

  chalk = chalk
}
export const logger = new Logger()
