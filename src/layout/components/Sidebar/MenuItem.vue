<template>
  <el-icon v-if="icon.includes('el-icon')" class="sub-el-icon" :class="icon">
    <component :is="iconName" />
  </el-icon>
  <svg-icon v-else :icon="iconName"></svg-icon>
  <span class="menu-item-text">{{ title }}</span>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
})
const iconName = computed(() => {
  if (props.icon.includes('el-icon')) {
    return props.icon.split('-')[2]
  } else {
    return `${props.icon}`
  }
})
</script>

<style lang="less" scoped>
@import '@/styles/variables.module.less';
.menu-item-text {
  color: @menuText;
}
</style>
