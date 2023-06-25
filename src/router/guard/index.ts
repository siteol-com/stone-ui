import type { Router } from 'vue-router';
import { setRouteEmitter } from '@/utils/route-listener';
import NProgress from 'nprogress'; // progress bar

import usePermission from '@/hooks/permission';
import { useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';
import { DEFAULT_ROUTE_NAME } from '../constants';

// 路由建传递路有变化信息
function setupPageGuard(router: Router) {
  router.beforeEach(async (to) => {
    // emit route change
    setRouteEmitter(to);
  });
}

// 验证账号是否登陆
function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    // 获取用户数据
    const userStore = useUserStore();
    // 如果已登陆
    if (isLogin()) {
      // 权限至少存在
      if (userStore.permissions && userStore.permissions[0]) {
        next();
      } else {
        // 无权限 退出登陆 然后跳到着陆页
        await userStore.logout();
        next({ name: 'index' });
      }
    } else {
      // 未登陆 允许访问免授权界面
      if (!to.meta.requiresAuth) {
        next();
        return;
      }
      // 其他情况，默认去往着陆页
      next({ name: 'index' });
    }
  });
}

// 验证路由权限
function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    // TODO 用户权限
    const Permission = usePermission();
    // 判断路由权限
    const permissionsAllow = Permission.accessRouter(to);

    // 权限满足进入下一步
    // eslint-disable-next-line no-lonely-if
    if (permissionsAllow) next();
    else {
      // 不满足返回默认路由（默认路由全账号默认分配）
      next(DEFAULT_ROUTE_NAME);
    }
    NProgress.done();
  });
}

// 创建路由处理中间件
export default function createRouteGuard(router: Router) {
  setupPageGuard(router); // 路由建传递路有变化信息
  setupUserLoginInfoGuard(router); // 验证是否登陆
  setupPermissionGuard(router); // 验证路由访问权限
}
