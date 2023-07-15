import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

// 平台路由
const PLAT: AppRouteRecordRaw = {
  path: '/plat', // 平台管理
  name: 'plat', // 充当权限Alias
  component: DEFAULT_LAYOUT, // 布局
  meta: { locale: 'menu.plat', icon: 'icon-settings', requiresAuth: false }, // 国际化、图标、鉴权标识
  children: [
    {
      path: 'role', // 角色管理
      name: 'platRole',
      component: () => import('@/views/plat/role/index.vue'),
      meta: { locale: 'menu.plat.role', requiresAuth: false },
    },
    {
      path: 'dept', // 部门管理
      name: 'platDept',
      component: () => import('@/views/plat/dept/index.vue'),
      meta: { locale: 'menu.plat.dept', requiresAuth: false },
    },
    {
      path: 'account', // 账号管理
      name: 'platAccount',
      component: () => import('@/views/plat/account/index.vue'),
      meta: { locale: 'menu.plat.account', requiresAuth: false },
    },
    {
      path: 'tenant', // 租户
      name: 'platTenant',
      component: () => import('@/views/plat/tenant/index.vue'),
      meta: { locale: 'menu.plat.tenant', requiresAuth: false },
    },
    {
      path: 'permission', // 权限
      name: 'platPermission',
      component: () => import('@/views/plat/permission/index.vue'),
      meta: { locale: 'menu.plat.permission', requiresAuth: false },
    },
    {
      path: 'router', // 路由
      name: 'platRouter',
      component: () => import('@/views/plat/router/index.vue'),
      meta: { locale: 'menu.plat.router', requiresAuth: false },
    },
    {
      path: 'responseCode', // 响应码
      name: 'platResponseCode',
      component: () => import('@/views/plat/responseCode/index.vue'),
      meta: { locale: 'menu.plat.responseCode', requiresAuth: false },
    },
  ],
};

export default PLAT;
