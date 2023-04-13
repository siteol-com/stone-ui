import type { Router } from 'vue-router';
import { setRouteEmitter } from '@/utils/route-listener';
import setupUserLoginInfoGuard from './userLoginInfo';
import setupPermissionGuard from './permission';

// 路由建传递路有变化信息
function setupPageGuard(router: Router) {
  router.beforeEach(async (to) => {
    // emit route change
    setRouteEmitter(to);
  });
}

export default function createRouteGuard(router: Router) {
  setupPageGuard(router); // 路由建传递路有变化信息
  setupUserLoginInfoGuard(router); // 验证是否登陆
  setupPermissionGuard(router); // 验证路由访问权限
}
