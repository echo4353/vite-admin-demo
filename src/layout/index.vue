<template>
  <div
    class="app-wrapper"
    :class="[$store.getters.sidebarOpened ? 'openSidebar' : 'hideSidebar']"
  >
    <!-- 左侧menu -->
    <sidebar
      id="guide-sidebar"
      class="sidebar-container"
      :style="{ backgroundColor: variables.menubg }"
    />
    <div class="main-container">
      <div class="fixed-header">
        <!-- 顶部 navbar -->
        <Navbar />
        <!-- tags -->
        <TagsView id="guide-tags" />
      </div>
      <!-- 内容区 -->
      <AppMain />
    </div>
  </div>
</template>

<script setup>
import AppMain from './components/AppMain.vue'
import Navbar from './components/Navbar.vue'
import sidebar from './components/Sidebar/index.vue'
import variables from '@/styles/variables.module.less'
import TagsView from '@comps/TagsView/index.vue'
</script>

<style lang="less" scoped>
@import '@/styles/mixin.less';
@import '@/styles/variables.module.less';
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
.fixed-header {
  transition: width @sideBarDuration
}

</style>
