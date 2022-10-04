<template>
  <div
    class="footer-action"
    :style="{ height: `${height}px` }"
  >
    <div
      class="action"
      :style="{
        background: bgColor,
        height: `${height}px`,
        zIndex
      }"
    >
      <slot />
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useCurDevice } from '@/hooks/useCurDevice'

withDefaults(defineProps<{
  bgColor?: string;
  zIndex?: number;
}>(), {
  bgColor: 'white',
  zIndex: 5
})

const { isIOS } = useCurDevice()
const { width: winWidth } = useWindowSize()

const height = computed(() => {
  const number = isIOS.value ? 80 : 72
  return winWidth.value * number / 375
})

</script>

<style lang='scss' scoped>
.footer-action {
  width: 100%;
  flex-shrink: 0;
  .action {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
    padding: 8px 16px 0;
    box-sizing: border-box;
  }
}
</style>
