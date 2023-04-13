import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

// 平台路由
const PLAT: AppRouteRecordRaw = {
  path: '/plat', // 平台管理
  name: 'plat', // 充当权限Alias
  component: DEFAULT_LAYOUT, // 布局
  meta: { locale: 'menu.user', icon: 'icon-user', requiresAuth: true }, // 国际化、图标、鉴权标识
  children: [
    {
      path: 'tenant', // 租户管理
      name: 'platTenant',
      component: () => import('@/views/plat/tenant/index.vue'),
      meta: { locale: 'menu.user.info', requiresAuth: true },
    },
  ],
};

export default PLAT;
