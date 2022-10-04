import type { AppRouteModule } from '@/router/types'
import MainLayout from '@/layouts/main.vue'

const MainRoute: AppRouteModule = {
  path: '/',
  name: 'Main',
  component: MainLayout,
  redirect: '/home',
  children: [
    {
      path: 'home',
      name: 'Home',
      component: () => import('@/views/main/home/index.vue')
    }
  ],
  meta: {
    login: true
  }
}

export default MainRoute
