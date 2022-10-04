<template>
  <div class="home-page">
    <div class="tips">消息列表</div>
    <div class="list">
      <MessageItem
        :detail="{
          name: '公共大厅',
          msg: '这里是消息记录'
        }"
        @click="() => onItemClick(1)"
      />
      <MessageItem
        v-for="i in 3"
        :key="i"
        @click="() => onItemClick(i)"
      />
    </div>
  </div>
</template>

<script lang='ts' setup>
import { useRouter } from 'vue-router'
import MessageItem from './components/MessageItem.vue'

const router = useRouter()

const onItemClick = (id: number) => {
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
