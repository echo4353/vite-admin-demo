import request from '@/utils/request'

/**
 *  获取列表demo数据
 */
export const getDemoList = (data) =>
  request('post', '/baseApi/api/demo/list', data)
// 新增
export const addDemo = (data) => request('post', '/baseApi/api/demo/add', data)
