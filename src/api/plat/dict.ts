import axios from 'axios';

// 获取字典List
export function dictList(req: any) {
  return axios.post('/plat/dict/list', req);
}

export function getDictPage(req: any) {}
