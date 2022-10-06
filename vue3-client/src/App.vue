<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { useChatStore } from '@/store/modules/chat'
import { useSocket } from '@/hooks/useSocket'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const chatStore = useChatStore()
const { socket } = useSocket()

onMounted(async () => {
  // 登录
  socket.on('login', ({ info, users, rooms, session, message }) => {
    userStore.info = info
    userStore.users = users
    userStore.session = session
    chatStore.rooms = rooms
    chatStore.messageList = message

    if (location.hash !== '#/login') return
    const redirect = (route.query.redirect as string) || '/home'
    router.replace(redirect)
  })
  // 连接失败
  socket.on('connect_error', (err) => {
    const { code } = JSON.parse(err.message)
    if (code === 1001) {
      userStore.logout()
      // 重新登录
      router.push({
        name: 'Login',
        query: {
          redirect: location.hash.replace('#', '')
        }
      })
    }
  })
  // 发送消息
  socket.on('message', chatStore.onMessage)
  // 用户上线
  socket.on('user connected', (payload) => userStore.updateUserState(1, payload))
  // 用户下线
  socket.on('user disconnected', (payload) => userStore.updateUserState(2, payload))
})

</script>
