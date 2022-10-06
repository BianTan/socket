<template>
  <div class="message-item" @click="() => emit('click')">
    <DanImage :src="detail.img" fit="cover" round class="avatar" />
    <div class="info">
      <div class="name">{{ detail?.name || '消息标题' }}</div>
      <div class="msg">{{ lastMsg }}</div>
    </div>
    <div v-if="detail.count" class="count">{{ count }}</div>
  </div>
</template>

<script lang='ts' setup>
import { computed } from 'vue'
import { useChatStore, RoomItem } from '@/store/modules/chat'

const props = withDefaults(defineProps<{
  detail: RoomItem;
}>(), {})
const emit = defineEmits(['click'])
const chatStore = useChatStore()

const lastMsg = computed(() => {
  const list = chatStore.messageList[props.detail.id] || []
  return list[list.length - 1].msg || ' '
})

const count = computed(() => {
  const num = props.detail.count
  if (!num) return 0
  return Math.min(99, num)
})

</script>

<style lang='scss' scoped>
.message-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #E8E8E8;
  position: relative;
  .avatar {
    width: 52px;
    height: 52px;
  }
  .info {
    flex: 1;
    padding-left: 12px;
    .name {
      color: #333;
      font-size: 16px;
      line-height: 26px;
    }
    .msg {
      color: #999;
      font-size: 14px;
      line-height: 23px;
      white-space: break-spaces;
    }
  }
  .count {
    position: absolute;
    top: 6px;
    left: 8px;
    color: white;
    font-size: 16px;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    border-radius: 50%;
    background-color: red;
  }
  &:not(:last-child) {
    border-bottom: 1px solid white;
  }
}
</style>
