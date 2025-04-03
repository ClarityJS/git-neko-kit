# 变更日志

## [0.1.0](https://github.com/ClarityJS/git-neko-kit/compare/v0.0.3...v0.1.0) (2025-04-03)


### ✨ 新功能

* **base:** 添加代理配置功能 ([b5572e9](https://github.com/ClarityJS/git-neko-kit/commit/b5572e966786519825534ded8685315007d251c7))
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
* **github:** 重构 GitHub 相关代码并优化错误处理 ([52780b8](https://github.com/ClarityJS/git-neko-kit/commit/52780b8f3fed2570533cd5b7221a915fdfca654c))
* **github:** 重构 GitHub 相关类型定义 ([198d47f](https://github.com/ClarityJS/git-neko-kit/commit/198d47f0f831c9e5c7fa115478e86aedf5225f4a))
* **github:** 重构 GitHub 类 ([a539484](https://github.com/ClarityJS/git-neko-kit/commit/a539484c84c52f6b65ba337cd2bff8ea1a286093))
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
