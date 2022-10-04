import { router } from '@/router';
import { defineStore } from 'pinia'

interface UserState {
  userInfo: null | UserInfo;
}
interface UserInfo {
  uid: number;
  nickname: string;
  avatar: string;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    userInfo: null
  }),
  getters: {
    isLogin: (state) => !!state.userInfo
  },
  actions: {
    login({ nickname, email = '' }: { nickname: string; email: string; }) {
      this.userInfo = {
        uid: 1,
        nickname,
        avatar: 'https://secure.gravatar.com/avatar/32a82c21335fafd4bd8e069b6d74aa5c?s=60&d=mm&r=g'
      }
      router.replace({
        name: 'Home'
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
