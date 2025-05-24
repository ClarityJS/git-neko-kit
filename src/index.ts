import { formatDate, get_langage_color, get_relative_time } from '@/common'
import { create_state_id } from '@/models'
import { GitHubClient } from '@/models/platform/github/base'
import { ClientType } from '@/types'

class Client {
  public github: GitHubClient
  constructor (options: ClientType) {
    if (!options.github) {
      throw new Error('GitHub 客户端未配置')
    }
    this.github = new GitHubClient(options.github)
  }
}

const utils = {
  create_state_id,
  formatDate,
  get_relative_time,
  get_langage_color
}

export { Client, GitHubClient, utils }
export default Client
export * from '@/types'
