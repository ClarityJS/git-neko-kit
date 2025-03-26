export interface GitHubAuthType {
  /** GitHub App ID */
  APP_ID: string
  /** 私钥内容 */
  APP_SECRET: string
  /** GitHub App Client ID */
  Client_ID: string
  /** GitHub App Client Secret */
  Client_Secret: string
}
export interface GitHubAppsTokenType extends GitHubAuthType {

  /** GitHub App 安装 ID */
  INSTALLATION_ID?: string
}
