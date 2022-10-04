<template>
  <div class="home-page">
    <div class="tips">消息列表</div>
    <div class="list">
      <MessageItem
        v-for="item in chatStore.rooms"
        :key="item.id"
        :detail="item"
        @click="() => onItemClick(item.id)"
      />
    </div>
  </div>
</template>

<script lang='ts' setup>
import { useRouter } from 'vue-router'
import { useChatStore } from '@/store/modules/chat'
import MessageItem from './components/MessageItem.vue'

const router = useRouter()
const chatStore = useChatStore()

const onItemClick = (id: string) => {
  const indexOf = chatStore.rooms.findIndex(f => f.id === id)
  chatStore.rooms[indexOf].count = 0
  router.push({
    name: 'Chat',
    params: {
      id
    }
  })
}

</script>

<style lang='scss' scoped>
.home-page {
  display: flex;
  flex-direction: column;
  background-color: #F8F8F8;
  .tips {
    color: #333;
    font-size: 16px;
    padding: 12px 18px;
    background-color: white;
  }
  .list {
    overflow-y: auto;
  }
}
</style>
