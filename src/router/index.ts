import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';

import appRoutes from './routes';
import { REDIRECT_MAIN, ERROR_ROUTE } from './routes/base'; // 基础路由
import createRouteGuard from './guard';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

// 默认路由，免授权
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: 'index',
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('@/views/index/index.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/login/light/:tenantAlias', // 登录模板（light）轻量
      name: 'loginLight',
      component: () => import('@/views/login/index.vue'),
      meta: { requiresAuth: false },
    },
    ...appRoutes, // 加载子模块路由
    REDIRECT_MAIN, // 转向路由（拓展保留，暂未使用）
    ...ERROR_ROUTE, // 异常路由 403 - 404
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});
// 路由授权体
createRouteGuard(router);

export default router;
