// 1.导入所有的svg图标
// 2.完成SvgIcon的全局注册
import SvgIcon from '@comps/SvgIcon/index.vue'

// const requireAll = function (requireContext) {
//   return Object.values(requireContext);
// };

// const req = import.meta.globEager("./svg/*.svg");

// requireAll(req)



// const svgRequire = require.context('./svg', false, /\.svg$/)
// svgRequire.keys().forEach((svgIcon) => svgRequire(svgIcon))

export default (app) => {
  app.component('SvgIcon', SvgIcon)
}
