import type { AppRouteModule } from '@/router/types'

const ChatRoute: AppRouteModule[] = [
  {
    path: '/chat/:id',
    name: 'Chat',
    component: () => import('@/views/chat/index.vue'),
    meta: {
      login: true
    }
  }
]

export default ChatRoute
