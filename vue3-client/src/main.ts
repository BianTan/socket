import { createApp } from 'vue'
import App from './App.vue'

import { setupStore } from '@/store'
import { setupRouter } from '@/router'

const app = createApp(App)

// 初始化 css
import 'normalize.css'
// 全局 css
import './assets/css/global.scss'

// 应用 pinia 全局状态管理
setupStore(app)

// 应用路由
setupRouter(app)

app.mount('#app')
