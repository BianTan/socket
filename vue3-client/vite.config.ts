import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import path from 'path'
import pxtorem from 'postcss-pxtorem'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      dts: true,
      dirs: ['src/components']
    })
  ],
  css: {
    postcss: {
      plugins: [
        pxtorem({
          rootValue: 37.5,
          propList: ['*'],
          selectorBlackList: ['global', 'html']
        })
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
