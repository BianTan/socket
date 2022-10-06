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
          <div class="state">{{ state }}</div>
        </div>
      </div>
    </div>
    <div ref="MsgListRef" class="message-list">
      <Message
        v-for="(item, index) in list"
        :key="index"
        :detail="item"
        :avatar="isGroup"
        @tap="() => onTap(item)"
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
import { MsgItem, useChatStore } from '@/store/modules/chat'
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
const isGroup = computed(() => id.value === 'main')
const list = computed(() => {
  const format = ({ msg, from, date }: MsgItem): {
    nickname: string;
    isMe: boolean;
    msg: string;
    uid: string;
    date: number;
    avatar: string;
    connected: boolean;
  } => {
    const { nickname = '', avatar = '', connected = false } = (userStore.users.find(f => f.uid === from) || {})
    const isMe = from === userStore.info?.uid
    return {
      nickname,
      avatar,
      connected,
      isMe,
      msg,
      uid: from,
      date
    }
  }
  return (chatStore.messageList[id.value as string] || []).map(m => format(m))
})
const roomDetail = computed(() => {
  return chatStore.rooms.find(f => f.id === id.value)
})
const userDetail = computed(() => {
  return userStore.users.find(f => f.uid === id.value)
})
const state = computed(() => {
  return isGroup.value
    ? `${userStore.onlineCount} 人在线`
    : userDetail.value?.connected ? '在线' : '离线'
})

const onBack = () => router.push({ name: 'Home' })
const onSend = () => {
  const payload: {
    type: 1 | 2;
    msg: string;
    to?: string;
  } = {
    type: isGroup.value ? 1 : 2,
    msg: content.value
  }
  if (!userStore.info) return
  if (!payload.msg.trim()) return

  if (!isGroup.value) payload['to'] = id.value as string
  let msgList = chatStore.messageList[id.value as string]
  if (!msgList) msgList = chatStore.messageList[id.value as string] = []
  const { uid } = userStore.info
  // 自己发的手动插入一条新消息
  msgList.push({
    msg: content.value,
    from: uid,
    to: payload.to || 'main',
    date: new Date().getTime()
  })
  content.value = ''
  // 更新列表的最新消息
  const roomIndex = chatStore.rooms.findIndex(f => f.id === (isGroup.value ? 'main' : payload.to))
  if (roomIndex >= 0) {
    Object.assign(chatStore.rooms[roomIndex], {
      msg: payload.msg.trim()
    })
  }
  updateScroll()

  // 发送消息
  socket.emit('message', payload)
}
const onTap = (item: {
    nickname: string;
    isMe: boolean;
    msg: string;
    uid: string;
    date: number;
    avatar: string;
    connected: boolean;
  }) => {
    if (item.isMe) return
    const { nickname, uid, avatar } = item
    const index = chatStore.rooms.findIndex(f => f.id === uid)
    if (index < 0) {
      chatStore.rooms.push({
        name: nickname,
        img: avatar,
        id: uid
      })
    }
    router.push({
      name: 'Chat',
      params: {
        id: item.uid
      }
    })
}

const updateScroll = async () => {
  if (!MsgListRef.value) return
  await nextTick()
  MsgListRef.value.scrollTop = MsgListRef.value.scrollHeight
}

onMounted(async () => {
  await nextTick()
  chatStore.curRooms = id.value as string
  updateScroll()
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
      cursor: pointer;
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
    overflow-x: hidden;
    overflow-y: auto;
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
        cursor: pointer;
        background-color: white;
      }
    }
  }
}
</style>
