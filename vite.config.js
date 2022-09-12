import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
      // 指定symbolId格式
      symbolId: 'icon-[name]'
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@comps': path.resolve(__dirname, 'src/components'),
      '@layout': path.resolve(__dirname, 'src/layout')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: '@import "src/styles/variables.less";'
      }
    }
  },
  esbuild: {
    drop: ['console', 'debugger']
  },
  server: {
    host: 'localhost',
    https: false, //是否启用 http 2
    cors: true, //为开发服务器配置 CORS , 默认启用并允许任何源
    open: true, //服务启动时自动在浏览器中打开应用
    port: '9000',
    proxy: {
      '/api': {
        target: 'https://xxxx.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
