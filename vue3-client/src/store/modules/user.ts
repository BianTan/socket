import { defineStore } from 'pinia'
import { useSocket } from '@/hooks/useSocket'
import { useChatStore } from './chat'
import { router } from '@/router'

interface UserState {
  info: null | UserInfo;
  users: UserInfo[];
}
interface UserInfo {
  uid: string;
  nickname: string;
  avatar: string;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    info: null,
    users: []
  }),
  getters: {
    isLogin: (state) => !!state.info
  },
  actions: {
    login(payload: { nickname: string; email: string; } | { session: string; }) {
      const { socket } = useSocket()
      socket.auth = payload
      socket.connect()
      socket.on('login', ({ info, users, rooms, session }) => {
        const chatStore = useChatStore()
        
        this.info = info
        this.users = users
        chatStore.rooms = rooms

        localStorage.setItem('session', session)
        socket.off('login')
        socket.on('message', chatStore.onMessage)
        
        router.replace({
          name: 'Home'
        })
      })
    },
    async getUserInfo(reset = false) {
      if (!reset && this.isLogin) return null
      try {
        return null
      } catch (err) {
        console.log(err)
        return null
      }
    }
  }
})
