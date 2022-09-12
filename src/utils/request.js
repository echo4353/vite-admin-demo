import axios from 'axios'
import store from '@/store'
import { ElNotification } from 'element-plus'
import { api, url } from '@/utils/config.js'
const env = import.meta.env.VITE_APP_PROXY_URL
const service = axios.create({
  baseURL: api.base,
  timeout: 5000,
  withCredentials: true
})
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    if (env !== 'dev') {
      if (config.url.indexOf('/uploadApi') > -1) {
        config.url = config.url.replace('/uploadApi', '')
      }
      if (config.url.indexOf('/baseApi') > -1) {
        config.url = config.url.replace('/baseApi', '')
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { code, msg, data } = response.data
    // 需要判断当前请求是否成功
    if (code === 0) {
      // 成功返回解析后的数据
      return data
    } else if (code === 99) {
      //未登录，1s后自动跳转到统一登录页面
      ElNotification({
        title: 'Error',
        message: msg,
        type: 'error'
      })
      setTimeout(() => {
        window.location.href = `${url.sso}/login?fr=${url.fr}`
      }, 1000)
    } else {
      // 失败（请求成功、业务失败），消息提示
      ElNotification({
        title: 'Error',
        message: msg || '系统开小差了',
        type: 'error'
      })
      return Promise.reject(new Error(msg || '系统开小差了'))
    }
  },
  // 请求失败
  (error) => {
    ElNotification({
      title: 'Error',
      message: 'Server error',
      type: 'error'
    })
    return Promise.reject(error)
  }
)
function request(method, url, data = {}, baserequest) {
  let customparams = null
  if (method === 'get') {
    customparams = data
    data = null
  } else if (method === 'post' && !url.includes('oss/upload')) {
    data = {
      param: data,
      partner_id: 'dian-ping-web'
    }
  }
  return service({
    method,
    url,
    data,
    params: customparams,
    baseURL: baserequest
  })
}

export default request
