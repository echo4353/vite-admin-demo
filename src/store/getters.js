import variables from '@/styles/variables.module.less'
// 快捷访问
const getters = {
  token: (state) => state.user.token,
  /** true表示用户信息已存在 */
  hasUserInfo: (state) => {
    return JSON.stringify(state.user.userInfo) !== '{}'
  },
  userInfo: (state) => state.user.userInfo,
  userName: (state) => state.user.userName,
  cssVar: (state) => variables,
  sidebarOpened: (state) => state.app.sidebarOpened,
  mainColor: (state) => state.them.mainColor,
  tagsViewList: (state) => state.app.tagsViewList
}
export default getters
