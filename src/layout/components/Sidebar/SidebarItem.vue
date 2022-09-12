<template>
  <!-- 支持渲染多级 menu 菜单 -->
  <el-sub-menu
    v-if="route.childMenuList && route.childMenuList.length > 0"
    :index="route.url"
  >
    <template #title>
      <menu-item :title="route.name" :icon="route.icon"></menu-item>
    </template>
    <!-- 循环渲染 -->
    <sidebar-item
      v-for="item in route.childMenuList"
      :key="item.url"
      :route="item"
    ></sidebar-item>
  </el-sub-menu>
  <!-- 渲染 item 项 -->
  <el-menu-item v-else :index="route.url">
    <menu-item :title="route.name" :icon="route.icon"></menu-item>
  </el-menu-item>
</template>

<script setup>
import MenuItem from './MenuItem.vue'
// 定义 props
defineProps({
  route: {
    type: Object,
    required: true
  }
})
</script>

<style lang="less" scoped></style>
