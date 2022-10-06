<template>
  <div
    class="dan-image"
    :style="{ borderRadius }"
    @click="() => emit('click')"
  >
    <img
      v-if="src"
      :src="src"
      class="image"
      :style="{ objectFit: fit }"
    >
  </div>
</template>

<script lang='ts' setup>
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  src?: string;
  fit?: 'contain' | 'cover' | 'fill' | 'none';
  round?: boolean;
  radius?: number | string;
}>(), {
  fit: 'none'
})
const emit = defineEmits(['click'])

const borderRadius = computed(() => {
  const { round, radius } = props
  return round 
    ? '50%'
    : typeof radius === 'number' ? `${radius}px` : radius
})

</script>

<style lang='scss' scoped>
.dan-image {
  overflow: hidden;
  background-color: white;
  .image {
    width: 100%;
    height: 100%;
  }
}
</style>
