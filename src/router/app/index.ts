// App Routers
export default [
  {
    path: 'index',
    name: 'index',
    component: () => import('../../views/base/index.vue'),
    meta: {
      locale: 'base.index',
      needAuth: true,
      icon: 'icon-dashboard',
      permission: '*', // 默认全员可访问
    },
  },
]
