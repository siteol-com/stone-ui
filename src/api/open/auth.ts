import axios from 'axios';

export interface AuthLoginReq {
  account: string;
  password: string;
  tenantAlias: string;
}

export interface AuthLoginRes {
  token: string;
}

// 账密授权登陆
export function authLogin(req: AuthLoginReq) {
  return axios.post<AuthLoginRes>('/open/auth/login', req);
}
