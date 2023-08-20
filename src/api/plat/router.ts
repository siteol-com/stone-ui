import axios from 'axios';
import { ref } from 'vue';

export type PlatRouter = {
  id: number; // 默认数据ID
  name: string; // 路由名称，用于界面展示，与权限关联
  url: string; // 路由地址，后端访问URL 后端不再URL中携带参数，统一Post处理内容
  serviceCode: string; // 业务编码（字典），为接口分组
  type: string; // 免授权路由 1 授权 2 免授权（系统启动开放免授权）
  printReq: string; // 请求日志打印 1 不打印 2 打印
  printRes: string; // 响应日志打印 1 不打印 2 打印
};
export function routerInit() {
  return ref<PlatRouter>({
    id: 0,
    name: '',
    url: '',
    serviceCode: '',
    type: '',
    printReq: '',
    printRes: '',
  });
}

// 获取路由分页
export function routerPage(req: any) {
  return axios.post('/plat/router/page', req);
}

export function routerAdd(req: any) {
  return axios.post('/plat/router/add', req);
}

export function routerGet(id: number) {
  return axios.post('/plat/router/get', { id });
}

export function routerEdit(req: any) {
  return axios.post('/plat/router/edit', req);
}

export function routerDel(id: number) {
  return axios.post('/plat/router/del', { id });
}
