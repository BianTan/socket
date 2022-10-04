<template>
  <div class="main">
    <div class="views">
      <router-view class="page" />
    </div>
    <div class="tabs">
      <div class="tab active">
        <i class="iconfont icon-home" />
        <div class="text">消息</div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>

</script>

<style lang='scss' scoped>
.main {
  height: 100%;
  display: flex;
  flex-direction: column;
  .views {
    flex: 1;
    overflow: auto;
    .page {
      height: 100%;
    }
  }
  .tabs {
    flex-shrink: 0;
    display: flex;
    height: 56px;
    border-top: 1px solid #eee;
    user-select: none;
    .tab {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .iconfont {
        font-size: 20px;
        margin-bottom: 4px;
      }
      .text {
        color: #777;
        font-size: 12px;
      }
      &.active {
        .text {
          color: #333;
        }
      }
    }
  }
}
</style>
