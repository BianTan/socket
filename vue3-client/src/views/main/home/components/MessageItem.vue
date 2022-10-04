<template>
  <div class="message-item" @click="() => emit('click')">
    <DanImage src="" fit="cover" round class="avatar" />
    <div class="info">
      <div class="name">{{ detail?.name || '消息标题' }}</div>
      <div class="msg">{{ detail?.msg || '消息标题' }}</div>
    </div>
  </div>
</template>

<script lang='ts' setup>

withDefaults(defineProps<{
  detail?: any;
}>(), {})
const emit = defineEmits(['click'])

</script>

<style lang='scss' scoped>
.message-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #E8E8E8;
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
    }
  }
  &:not(:last-child) {
    border-bottom: 1px solid white;
  }
}
</style>
