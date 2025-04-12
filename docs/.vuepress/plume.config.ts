import { defineThemeConfig } from 'vuepress-theme-plume'
import navbar from './config/navbar'

/**
 * @see https://theme-plume.vuejs.press/config/basic/
 */
export default defineThemeConfig({
  logo: '/logo.png',

  appearance: true,  // 配置 深色模式

  // navbarSocialInclude: ['github'], // 允许显示在导航栏的 social 社交链接
  // aside: true, // 页内侧边栏， 默认显示在右侧
  // outline: [2, 3], // 页内大纲， 默认显示 h2, h3

  /**
   * 文章版权信息
   * @see https://theme-plume.vuejs.press/guide/features/copyright/
   */
  // copyright: true,

  prevPage: true,   // 是否启用上一页链接
  nextPage: true,   // 是否启用下一页链接
  createTime: true, // 是否显示文章创建时间

  /* 站点页脚 */
  footer: {
    message: 'Power by <a target="_blank" href="#">git-neko-kit</a>',
    copyright: '',
  },



})
