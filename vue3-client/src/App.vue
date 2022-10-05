<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { useChatStore } from '@/store/modules/chat'
import { useSocket } from '@/hooks/useSocket'

const userStore = useUserStore()
const chatStore = useChatStore()
const { socket } = useSocket()

onMounted(() => {
  // 发送消息
  socket.on('message', chatStore.onMessage)
  // 用户上线
  socket.on('user connected', (payload) => userStore.updateUserState(1, payload))
  // 用户下线
  socket.on('user disconnected', (payload) => userStore.updateUserState(2, payload))
})

</script>
