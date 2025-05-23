import { formatDate, get_langage_color, get_relative_time } from '@/common'
import { create_state_id } from '@/models'
import { Base as GithubClient } from '@/models/platform/github/base'
import { ClientType } from '@/types'

class Client {
  public github: GithubClient
  constructor (options: ClientType) {
    this.github = new GithubClient(options.github)
  }
}

const utils = {
  create_state_id,
  formatDate,
  get_relative_time,
  get_langage_color
}

export { Client, utils }
export default Client
export * from '@/types'
