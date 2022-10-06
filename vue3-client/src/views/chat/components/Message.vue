<template>
  <div :class="['message', { 'is-me': detail.isMe }]">
    <DanImage
      v-if="avatar || detail.isMe"
      :src="detail.avatar"
      class="avatar"
      fit="cover"
      round
      @click="() => emit('tap')"
    />
    <div class="info">
      <div v-if="!detail.isMe" class="name">
        <span :class="['state', { online: detail.connected }]" />
        {{ detail.nickname }}
      </div>
      <div v-text="detail.msg" class="msg-card" />
    </div>
  </div>
</template>

<script lang='ts' setup>

withDefaults(defineProps<{
  detail: {
    nickname: string;
    isMe: boolean;
    msg: string;
    uid: string;
    date: number;
    avatar: string;
    connected: boolean;
  };
  avatar?: boolean;
}>(), {
  avatar: true
})
const emit = defineEmits(['tap'])

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
    cursor: pointer;
  }
  .info {
    order: 2;
    padding: 0 12px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .name {
      color: #333;
      font-size: 12px;
      margin: 8px 0;
      display: flex;
      align-items: center;
      .state {
        width: 6px;
        height: 6px;
        margin-right: 6px;
        border-radius: 50%;
        background-color: #febc2e;
        &.online {
          background-color: #28c840;
        }
      }
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
      align-items: flex-end;
      .msg-card {
        margin-top: 12px;
        border-radius: 8px 0 8px 8px;
      }
    }
  }
  &:not(:last-child) {
    margin-bottom: 16px;
  }
}
</style>
