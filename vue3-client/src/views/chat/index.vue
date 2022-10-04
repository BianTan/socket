<template>
  <div class="chat-page">
    <div class="header">
      <i class="iconfont icon-back" @click="onBack" />
      <div class="center">
        <DanImage v-if="!isGroup" round fit="cover" class="avatar" />
        <div class="info">
          <div class="name">我是笨蛋小扁担</div>
          <div class="state">{{ state }}</div>
        </div>
      </div>
    </div>
    <div ref="MsgListRef" class="message-list">
      <Message :avatar="isGroup" />
      <Message :avatar="isGroup" is-me />
      <Message :avatar="isGroup" is-me />
      <Message :avatar="isGroup" />
      <Message :avatar="isGroup" />
    </div>
    <div class="footer-action">
      <div class="input-container">
        <input v-model="content" placeholder="请输入聊天内容" type="text">
        <div class="send-btn">发送</div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Message from './components/Message.vue'

const route = useRoute()
const router = useRouter()
const MsgListRef = ref()

const id = ref(route.params.id)
const content = ref('')
const isGroup = ref(id.value === '1')
const state = computed(() => {
  return isGroup.value
    ? '12 人在线'
    : '在线'
})

const onBack = () => router.back()

onMounted(async () => {
  await nextTick()
  if (!MsgListRef.value) return
  MsgListRef.value.scrollTop = MsgListRef.value.scrollHeight
})

</script>

<style lang='scss' scoped>
.chat-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #F8F8F8;
  .header {
    display: flex;
    align-items: center;
    background-color: #999999;
    padding: 12px 0;
    .iconfont {
      font-size: 20px;
      padding: 0 12px;
    }
    .center {
      flex: 1;
      display: flex;
      align-items: center;
      height: 48px;
      .avatar {
        width: 48px;
        height: 48px;
      }
      .info {
        flex: 1;
        padding: 0 12px;
        .name {
          color: #333;
          font-size: 16px;
        }
        .state {
          color: #eee;
          font-size: 14px;
          margin-top: 4px;
        }
      }
    }
  }
  .message-list {
    flex: 1;
    padding: 12px;
    overflow-x: scroll;
  }
  .footer-action {
    font-size: 16px;
    padding: 8px 16px;
    box-sizing: border-box;
    background-color: #D9D9D9;
    .input-container {
      display: flex;
      align-items: center;
      input {
        flex: 1;
        outline: none;
        padding: 6px 12px;
        border-radius: 8px;
        border: none;
      }
      .send-btn {
        color: #333;
        font-size: 14px;
        flex-shrink: 0;
        padding: 8px 16px;
        border-radius: 8px;
        margin-left: 16px;
        background-color: white;
      }
    }
  }
}
</style>
