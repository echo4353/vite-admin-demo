<template>
  <el-menu
    mode="vertical"
    :collapse="!store.getters.sidebarOpened"
    :unique-opened="true"
    :default-active="activeMenu"
    class="el-menu-vertical-demo"
    :text-color="store.getters.cssVar.menutext"
    :background-color="store.getters.cssVar.menubg"
    :active-text-color="store.getters.cssVar.menuactivetext"
    router
  >
    <sidebar-item
      v-for="item in routes"
      :key="item.url"
      :route="item"
    ></sidebar-item>
  </el-menu>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { filterRoutes, generateMenus } from '@/utils/route'
import SidebarItem from './SidebarItem.vue'
import { useStore } from 'vuex'
const router = useRouter()
// const routes = computed(() => {
//   const filterRoutesList = filterRoutes(router.getRoutes())
//   return generateMenus(filterRoutesList)
// })
// 默认激活
const route = useRoute()
const activeMenu = computed(() => {
  const { path } = route
  return path
})
const store = useStore()
const routes = store.getters?.userInfo?.menuList
</script>

<style lang="less" scoped></style>
