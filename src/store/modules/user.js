import { getUserInfo } from '@/api/commonApi'
import {
  getCookie,
  setItem,
  getItem,
  removeAllItem,
  removeSessionAllItem
} from '@/utils/storage'
import { TOKEN, USERNAME, USERINFO } from '@/constant'
import { url } from '@/utils/config.js'
export default {
  namespaced: true,
  state: () => ({
    token: getCookie(TOKEN) || '',
    userName: getCookie(USERNAME) || 'pitersu',
    userInfo: {}
  }),
  mutations: {
    setToken(state, token) {
      state.token = token
      setItem(TOKEN, token)
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
      setItem(USERINFO, userInfo)
    }
  },
  actions: {
    /**
     *
     * 获取用户信息
     */
    async getUserInfo(context) {
      const res = await getUserInfo()
      this.commit('user/setUserInfo', res)
      return res
    },
    // 退出登录
    async logout() {
      // alert('退出登录')
      // resetRouter()
      this.commit('user/setToken', '')
      this.commit('user/setUserInfo', {})
      removeAllItem()
      removeSessionAllItem()
      setItem('isFirstLogin', 1)
      window.location.href = `${url.sso}/login`
    }
  }
}
