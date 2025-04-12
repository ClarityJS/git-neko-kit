import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'
import navbar from './config/navbar'
import sidebar from './config/sidebar'

export default defineUserConfig({
  base: '/',
  lang: 'zh-CN',
  title: 'git-neko-kit',
  description: 'GitHub, Gitee, GitCode等平台API封装库',

  head: [
    ['link', { rel: 'image/x-icon', type: 'icon', href: '/favicon.ico'  }],
  ],

  bundler: viteBundler(),
  shouldPrefetch: false,

  theme: plumeTheme({
    navbar,
    notes: false,
    sidebar,
    /**
     * 主题配置
    /* 添加您的部署域名, 有助于 SEO, 生成 sitemap */
    // hostname: 'https://your_site_url',
    blog: false, // 禁用博客功能
    cache: 'filesystem',

    /**
     * 为 markdown 文件自动添加 frontmatter 配置
     * @see https://theme-plume.vuejs.press/config/basic/#autofrontmatter
     */
    autoFrontmatter: {
      permalink: true,  // 是否生成永久链接
      createTime: true, // 是否生成创建时间
      title: true,      // 是否生成标题
    },

    /* 本地搜索, 默认启用 */
    search: { 
      provider: 'local' 
    },

    /* 文章字数统计、阅读时间，设置为 false 则禁用 */
    readingTime: {
      wordPerMinute: 300,
    },
  }),
})
