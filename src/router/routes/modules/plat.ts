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
      path: 'tenant', // 租户
      name: 'PlatTenant',
      component: () => import('@/views/plat/tenant/index.vue'),
      meta: { locale: 'menu.plat.tenant', requiresAuth: false },
    },
    {
      path: 'dept', // 部门管理
      name: 'PlatDept',
      component: () => import('@/views/plat/dept/index.vue'),
      meta: { locale: 'menu.plat.dept', requiresAuth: false },
    },
    {
      path: 'role', // 角色管理
      name: 'PlatRole',
      component: () => import('@/views/plat/role/index.vue'),
      meta: { locale: 'menu.plat.role', requiresAuth: false },
    },
    {
      path: 'account', // 账号管理
      name: 'PlatAccount',
      component: () => import('@/views/plat/account/index.vue'),
      meta: { locale: 'menu.plat.account', requiresAuth: false },
    },
    {
      path: 'permission', // 权限 ↓ 超管可见
      name: 'PlatPermission',
      component: () => import('@/views/plat/permission/index.vue'),
      meta: { locale: 'menu.plat.permission', requiresAuth: false },
    },
    {
      path: 'router', // 路由
      name: 'PlatRouter',
      component: () => import('@/views/plat/router/index.vue'),
      meta: { locale: 'menu.plat.router', requiresAuth: false },
    },
    {
      path: 'response', // 响应码
      name: 'PlatResponse',
      component: () => import('@/views/plat/response/index.vue'),
      meta: { locale: 'menu.plat.response', requiresAuth: false },
    },
  ],
};

export default PLAT;
