import request from '@/utils/request'
import { baseApi } from '@/constant'
// 列表
export const listApi = (data) =>
  request(
    'post',
    `${baseApi}settled/list
`,
    data
  )

//修改初始化
export const modInitApi = (data) =>
  request(
    'post',
    `${baseApi}settled/modInit
`,
    data
  )

//修改
export const modApi = (data) =>
  request(
    'post',
    `${baseApi}settled/mod
`,
    data
  )

//审核通过
export const passApi = (data) =>
  request(
    'post',
    `${baseApi}settled/pass
`,
    data
  )

//审核拒绝
export const rejectApi = (data) =>
  request(
    'post',
    `${baseApi}settled/pass
`,
    data
  )
