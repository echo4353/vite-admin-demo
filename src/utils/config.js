// 环境变量(dev test production)
const env = import.meta.env.VITE_APP_PROXY_URL
// 回跳地址
const fr = encodeURIComponent(window.location.href)
// 地址配置
const api = {}
const url = {}
if (env === 'dev') {
  api.base = '/'
  api.upload = '/'
  url.fr = fr
  url.sso = 'https://sso-test.36dianping.com' // 统一登录（权限系统）
} else if (env === 'test') {
  api.base = 'https://qps-test.36dianping.com'
  api.upload = 'https://assist-test.36dianping.com'
  url.fr = fr
  url.sso = 'https://sso-test.36dianping.com'
} else if (env === 'production') {
  api.base = 'https://qps.36dianping.com'
  api.upload = 'https://assist.36dianping.com'
  url.fr = fr
  url.sso = 'https://sso.36dianping.com'
}

export { api, url }
