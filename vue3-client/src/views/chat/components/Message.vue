<template>
  <div :class="['message', { 'is-me': detail.isMe }]">
    <DanImage
      v-if="avatar || detail.isMe"
      :src="detail.avatar"
      class="avatar"
      fit="cover"
      round
    />
    <div class="info">
      <div v-if="!detail.isMe" class="name">{{ detail.nickname }}</div>
      <div v-text="detail.msg" class="msg-card" />
    </div>
  </div>
</template>

<script lang='ts' setup>
import { MsgItem } from '@/store/modules/chat'

withDefaults(defineProps<{
  detail: MsgItem;
  avatar?: boolean;
}>(), {
  avatar: true
})

</script>

<style lang='scss' scoped>
.message {
  display: flex;
  align-items: flex-start;
  .avatar {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    order: 1;
  }
  .info {
    order: 2;
    padding: 0 12px;
    .name {
      color: #333;
      font-size: 12px;
      margin: 8px 0;
    }
    .msg-card {
      padding: 12px;
      max-width: 248px;
      font-size: 16px;
      border-radius: 0 8px 8px;
      background-color: white;
    }
  }
  &.is-me {
    justify-content: flex-end;
    .avatar {
      order: 2;
    }
    .info {
      order: 1;
      .msg-card {
        margin-top: 24px;
        border-radius: 8px 0 8px 8px;
      }
    }
  }
  &:not(:last-child) {
    margin-bottom: 16px;
  }
}
</style>
