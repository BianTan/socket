<template>
  <div class="chat-page">
    <div v-if="roomDetail" class="header">
      <i class="iconfont icon-back" @click="onBack" />
      <div class="center">
        <DanImage
          v-if="!isGroup"
          :src="roomDetail.img"
          round
          fit="cover"
          class="avatar"
        />
        <div class="info">
          <div class="name">{{ roomDetail.name }}</div>
          <!-- <div class="state">{{ state }}</div> -->
        </div>
      </div>
    </div>
    <div ref="MsgListRef" class="message-list">
      <Message
        v-for="(item, index) in list"
        :key="index"
        :detail="item"
        :avatar="isGroup"
      />
    </div>
    <div class="footer-action">
      <div class="input-container">
        <input
          v-model="content"
          placeholder="请输入聊天内容"
          type="text"
          @keyup.enter="onSend"
        >
        <div class="send-btn" @click="onSend">发送</div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useChatStore } from '@/store/modules/chat'
import { useUserStore } from '@/store/modules/user'
import { useSocket } from '@/hooks/useSocket'

import Message from './components/Message.vue'

const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()
const userStore = useUserStore()

const { socket } = useSocket()
const MsgListRef = ref()

const id = ref(route.params.id)
const content = ref('')
const isGroup = ref(id.value === 'main')
const state = computed(() => {
  return isGroup.value
    ? '12 人在线'
    : '在线'
})
const list = computed(() => {
  const msgList = chatStore.msgMap[id.value as string]
  return msgList || []
})
const roomDetail = computed(() => {
  return chatStore.rooms.find(f => f.id === id.value)
})

const onBack = () => router.back()
const onSend = () => {
  const payload: {
    type: 1 | 2;
    msg: string;
    to?: string;
  } = {
    type: isGroup ? 1 : 2,
    msg: content.value
  }
  if (!isGroup) payload['to'] = id.value as string

  let msgList = chatStore.msgMap[id.value as string]
  if (!msgList) msgList = chatStore.msgMap[id.value as string] = []
  if (!userStore.info) return
  const { avatar, nickname } = userStore.info
  msgList.push({
    avatar,
    nickname,
    msg: content.value,
    isMe: true
  })
  content.value = ''

  socket.emit('message', payload)
}

onMounted(async () => {
  await nextTick()
  chatStore.curRooms = id.value as string
  if (!MsgListRef.value) return
  MsgListRef.value.scrollTop = MsgListRef.value.scrollHeight
})
onUnmounted(() => {
  chatStore.curRooms = ''
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
