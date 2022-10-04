<template>
  <div :class="['message', { 'is-me': isMe }]">
    <DanImage v-if="avatar || isMe" class="avatar" fit="cover" round />
    <div class="info">
      <div v-if="!isMe" class="name">我是笨蛋小扁担</div>
      <div class="msg-card">
        Esse incididunt occaecat mollit excepteur nostrud velit amet pariatur amet cupidatat. Nisi excepteur ullamco esse laboris sit amet dolore nisi labore nisi. Officia ut nisi nostrud aliquip labore aliquip enim reprehenderit exercitation pariatur. Ullamco quis sit irure aliqua quis ut officia exercitation aute cillum et est fugiat ullamco. Aliquip ea adipisicing fugiat ipsum enim fugiat ut aliquip. Eu Lorem voluptate nulla dolore aute esse minim sint esse sit ut. Dolore qui sit aute quis sunt commodo. Ex exercitation amet aliquip in eu laborum. Lorem commodo commodo velit ipsum ea. Tempor proident irure deserunt aliquip consequat eu elit esse id proident ad fugiat.
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>

withDefaults(defineProps<{
  isMe?: boolean;
  avatar?: boolean;
}>(), {
  isMe: false,
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
