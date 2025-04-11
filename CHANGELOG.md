# 变更日志

## [0.3.0](https://github.com/ClarityJS/git-neko-kit/compare/v0.2.0...v0.3.0) (2025-04-11)


### ✨ 新功能

* **commit:** 格式化提交信息中的日期 ([56d2b6b](https://github.com/ClarityJS/git-neko-kit/commit/56d2b6b35c389e3728b93cb0da9888dd065f1851))
* **github:** 添加获取用户仓库列表功能 ([4efe253](https://github.com/ClarityJS/git-neko-kit/commit/4efe253d6f256d9edf9fd46a951145ce2e4569b2))


### 🐛 错误修复

* **dayjs:** 修复 dayjs 本地化文件导入路径 ([dd2d05c](https://github.com/ClarityJS/git-neko-kit/commit/dd2d05c56e539ba8679b96599a3c042c2bbe8c99))
* **github:** 优化用户仓库获取逻辑 ([472d591](https://github.com/ClarityJS/git-neko-kit/commit/472d591c8ccbfe92bd293976e0bdb8c6ead163d8))
* **github:** 增加对 422 错误的处理 ([f57f284](https://github.com/ClarityJS/git-neko-kit/commit/f57f2848a1bfe12d4cc99fa1a28089efcfe73427))
* **models:** 修复错误消息 ([e5899f0](https://github.com/ClarityJS/git-neko-kit/commit/e5899f0feeef98449e5fafecc544194fe797e6c9))


### ♻️ 代码重构

* **common:** 新增错误消息模块并优化错误处理 ([1323b13](https://github.com/ClarityJS/git-neko-kit/commit/1323b13088e7159d8395731c1c54e8d7cbd66703))
* **date:** 重构日期格式化方法 ([3b0f68f](https://github.com/ClarityJS/git-neko-kit/commit/3b0f68f811883cea6af917f311317dfacb5e24cf))
* **github:** 优化提交信息获取功能 ([0b33dae](https://github.com/ClarityJS/git-neko-kit/commit/0b33daea44ab04bb5602002b0d6da07dcaa652f6))
* **models:** 将生成安装链接和配置链接的方法移至 App 类 ([a70695b](https://github.com/ClarityJS/git-neko-kit/commit/a70695b1be49d823482521a792df31ad00f30e0f))

## [0.2.0](https://github.com/ClarityJS/git-neko-kit/compare/v0.1.0...v0.2.0) (2025-04-10)


### ✨ 新功能

* **github:** 实现通过访问令牌获取用户信息的方法 ([d2f56a6](https://github.com/ClarityJS/git-neko-kit/commit/d2f56a6a522f4aea63d5dc5c24eae00cdf48cbf9))
* **github:** 添加获取提交信息功能 ([c024133](https://github.com/ClarityJS/git-neko-kit/commit/c0241338267297c86f002448d69d443f7600da9d))
* **user:** 添加 GitHub 用户操作类和相关类型定义 ([166ed9a](https://github.com/ClarityJS/git-neko-kit/commit/166ed9ac0e1137da472a7996a1e22db97d75ccc3))
* **user:** 添加获取用户贡献日历数据功能 ([7b14d94](https://github.com/ClarityJS/git-neko-kit/commit/7b14d9401847beba4d811064c572f825262df000))


### 🐛 错误修复

* **github:** 优化 token 设置逻辑 ([a83c511](https://github.com/ClarityJS/git-neko-kit/commit/a83c51106f1e309e9073fdc740575985cc5917a1))
* **github:** 修复用户贡献信息获取功能 ([0c0959d](https://github.com/ClarityJS/git-neko-kit/commit/0c0959dbe299a8d849551aa5db17c28c4866d106))
* **src:** 优化用户信息获取异常处理 ([f7c9844](https://github.com/ClarityJS/git-neko-kit/commit/f7c9844fe56a580ca048bf4812d48725f0c01b96))


### ♻️ 代码重构

* **github:** 修改用户贡献获取方法的名称 ([94e22ff](https://github.com/ClarityJS/git-neko-kit/commit/94e22ff104a4cc92c925df9e28a2ed8ca61f9064))
* **github:** 重构 GitHub 类的初始化逻辑 ([6f14421](https://github.com/ClarityJS/git-neko-kit/commit/6f144212bc5e36c96eff4b5678a8e6a3d86cc461))
* **models:** 重构 GitHub 相关模型 ([8207e8d](https://github.com/ClarityJS/git-neko-kit/commit/8207e8d7ee14d8e9d48997cfd86a09d9cae606d6))
* **src/models/github/user.ts:** 添加获取用户贡献数据的方法 ([904d0ab](https://github.com/ClarityJS/git-neko-kit/commit/904d0abdcd3af421930505d81c54caf70732669d))
* **types:** 重构 GitHub API 类型定义 ([4a3f332](https://github.com/ClarityJS/git-neko-kit/commit/4a3f332613ba5ded40c3043b228bc0766a18f207))


### 🎡 持续集成

* 使用 GitHub App 令牌进行身份验证 ([601d61b](https://github.com/ClarityJS/git-neko-kit/commit/601d61b7ee65ef2f41eeda4860084dcf720dcf6f))

## [0.1.0](https://github.com/ClarityJS/git-neko-kit/compare/v0.0.3...v0.1.0) (2025-04-08)


### ✨ 新功能

* **base:** 添加代理配置功能 ([b5572e9](https://github.com/ClarityJS/git-neko-kit/commit/b5572e966786519825534ded8685315007d251c7))
* **common:** 添加日期格式化函数并优化仓库信息展示 ([2c2c535](https://github.com/ClarityJS/git-neko-kit/commit/2c2c535fc2c4e91dd0b3a0827d35964ea8426720))
* **github-auth:** 添加 token 状态检查功能并增强 refresh_token 安全性 ([eed19bb](https://github.com/ClarityJS/git-neko-kit/commit/eed19bb3587dc7a18aad08b90616d5dc10627f1b))
* **github:** 添加创建组织仓库功能 ([ced06d8](https://github.com/ClarityJS/git-neko-kit/commit/ced06d8105b35f371ae50d8630b5ac61eff11e3e))
* **github:** 添加获取组织仓库列表功能并更新相关类型定义 ([0d147cb](https://github.com/ClarityJS/git-neko-kit/commit/0d147cb79da34a92a92b152f6a53a7222e945e17))
* **models:** 优化请求处理和身份验证机制 ([2bd84a5](https://github.com/ClarityJS/git-neko-kit/commit/2bd84a5584347488645214d3f3befab83f028032))
* **proxy:** 增加通用代理配置并优化代理设置 ([329fa0c](https://github.com/ClarityJS/git-neko-kit/commit/329fa0c868fb5e7bd75a2e957016aff9136a5d5c))


### 🐛 错误修复

* **github:** 修复 GitHub token_status 接口调用方式 ([886034a](https://github.com/ClarityJS/git-neko-kit/commit/886034afb95490d6b8827dace048394c4938d62a))
* **github:** 添加 token 格式校验 ([782d7d7](https://github.com/ClarityJS/git-neko-kit/commit/782d7d704980cbada13cf8ab8fdf9c88b547f6ef))
* **github:** 适配仓库地址反向代理 ([1dd5112](https://github.com/ClarityJS/git-neko-kit/commit/1dd51126d07f2a8a92b04cdfd64064aa198cde51))
* **models:** 修复 GitHub 事件处理中的 URL 问题 ([902fee8](https://github.com/ClarityJS/git-neko-kit/commit/902fee812712ef95b0b93c1e98d67425c2f33486))


### 📝 文档更新

* **README:** 更新 API 封装进度文档 ([b56f028](https://github.com/ClarityJS/git-neko-kit/commit/b56f028f8da17dcba192315f44d58164819ef6ca))
* 优化代码结构并添加文档生成配置 ([b39ebcd](https://github.com/ClarityJS/git-neko-kit/commit/b39ebcdc60fdb59c6f034ec893aa7dcdbd1bd879))


### ♻️ 代码重构

* **common:** 优化 readJSON 函数并添加类型支持 ([c5debfb](https://github.com/ClarityJS/git-neko-kit/commit/c5debfbac16607ffd5db61821dfc3ddff37b2e73))
* **github:** 更新创建组织仓库接口参数 ([3ca69c2](https://github.com/ClarityJS/git-neko-kit/commit/3ca69c2cff33c3c7fc756d3450adfe3663a81e48))
* **github:** 重构 GitHub 相关代码 ([0abf39d](https://github.com/ClarityJS/git-neko-kit/commit/0abf39d846b6ee3014a5d54e71b054e74275740a))
* **github:** 重构 GitHub 相关代码并优化错误处理 ([52780b8](https://github.com/ClarityJS/git-neko-kit/commit/52780b8f3fed2570533cd5b7221a915fdfca654c))
* **github:** 重构 GitHub 相关类型定义 ([198d47f](https://github.com/ClarityJS/git-neko-kit/commit/198d47f0f831c9e5c7fa115478e86aedf5225f4a))
* **github:** 重构 GitHub 类 ([a539484](https://github.com/ClarityJS/git-neko-kit/commit/a539484c84c52f6b65ba337cd2bff8ea1a286093))
* **github:** 重构 GitHub 类的 token 使用方式 ([b8f4f8d](https://github.com/ClarityJS/git-neko-kit/commit/b8f4f8d11ddfcba7143417af20187f5524472325))
* **github:** 重构反代地址解析逻辑 ([3712bef](https://github.com/ClarityJS/git-neko-kit/commit/3712befbf23d80cf64fb9600a7d45570e0a62f2e))
* **models:** 优化 create_org_repo 方法返回类型定义 ([bc90dd3](https://github.com/ClarityJS/git-neko-kit/commit/bc90dd31c56236b6ee7c7c7eb9d7686407df4421))
* **src:** 优化 readJSON 函数的类型定义 ([744cf1f](https://github.com/ClarityJS/git-neko-kit/commit/744cf1f15b2acee5f4b2849a57718df2909600a7))


### 📦️ 构建系统

* **tsup:** 调整目标 ECMAScript 版本为 Node.js 22 ([9e6dba4](https://github.com/ClarityJS/git-neko-kit/commit/9e6dba4eccc2bb35766fb09af7064b04b2be792d))

## [0.0.3](https://github.com/ClarityJS/git-neko-kit/compare/v0.0.2...v0.0.3) (2025-03-31)


### 🎡 持续集成

* 调整 release 工作流中的输出定义位置 ([0f9ffcb](https://github.com/ClarityJS/git-neko-kit/commit/0f9ffcb03393613ae12fadbab2d4e9dd2012ae74))

## [0.0.2](https://github.com/ClarityJS/git-neko-kit/compare/v0.0.1...v0.0.2) (2025-03-31)


### ♻️ 代码重构

* **github:** 重构 Github App 授权流程 ([f6d47ab](https://github.com/ClarityJS/git-neko-kit/commit/f6d47ab4b8bf073fbf2975b058f9038ba2b675cb))
* 重构项目并优化代码 ([6689ab1](https://github.com/ClarityJS/git-neko-kit/commit/6689ab1e962f8623c16a1cfb4006008bc0220f12))


### 🎡 持续集成

* **release-beta:** 优化构建文件传输方式 ([f64fa0a](https://github.com/ClarityJS/git-neko-kit/commit/f64fa0a20bfdaa84fa8dd832d6de82f598023741))
* **release:** 更新环境变量引用并简化工作流 ([45c7b92](https://github.com/ClarityJS/git-neko-kit/commit/45c7b92d04ea2c5e007fc48b2e19350c0833d5cd))
* **workflow:** 优化构建和发布流程 ([a2304c1](https://github.com/ClarityJS/git-neko-kit/commit/a2304c1af2a0aa2001926cdaeb0f03d035ad181c))
* 移除 release 工作流中的代码提交步骤 ([566b3fb](https://github.com/ClarityJS/git-neko-kit/commit/566b3fb8fda9a50853b6c316f9172c91b3da174e))


## [0.0.1] (2025-03-26)

### ✨ 新功能

* 初始化 GitToolkit 项目 ([68a33bc](https://github.com/ClarityJS/git-neko-kit/commit/68a33bc46a87a06a0adc7ac73c6ee473bee1f97b))

### 🔄 持续集成

* **release:** 更新发布流程和包配置 ([344a1e0](https://github.com/ClarityJS/git-neko-kit/commit/344a1e0b25555c627f34825a5119aa5e9c8b404a))
