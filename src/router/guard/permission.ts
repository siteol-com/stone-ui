import type { Router, RouteRecordNormalized } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import usePermission from '@/hooks/permission';
import { useUserStore, useAppStore } from '@/store';
import appRoutes from '../routes';
import { WHITE_LIST, NOT_FOUND } from '../constants';

// 验证路由权限
export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    // 用户缓存
    const userStore = useUserStore();
    const Permission = usePermission();
    const permissionsAllow = Permission.accessRouter(to);

    // eslint-disable-next-line no-lonely-if
    if (permissionsAllow) next();
    else {
      const destination = Permission.findFirstPermissionRoute(appRoutes, userStore.role) || NOT_FOUND;
      next(destination);
    }
    NProgress.done();
  });
}
