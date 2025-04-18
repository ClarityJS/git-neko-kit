# git-neko-kit
Github，Gitee, GitCode API封装库

> [!Tip]
> 开发中

API 封装进度：

<details>
<summary>通用</summary>
 以下每个类都具有

| 功能           | 状态      |
|----------------|-----------|
| 设置Toke(仅支持Github apps)   | ✅ 已完成 |
| 设置系统代理   | ✅ 已完成 |
| 设置通用代理   | ✅ 已完成 |
| 设置反向代理   | ⬜ 待完成|
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
    <summary>仓库</summary>

| 功能           | 状态      |
|----------------|-----------|
| 获取组织仓库列表  | ✅ 已完成 |
| 获取用户仓库列表  | ✅ 已完成 |
| 获取仓库信息   | ✅ 已完成 |
| 创建组织仓库   | ✅ 已完成 |
| 更新仓库信息   | ⬜ 待完成 |
| 删除仓库   | ⬜ 待完成 |
| 获取仓库语言   | ⬜ 待完成 |

  </details>

  <details>
    <summary>用户</summary>

| 功能           | 状态      |
|----------------|-----------|
| 获取用户信息 | ✅ 已完成 |
| 获取用户贡献数据   | ✅ 已完成 |

  </details>

  <details>
    <summary>提交</summary>

| 功能           | 状态      |
|----------------|-----------|
| 获取一个提交信息 | ✅ 已完成 |

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
import { github } from "git-neko-kit";
const gh = new github.Base(options)
```

### 获取GitHub仓库信息
```ts
const repo = await gh.get_repo() // 获取Repo仓库实例
const info = await repo.get_repo_info() // 获取仓库信息
```
或者直接实例化Repo类使用：
```ts
const repo = new github.Repo(options) // 创建Repo仓库实例
const info = await repo.get_repo_info() // 获取仓库信息
```

> [!Tip]
> 其他的使用方法一样
