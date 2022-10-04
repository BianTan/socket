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
import { reactive } from 'vue'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

const loginForm = reactive({
  nickname: '',
  email: ''
})

const login = () => userStore.login(loginForm)

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
    padding: 24px 48px;
    box-sizing: border-box;
    .item  {
      display: flex;
      align-items: center;
      input {
        flex: 1;
        outline: none;
        margin-left: 12px;
        padding: 6px 12px;
        border-radius: 6px;
        border: 1px solid #888;
      }
      &:not(:last-child) {
        margin-bottom: 12px;
      }
    }
  }
  .login-btn {
    color: white;
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
