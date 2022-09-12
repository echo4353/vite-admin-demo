// 专门处理权限路由的模块
import { publicRoutes, privateRoutes } from '@/router/index.js'
export default {
  namespaced: true,
  state: () => ({
    // 路由表：初始拥有静态路由权限
    routes:  []
    // routes: publicRoutes || []
  }),
  mutations: {
    /**
     * 增加路由
     */
    setRoutes(state, newRoutes) {
      state.routes = [...publicRoutes, ...newRoutes]
    }
  },
  actions: {
    /**
     * 根据权限数据筛选路由
     * @param {*} context
     * @param {*} menus 权限数据
     */
    filterRoutes(context, menus) {
      const routes = []
      // 路由权限匹配
      menus.forEach((key) => {
        // 权限名 与 路由的 auth 匹配
        routes.push(...privateRoutes.filter((item) => item.auth === key))
      })
      /**
       * 最后添加 不匹配路由进入 404
       * 所有不匹配的路由全部进入404
       * 该配置必须在所有路由指定之后
       */
      // routes.push({
      //   path: '/:catchAll(.*)',
      //   redirect: '/404'
      // })
      context.commit('setRoutes', routes)
      return routes
    }
  }
}
