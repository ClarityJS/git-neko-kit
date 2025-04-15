import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/root.ts'],      // 入口文件
  format: ['cjs', 'esm'],       // ESM格式
  bundle: true,                 // 打包依赖
  dts: true,                    // 生成类型声明文件
  clean: true,                  // 清理dist目录
  minify: true,                 // 压缩生产环境代码
  target: 'node22',             // 指定ECMAScript目标版本
  sourcemap: false,              // 生成sourcemap
  treeshake: true,              // 启用树摇优化
  platform: 'node',            // 指定为Node.js环境
  splitting: false,             // 代码分割, 是否拆分文件
  outDir: 'dist',               // 指定输出目录 
  external: [],                 // 外部依赖, 不打包进输出文件中
})