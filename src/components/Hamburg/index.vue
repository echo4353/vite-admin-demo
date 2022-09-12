<template>
  <div
    id="guide-hamburger"
    class="hamburger-container-inner"
    @click="toggleClick"
  >
    <SvgIcon class="hamburger" :icon="icon"></SvgIcon>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const toggleClick = () => {
  store.commit('app/triggerSidebarOpened')
}
const store = useStore()
const icon = computed(() => {
  return store.getters.sidebarOpened ? 'hamburger-opened' : 'hamburger-closed'
})
</script>

<style lang="less" scoped>
.hamburger-container-inner {
  padding: 0 16px;
  .humburger {
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 20px;
  }
}
</style>
