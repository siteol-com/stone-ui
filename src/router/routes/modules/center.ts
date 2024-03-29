import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

// 驾驶舱
const CENTER: AppRouteRecordRaw = {
  path: '/center', // 通用驾驶舱入口
  name: 'center', // 充当权限Alias
  component: DEFAULT_LAYOUT, // 布局
  redirect: '/center/index', // 定向至管理仓
  meta: { locale: 'menu.center', icon: 'icon-dashboard', order: 0, requiresAuth: false }, // 国际化、图标、鉴权标识，排序
  children: [
    {
      path: 'index', // 通用驾驶舱
      name: 'centerIndex',
      component: () => import('@/views/center/index.vue'),
      meta: { locale: 'menu.center.index', requiresAuth: false }, // 临时关闭授权
    },
  ],
};

export default CENTER;
