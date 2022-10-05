<template>
  <div class="login-page">
    <div class="title">登录</div>
    <div class="login-form">
      <div class="item">
        <div class="label">昵称</div>
        <input v-model="loginForm.nickname" type="text">
      </div>
      <div class="item">
        <div class="label">邮箱</div>
        <input v-model="loginForm.email" type="email">
      </div>
    </div>
    <div class="login-btn" @click="login">登录</div>
  </div>
</template>

<script lang='ts' setup>
import { reactive, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { useChatStore } from '@/store/modules/chat'
import { useSocket } from '@/hooks/useSocket'

const { socket } = useSocket()
const route = useRoute()
const userStore = useUserStore()
const chatStore = useChatStore()

const loginForm = reactive({
  nickname: '',
  email: ''
})

const login = () => userStore.login(loginForm)

const init = () => {
  const session = localStorage.getItem('session')
  if (!session) return
  userStore.login({ session })
}
init()

onMounted(() => {
  // 登录
  socket.on('login', ({ info, users, rooms, session }) => {
    userStore.info = info
    userStore.users = users
    chatStore.rooms = rooms

    localStorage.setItem('session', session)
    
    const redirect = decodeURIComponent((route.query.redirect as string) || '#/home')
    window.location.replace(location.origin + redirect)
  })
  // 连接失败
  socket.on('connect_error', (err) => {
    console.log('err.message', err.message)
    localStorage.removeItem('session')
  })
})
onUnmounted(() => {
  socket.off('connect_error')
  socket.off('login')
})

</script>

<style lang='scss' scoped>
.login-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    color: #333;
    font-size: 64px;
    margin-top: 12vh;
  }
  .login-form {
    width: 100%;
    padding: 24px;
    margin-top: 22px;
    box-sizing: border-box;
    .item  {
      display: flex;
      align-items: center;
      .label {
        font-size: 16px;
        flex-shrink: 0;
      }
      input {
        flex: 1;
        outline: none;
        margin-left: 12px;
        padding: 6px 12px;
        border-radius: 6px;
        border: 1px solid #888;
        font-size: 16px;
      }
      &:not(:last-child) {
        margin-bottom: 12px;
      }
    }
  }
  .login-btn {
    color: white;
    font-size: 16px;
    width: 64px;
    height: 64px;
    line-height: 64px;
    cursor: pointer;
    text-align: center;
    border-radius: 50%;
    background-color: #999;
  }
}
</style>
