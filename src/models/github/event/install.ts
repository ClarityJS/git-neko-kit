import { App } from '@/models/github/event/app'
import { GitHub } from '@/models/github/event/github'

export class Install {
  private get: GitHub['get']
  private post: GitHub['post']
  private BaseUrl: string
  private ApiUrl: string
  private jwtToken: string
  private APP_ID: string
  private Private_Key: string
  private Client_ID: string
  private Client_Secret: string
  private app: App
  constructor (options: GitHub) {
    this.get = options.get.bind(options)
    this.post = options.post.bind(options)
    this.APP_ID = options.APP_ID
    this.Private_Key = options.Private_Key
    this.Client_ID = options.Client_ID
    this.Client_Secret = options.Client_Secret
    this.ApiUrl = options.ApiUrl
    this.BaseUrl = options.BaseUrl
    this.jwtToken = options.jwtToken
    this.app = new App(options)
  }

  /**
   * 生成Github App 安装链接
   * @param state_id - 随机生成的 state_id，用于验证授权请求的状态，可选，默认不使用
   * @returns 返回安装链接对象
   * @returns state_id 随机生成的字符串，用于验证
   * @returns install_link 安装链接，用于跳转 Github 安装页
   */
  public async create_install_link (state_id?: string): Promise<string> {
    try {
      const APP_Name = await this.app.get_name()
      const url = new URL(`apps/${APP_Name}/installations/new`, this.BaseUrl)
      url.search = new URLSearchParams({
        ...(state_id && { state: state_id })
      }).toString()
      return url.toString()
    } catch (error) {
      throw new Error(`生成安装链接失败: ${(error as Error).message}`)
    }
  }

  /**
  * 生成Github Apps 配置链接
  * @param state_id - 传入的 state_id, 随机字符串
  * @returns 返回配置链接对象
  * @returns state_id 随机生成的字符串，用于验证
  * @returns  config_install_link 配置链接
  */
  public async create_config_install_link (state_id?: string): Promise<string> {
    try {
      const APP_Name = await this.app.get_name()
      const url = new URL(`apps/${APP_Name}/installations/new`, this.BaseUrl)
      url.search = new URLSearchParams({
        ...(state_id && { state: state_id })
      }).toString()
      return url.toString()
    } catch (error) {
      throw new Error(`生成配置链接失败: ${(error as Error).message}`)
    }
  }
}
