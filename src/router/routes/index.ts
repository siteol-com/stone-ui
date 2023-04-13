import type { RouteRecordNormalized } from 'vue-router';

// 读取子模块目录
const modules = import.meta.glob('./modules/*.ts', { eager: true });

// 组装子模块路由结构
function formatModules(_modules: any, result: RouteRecordNormalized[]) {
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key].default;
    if (!defaultModule) return;
    const moduleList = Array.isArray(defaultModule) ? [...defaultModule] : [defaultModule];
    result.push(...moduleList);
  });
  return result;
}

// 子模块路由
const appRoutes: RouteRecordNormalized[] = formatModules(modules, []);

export default appRoutes;
