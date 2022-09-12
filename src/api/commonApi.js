import request from '@/utils/request'
import { api } from '@/utils/config.js'
import { baseApi } from '@/constant'
/** 退出登录 */
export const logout = (data) =>
  request('get', '/baseApi/api/sys/user/logout', data)

/** 获取用户信息*/
export const getUserInfo = () => request('get', '/baseApi/api/sys/menu/init')

/**上传接口 */
export const uploadApi = (data) =>
  request('post', '/uploadApi/api/oss/upload', data, api.upload)

/**上传视频接口 */
export const uploadSignatureApi = (data) =>
  request('post', '/uploadApi/api/oss/signature', data, api.upload)

// 通用产品搜索
export const searchProductApi = (data) =>
  request('post', `${baseApi}tools/search/product`, data)

// 通用品牌搜索
export const searchPartner = (data) =>
  request('post', `${baseApi}tools/search/partner`, data)

// 产品操作日志
export const productOperateLogApi = (data) =>
  request('post', `${baseApi}/product/operateLog`, data)

// 案例操作日志
export const caseOperateLogApi = (data) =>
  request('post', `${baseApi}/case/operateLog`, data)
