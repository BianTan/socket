import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'

import { createRouter, createWebHashHistory } from 'vue-router'
import { store } from '@/store'
import { basicRoutes } from './routes'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore(store)

export const router = createRouter({
  history: createWebHashHistory(),
  routes: basicRoutes as unknown as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

router.beforeEach(async (to, from , next) => {

  if (to.meta.login && !userStore.isLogin) {
    next({
      name: 'Login',
      query: {
        redirect: location.hash.replace('#', '')
      }
    })
  }

  userStore.checkLogin()

  next()
})

export function setupRouter(app: App<Element>) {
  app.use(router)
}
