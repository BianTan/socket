import { defineStore } from 'pinia'
import { useSocket } from '@/hooks/useSocket'

interface UserState {
  info: null | UserInfo;
  users: UserInfo[];
}
interface UserInfo {
  uid: string;
  nickname: string;
  avatar: string;
  email: string;
  connected: boolean;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    info: null,
    users: []
  }),
  getters: {
    isLogin: (state) => !!state.info,
    onlineCount: (state) => state.users.filter(f => f.connected).length
  },
  actions: {
    login(payload: { nickname: string; email: string; } | { session: string; }) {
      const { socket } = useSocket()
      socket.auth = payload
      socket.connect()
    },
    async getUserInfo(reset = false) {
      if (!reset && this.isLogin) return null
      try {
        return null
      } catch (err) {
        console.log(err)
        return null
      }
    },
    // 更新用户状态
    updateUserState(type: 1 | 2, payload: UserInfo) {
      const userIndex = this.users.findIndex(f => f.uid === payload.uid)
      const hasUser = userIndex >= 0
      if (type === 1) {
        // user connected
        if (hasUser) {
          Object.assign(this.users[userIndex], {
            connected: true
          })
        } else {
          this.users.push(payload)
        }
      } else if (type === 2) {
        // user disconnected
        if (!hasUser) return
        Object.assign(this.users[userIndex], {
          connected: false
        })
      }
    }
  }
})
