import { createStore } from 'vuex'
import user from './modules/user.js'
import app from './modules/app.js'
import getters from './getters.js'
import permission from './modules/permission.js'
export default createStore({
  getters,
  modules: {
    user,
    permission,
    app,
  }
})
