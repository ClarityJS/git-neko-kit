# 变更日志

## [0.4.0](https://github.com/ClarityJS/git-neko-kit/compare/v0.3.0...v0.4.0) (2025-04-19)


### ✨ 新功能

* **github:** 添加 GitHub Issue 相关操作支持 ([36449c7](https://github.com/ClarityJS/git-neko-kit/commit/36449c7ffe31eb26ffcad1960379bee472f3f73d))
* **github:** 添加速率限制错误处理 ([e37e89a](https://github.com/ClarityJS/git-neko-kit/commit/e37e89a58ab24e28e10a80aad837a4f46c173e09))


### 🐛 错误修复

* **auth:** 修复一处类型错误 ([9b5aef2](https://github.com/ClarityJS/git-neko-kit/commit/9b5aef251b5edf29f60bcecbe68263cfca1dc025))


### ♻️ 代码重构

* **github:** 优化 GitHub API 调用和错误处理 ([c9510a0](https://github.com/ClarityJS/git-neko-kit/commit/c9510a00a8a495cf793b70292a80fa6019eb9f38))
* **github:** 重构仓库列表接口参数 ([240565e](https://github.com/ClarityJS/git-neko-kit/commit/240565e35ace5d571c5ffadeabc397f1de68cb3e))

## [0.3.0](https://github.com/ClarityJS/git-neko-kit/compare/v0.2.0...v0.3.0) (2025-04-18)


### ✨ 新功能

* **auth:** 完善 Token 验证和错误处理 ([111d3e9](https://github.com/ClarityJS/git-neko-kit/commit/111d3e9ccaefbd2a1f876d53754c1b2c610484e8))
* **commit:** 格式化提交信息中的日期 ([56d2b6b](https://github.com/ClarityJS/git-neko-kit/commit/56d2b6b35c389e3728b93cb0da9888dd065f1851))
* **common:** 优化日期处理功能并添加相对时间功能 ([8c92b2b](https://github.com/ClarityJS/git-neko-kit/commit/8c92b2b2aeb3f03b78548297cfbc82f555524d49))
* **github/user:** 添加通过用户id获取用户信息方法 ([ab78d8b](https://github.com/ClarityJS/git-neko-kit/commit/ab78d8b18d350d765b4f024707c8254771e35794))
* **github:** 完善错误处理和消息提示 ([f94ed08](https://github.com/ClarityJS/git-neko-kit/commit/f94ed08e0455da236c06cc3cec382796666fd1a0))
* **github:** 添加 WebHook 签名验证功能 ([2a6a928](https://github.com/ClarityJS/git-neko-kit/commit/2a6a928e8b27b0129f22dd9c777f3eb7930a6634))
* **github:** 添加获取仓库可见性的功能 ([f422f7b](https://github.com/ClarityJS/git-neko-kit/commit/f422f7bfd9f94807aa1cfb7aacb6f0d35445e739))
* **github:** 添加获取用户仓库列表功能 ([4efe253](https://github.com/ClarityJS/git-neko-kit/commit/4efe253d6f256d9edf9fd46a951145ce2e4569b2))
* **models/github:** 添加 webhook 模型并更新配置 ([784bc8a](https://github.com/ClarityJS/git-neko-kit/commit/784bc8a30b16f9f70fdf0a84fc3e77a5d9b7325f))
* **models:** 添加生成用户唯一标识符的功能并优化导出 ([da934a9](https://github.com/ClarityJS/git-neko-kit/commit/da934a9cb87fdb42c5a74b15aef38715b78c4486))
* **src:** 导出日期格式化和相对时间函数 ([f83081d](https://github.com/ClarityJS/git-neko-kit/commit/f83081da28df9b911e30af0f9500508fdfb2d99d))
* **user:** 添加快速获取用户信息的方法 ([97dd3df](https://github.com/ClarityJS/git-neko-kit/commit/97dd3df2af3bd080613650d12198b97c7417deca))


### 🐛 错误修复

* **dayjs:** 修复 dayjs 本地化文件导入路径 ([dd2d05c](https://github.com/ClarityJS/git-neko-kit/commit/dd2d05c56e539ba8679b96599a3c042c2bbe8c99))
* **github:** 为获取 commit 信息设置正确的 token ([f7f2b8d](https://github.com/ClarityJS/git-neko-kit/commit/f7f2b8dfc2006fa8cfc2cdccd20e813c32b6597c))
* **github:** 为获取 commit 信息设置正确的 token ([42aff21](https://github.com/ClarityJS/git-neko-kit/commit/42aff21e7739fbf747518caba60e5dbb26ea4736))
* **github:** 优化用户仓库获取逻辑 ([472d591](https://github.com/ClarityJS/git-neko-kit/commit/472d591c8ccbfe92bd293976e0bdb8c6ead163d8))
* **github:** 修复获取仓库列表的参数处理 ([93d16f5](https://github.com/ClarityJS/git-neko-kit/commit/93d16f5a689a9be1d95da358138db7a7ff3542cd))
* **github:** 增加对 422 错误的处理 ([f57f284](https://github.com/ClarityJS/git-neko-kit/commit/f57f2848a1bfe12d4cc99fa1a28089efcfe73427))
* **models:** 修复错误消息 ([e5899f0](https://github.com/ClarityJS/git-neko-kit/commit/e5899f0feeef98449e5fafecc544194fe797e6c9))
* **platform/github:** 修复初始化实例APP_ID的类型 ([c33ee56](https://github.com/ClarityJS/git-neko-kit/commit/c33ee56a374c2464b11014cbace073ecf9c3814c))
* **repo:** 修复获取组织仓库列表逻辑 ([aa2cd03](https://github.com/ClarityJS/git-neko-kit/commit/aa2cd038920b65a2993782fc4c6fa053e971cbfd))
* **user:** 修复获取用户信息的异常输出 ([f422579](https://github.com/ClarityJS/git-neko-kit/commit/f4225791e2cb44abc49271e7770bddbaacf7bb4b))


### 📝 文档更新

* **README:** 更新 GitHub SDK 使用示例 ([3665148](https://github.com/ClarityJS/git-neko-kit/commit/3665148e02c557dd8a140ad201cbdfcb3cb7d405))
* 初始化 VuePress 文档构建流程 ([45ff8a3](https://github.com/ClarityJS/git-neko-kit/commit/45ff8a3e08d4c10e396cb46dcac3116a5ac93835))


### ♻️ 代码重构

* **common:** 优化代码格式和错误处理 ([507d7fa](https://github.com/ClarityJS/git-neko-kit/commit/507d7fa484ca664aee68c43645ee21555f9e3540))
* **common:** 优化语言包加载逻辑并统一代理设置 ([f185851](https://github.com/ClarityJS/git-neko-kit/commit/f185851dd7bb1d6837ea7be31244c5dd76f0f846))
* **common:** 新增错误消息模块并优化错误处理 ([1323b13](https://github.com/ClarityJS/git-neko-kit/commit/1323b13088e7159d8395731c1c54e8d7cbd66703))
* **date:** 重构日期格式化方法 ([3b0f68f](https://github.com/ClarityJS/git-neko-kit/commit/3b0f68f811883cea6af917f311317dfacb5e24cf))
* **github:** 优化 GitHub 授权链接创建方法 ([a446f5e](https://github.com/ClarityJS/git-neko-kit/commit/a446f5ec8ce7ee8e530a4ef442b2a97139a21db0))
* **github:** 优化 token 状态检查逻辑 ([b8d8fd7](https://github.com/ClarityJS/git-neko-kit/commit/b8d8fd738be72b7f3918ead4234c629d864469b5))
* **github:** 优化仓库相关接口的参数处理和错误提示 ([b7592f6](https://github.com/ClarityJS/git-neko-kit/commit/b7592f690fa1819a2812e2c9e9c34d522fb3586f))
* **github:** 优化提交信息获取功能 ([0b33dae](https://github.com/ClarityJS/git-neko-kit/commit/0b33daea44ab04bb5602002b0d6da07dcaa652f6))
* **github:** 简化 get_repo_visibility 接口返回类型 ([ee077ee](https://github.com/ClarityJS/git-neko-kit/commit/ee077eeb12f78d8012a71876e87083f0a1bf9b49))
* **github:** 重构 Base 类以优化模块导入和实例化 ([de77e08](https://github.com/ClarityJS/git-neko-kit/commit/de77e081dbaa7aa20e6d8b4b906e8c0b0097f465))
* **github:** 重构 GitHub API 基础类 ([2f8ca1d](https://github.com/ClarityJS/git-neko-kit/commit/2f8ca1d33089dafbfbfc78f15fba8733935a75a7))
* **github:** 重构 GitHub API 方法命名 ([10f4b63](https://github.com/ClarityJS/git-neko-kit/commit/10f4b63aff906eae0f6b4586952ae02a63e341ae))
* **github:** 重构 GitHub 平台相关代码 ([8b54dd8](https://github.com/ClarityJS/git-neko-kit/commit/8b54dd8aeca72c060d74af6278e883954c0280f5))
* **github:** 重构 GitHub 相关类的构造函数并优化 webhook 功能 ([7aed3ae](https://github.com/ClarityJS/git-neko-kit/commit/7aed3ae1e31af28bbdae257f3122a426bbe3f145))
* **github:** 重构 WebHook 签名验证逻辑 ([a5f3d73](https://github.com/ClarityJS/git-neko-kit/commit/a5f3d7356b56832b102b83bb82a21afc636a384f))
* **github:** 重构获取用户仓库列表逻辑 ([4a177cd](https://github.com/ClarityJS/git-neko-kit/commit/4a177cd8035796a862cec5ff89abe5ebea34ebf2))
* **models:** 优化 GitHub App 和 Auth 类 ([ce19c01](https://github.com/ClarityJS/git-neko-kit/commit/ce19c01b1ff719a7a55d4a6de9532dc5d637cb2f))
* **models:** 优化代理配置逻辑 ([01f036f](https://github.com/ClarityJS/git-neko-kit/commit/01f036f04209737a726b53924aec99415dab4635))
* **models:** 将 GitHub 相关模型移至 platform 目录 ([8856493](https://github.com/ClarityJS/git-neko-kit/commit/8856493ef4a296465334294d56cdcc4789d710b2))
* **models:** 将生成安装链接和配置链接的方法移至 App 类 ([a70695b](https://github.com/ClarityJS/git-neko-kit/commit/a70695b1be49d823482521a792df31ad00f30e0f))
* **utils:** 为 get_relative_time 函数添加默认语言参数 ([0d4a000](https://github.com/ClarityJS/git-neko-kit/commit/0d4a000816aeafab376d3958eb73a012dfaea7f1))
* 优化代码结构和类型定义 ([95b5202](https://github.com/ClarityJS/git-neko-kit/commit/95b52024564c43664e65779708986120f549274d))


### 🎡 持续集成

* **deploy:** 将部署目标从 GitHub Pages 更改为 Cloudflare Pages ([9d93129](https://github.com/ClarityJS/git-neko-kit/commit/9d93129c6a84c1a6ba4de29b5f701b0959c85238))
* 更新 GitHub Actions 中私钥引用 ([0543e6a](https://github.com/ClarityJS/git-neko-kit/commit/0543e6a5c7a5683d6a705861345b5884e57a3f88))
* 更新 GitHub Actions 中私钥引用 ([73c15d2](https://github.com/ClarityJS/git-neko-kit/commit/73c15d24eff242ef3fc9953b3d8a7a505aa5354a))

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
