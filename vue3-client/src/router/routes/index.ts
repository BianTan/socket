import type { AppRouteRecordRaw, AppRouteModule } from '@/router/types'

// 获取 modules 目录下的所有 ts 文件
// const modules: any = require['context']('./modules/', true, /\.ts$/)
const modules: any = import.meta.globEager('./modules/*.ts')
const routeModuleList: AppRouteModule[] = []

// push 到 routeModuleList
Object.keys(modules).forEach((key: any) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
})

export const RootRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/account/login.vue'),
  meta: {
    title: '登录'
  }
}

export const basicRoutes = [
  RootRoute,
  ...routeModuleList
]
