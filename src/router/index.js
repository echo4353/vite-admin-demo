import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import layout from '@layout/index.vue'
import Case from './modules/Case.js'
/**
 * @description:私有路由表
 */
export const privateRoutes = [Case]

/**
 * @description: 公共路由表
 */
export const publicRoutes = [
  Case,
  {
    path: '/',
    component: layout,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: () => import('@/views/welcome/index.vue'),
        meta: {
          title: '欢迎页'
        }
      }
    ]
  },
  {
    path: '/:catchAll(.*)',
    name: '404',
    component: () => import('@/views/error-page/404.vue')
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes: publicRoutes
})
/**
 * 初始化路由表
 */
export function resetRouter() {
  if (store.getters.userInfo?.functionList) {
    const menus = store.getters.userInfo?.functionList
    menus.forEach((menu) => {
      router.removeRoute(menu)
    })
  }
  console.log('初始化路由')
}
export default router
