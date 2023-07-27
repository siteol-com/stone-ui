import axios from 'axios';
import { ref } from 'vue';

export type PlatResponse = {
  id: number; // 默认数据ID
  code: string; // 响应码 2/5+XXX+XXX
  serviceCode: string; // 业务ID，来源于字典，指定响应码归属业务
  type: string; // 响应类型，该字段用于筛选，可配置2和5
  zhCn: string; // 中文响应文言
  enUs: string; // 英文响应文言
  remark: string; // 其他备注信息
  mark: string; // 变更标识 0可变更 1禁止变更
  status: string; // 状态 0正常 1锁定 2封存
};

export function ResponseInit() {
  return ref<PlatResponse>({
    id: 0,
    code: '',
    serviceCode: '',
    type: '',
    zhCn: '',
    enUs: '',
    remark: '',
    mark: '',
    status: '',
  });
}

// 获取路由分页
export function responsePage(req: any) {
  return axios.post('/plat/response/page', req);
}

export function responseAdd(req: any) {
  return axios.post('/plat/response/add', req);
}

export function responseGet(id: number) {
  return axios.post('/plat/response/get', { id });
}

export function responseEdit(req: any) {
  return axios.post('/plat/response/edit', req);
}

export function responseDel(id: number) {
  return axios.post('/plat/response/del', { id });
}
