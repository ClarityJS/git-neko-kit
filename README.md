# <h1 align="center">git-neko-kit</h1>
Github，Gitee, GitCode API封装库

> [!Tip]
> 开发中

API 封装进度：

<details>
<summary>通用</summary>
 以下每个类都具有

| 功能           | 状态      |
|----------------|-----------|
| 设置Toke(仅支持Github apps的用户acess_token)   | ✅ 已完成 |
| 设置系统代理   | ✅ 已完成 |
| 设置通用代理   | ✅ 已完成 |
| 设置反向代理   | ✅ 已完成 |
</details>

<details>
<summary>GitHub</summary>

  <details>
    <summary>授权</summary>
以下的Github Apps的功能

| 功能           | 状态      |
|----------------|-----------|
| 创建应用安装  | ✅ 已完成 |
| 创建应用管理   | ✅ 已完成|
| 创建授权   | ✅ 已完成 |
| 通过授权获取用户token   | ✅ 已完成 |
| 刷新用户token   | ✅ 已完成 |
| 检查用户token状态   | ✅ 已完成 |
  </details>

  <details>
    <summary>用户</summary>

| 功能           | 状态      |
|----------------|-----------|
| 获取用户信息 | ✅ 已完成 |
| 获取用户贡献数据   | ✅ 已完成 |

  </details>

  <details>
    <summary>仓库</summary>

| 功能           | 状态      |
|----------------|-----------|
| 获取组织仓库列表  | ✅ 已完成 |
| 获取用户仓库列表  | ✅ 已完成 |
| 获取仓库信息   | ✅ 已完成 |
| 创建组织仓库   | ✅ 已完成 |
| 更新仓库信息   | ✅ 已完成 |
| 删除仓库   | ✅ 已完成 |
| 获取仓库语言   | ✅ 已完成 |

  </details>

  <details>
    <summary>Release</summary>

| 功能           | 状态      |
|----------------|-----------|
| 获取Release信息 | ✅ 已完成 |
| 创建Release   | ✅ 已完成 |
| 更新Release   | ✅ 已完成 |
| 删除Release   | ✅ 已完成 |

  </details>

  <details>
    <summary>Issue</summary>

| 功能           | 状态      |
|----------------|-----------|
| 获取Issue信息 | ✅ 已完成 |
| 创建Issue   | ✅ 已完成 |
| 更新Issue   | ✅ 已完成 |
| 锁定Issue   | ✅ 已完成 |
| 解锁Issue   | ✅ 已完成 |
| 更新Issue评论 | ✅ 已完成 |

  </details>

</details>

<details>
<summary>Gitee</summary>

暂无
</details>

<details>
<summary>GitCode</summary>
暂无
</details>


## 快速使用

### 获取实例
```ts
import Client from "@candriajs/git-neko-kit";
const options = {
  github: {
    Client_ID: '',
    Client_Secret: '',
    Private_Key: '',
    WebHook_Secret: '', // 可选，如果没设置密钥的话，可以不填
    format: false  // 是否开启格式化，默认为false, 开启后对日期，提交信息等格式化拆分
  }
}
const git_api = new Client(options)
```

### 获取GitHub实例
```ts
const gh = git_api.github
```
或者
```ts
import { GitHubClient } "@candriajs/git-neko-kit";
const options = {
  Client_ID: '',
  Client_Secret: '',
  Private_Key: '',
  WebHook_Secret: '', // 可选，如果没设置密钥的话，可以不填
  format: false  // 是否开启格式化，默认为false, 开启后对日期，提交信息等格式化拆分
}
const gh = new GitHubClient(options)
```

### 获取GitHub仓库信息
```ts
const repo = await gh.get_repo() // 获取Repo仓库实例
const info = await repo.get_repo_info({ owner: 'username', repo: 'repo_name' }) // 获取仓库信息
```

> [!Tip]
> 其他的使用方法一样



## 贡献者 👨‍💻👩‍💻

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->