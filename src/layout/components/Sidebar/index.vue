<template>
  <div>
    <div class="logo-container">
      <el-avatar fit="cover" style="border-radius: 50%" :src="homeIcon" />
      <h1 class="logo-title" v-if="$store.getters.sidebarOpened">vite-app</h1>
    </div>

    <el-scrollbar>
      <sidebar-menu></sidebar-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import SidebarMenu from './SidebarMenu.vue'
import homeIcon from '@/assets/logo.png'
const logoHeight = 50
</script>

<style lang="less" scoped>
.logo-container {
  box-sizing: border-box;
  height: v-bind(logoHeight) + 'px';
  padding-top: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  .logo-title {
    margin-left: 10px;
    color: #fff;
    font-weight: 600;
    line-height: 50px;
    font-size: 16px;
    white-space: nowrap;
  }
}
</style>
