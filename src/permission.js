/*
 * @Author: gaominghao
 * @Date: 2022-08-08 18:03:12
 * @LastEditors: gaominghao
 * @LastEditTime: 2022-08-09 16:58:07
 * @Describe:
 */
import router from './router/index.js'
import store from './store/index.js'
// 引入NProgress
import NProgress from 'nprogress'
// 引入nprogress样式文件
import 'nprogress/nprogress.css'
import { setItem, getItem } from '@/utils/storage'
import { url } from '@/utils/config.js'
// 白名单
// const whiteList = []
const whiteList = ['/', '/welcome', '/case']

router.beforeEach(async (to, from, next) => {
  // 1.用户已登录，则不允许进入login
  // 2.用户未登录，只允许进入login
  NProgress.start()
  if (store.getters.token) {
    // 判断用户资料是否获取
    // 若不存在用户信息，则需要获取用户信息
    if (!store.getters.hasUserInfo) {
      // 触发获取用户信息的 action，并获取用户当前权限
      const data = await store.dispatch('user/getUserInfo')
      // 处理用户权限，筛选出需要添加的权限
      const filterRoutes = await store.dispatch(
        'permission/filterRoutes',
        data.functionList
      )

      // 利用 addRoute 循环添加
      filterRoutes.forEach((item) => {
        router.addRoute(item)
      })
      // 添加完动态路由之后，需要在进行一次主动跳转
      return next(to.fullPath)
    }
    next()
  } else {
    // 没有token的情况下，可以进入白名单
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      //跳转到统一登录界面
      // window.location.href = `${url.sso}/login?fr=${url.fr}`
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})
