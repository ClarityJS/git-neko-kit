import { App } from '@/models/github/event/app'
import { GitHub } from '@/models/github/event/github'

export class Install {
  private get: GitHub['get']
  private post: GitHub['post']
  private BaseUrl: string
  private ApiUrl: string
  private jwtToken: string
  private APP_ID: string
  private APP_SECRET: string
  private Client_ID: string
  private Client_Secret: string
  private state_id: string
  private app: App
  constructor (options: GitHub, jwtToken: string) {
    this.get = options.get.bind(options)
    this.post = options.post.bind(options)
    this.APP_ID = options.APP_ID
    this.APP_SECRET = options.APP_SECRET
    this.Client_ID = options.Client_ID
    this.Client_Secret = options.Client_Secret
    this.ApiUrl = options.ApiUrl
    this.BaseUrl = options.BaseUrl
    this.jwtToken = jwtToken
    this.state_id = options.getStateId()
    this.app = new App(options, jwtToken)
  }

  /**
   * 生成Github App 安装链接
   * @param stateId 可选，传入的 state_id, 随机字符串
   * @returns 返回安装链接对象
   * @returns state_id 随机生成的字符串，用于验证
   * @returns install_link 安装链接，用于跳转 Github 安装页
   */
  public async create_install_link (stateId?: string): Promise<{ state_id: string, install_link: string }> {
    const state_id = stateId ?? this.state_id
    const APP_Name = await this.app.get_name()
    return {
      state_id,
      install_link: `${this.BaseUrl}/apps/${APP_Name}/installations/new?state=${state_id}`
    }
  }

  /**
  * 生成Github Apps 配置链接
  * @param stateId 可选，传入的 state_id, 随机字符串
  * @returns 返回配置链接对象
  * @returns state_id 随机生成的字符串，用于验证
  * @returns  config_install_link 配置链接
  */
  public async create_config_install_link (stateId?: string): Promise<string> {
    const state_id = stateId ?? this.state_id
    const APP_Name = await this.app.get_name()
    return `${this.BaseUrl}/apps/${APP_Name}/installations/select_target?state=${state_id}`
  }
}
