import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store';

// 路由权限判定
export default function usePermission() {
  const userStore = useUserStore();
  return {
    accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
      const routerName = route.name ? route.name.toString() : '';
      // 无路由名或免授权返回成功
      if (routerName === '' || !route.meta?.requiresAuth) {
        return true;
      }
      // 授权情况
      return userStore.permissions.includes(routerName);
    },
  };
}
