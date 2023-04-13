import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';

// 验证账号是否登陆
export default function setupUserLoginInfoGuard(router: Router) {
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
