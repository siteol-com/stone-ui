import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

// 驾驶舱
const CENTER: AppRouteRecordRaw = {
  path: '/center', // 通用驾驶舱入口
  name: 'center', // 充当权限Alias
  component: DEFAULT_LAYOUT, // 布局
  redirect: '/center/index', // 定向至管理仓
  meta: { locale: 'common.menu.center', icon: 'icon-home', order: 0, requiresAuth: false }, // 国际化、图标、鉴权标识，排序
  children: [
    {
      path: 'index', // 租户管理
      name: 'centerIndex',
      component: () => import('@/views/center/index.vue'),
      meta: { locale: 'common.menu.center.index', requiresAuth: true },
    },
  ],
};

export default CENTER;
