import layout from '@layout/index.vue'
export default {
  path: '/case',
  component: layout,
  redirect: '/case/list',
  auth: 'caseList',
  meta: {
    title: '案例管理',
    icon: 'personnel'
  },
  children: [
    {
      path: '/case/list',
      component: () => import('@/views/case/list.vue'),
      meta: {
        title: '案例列表',
        icon: 'el-icon-ElemeFilled'
      }
    },
    {
      path: '/case/mod',
      name: 'caseMod',
      component: () => import('@/views/case/mod.vue'),
      meta: {
        title: '案例编辑'
      }
    }
  ]
}
