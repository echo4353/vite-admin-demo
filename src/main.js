import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store/index.js'
import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
// 导入element-plus-icons
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 导入全局样式
import '@/styles/index.less'
// 导入svgIcon
import installIcons from '@/icons'
// 导入路由鉴权
import '@/permission.js'
// 权限指令
import installDirective from '@/directives/index.js'
// 封装queryform & baseTable
import Rocket from '@/globalComponents/commonTable'
// 统一上传组件
import KrUpload from '@/globalComponents/krUpload'
const app = createApp(App)
import 'virtual:svg-icons-register' // 引入注册脚本
installIcons(app)
installDirective(app)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app
  .use(store)
  .use(router)
  .use(ElementPlus, { locale, zIndex: 3000 })
  .use(Rocket)
  .use(KrUpload)
  .mount('#app')
