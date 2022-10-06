import { defineStore } from 'pinia'
import { useSocket } from '@/hooks/useSocket'
import { useStorage, StorageSerializers, RemovableRef } from '@vueuse/core'

interface UserState {
  info: RemovableRef<null | UserInfo>;
  users: UserInfo[];
  session: RemovableRef<string>;
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
    info: useStorage('user_info', null, sessionStorage, { serializer: StorageSerializers.object }),
    users: [],
    session: useStorage('session', '', localStorage)
  }),
  getters: {
    isLogin: (state) => state.info && state.session,
    onlineCount: (state) => state.users.filter(f => f.connected).length
  },
  actions: {
    // 登录
    login(payload: { nickname: string; email: string; } | { session: string; }) {
      const { socket } = useSocket()
      socket.auth = payload
      socket.connect()
    },
    // 退出登录
    logout() {
      const { socket } = useSocket()
      this.info = null
      this.users = []
      this.session = ''
      socket.close()
    },
    // 检测登录
    checkLogin() {
      const { socket } = useSocket()
      if (!this.session || socket.active) return
      this.login({ session: this.session })
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
