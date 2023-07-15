import axios from 'axios';

export interface OpenTenantRes {
  name: string; // 租戶名称
  alias: string; // 租戶别名
  theme: string; // 租户模板
  logo: string; // 租户Logo
  icon: string; // 租户Icon
}

// 获取开放租户信息
export function openTenantGet(tenantAlias: string) {
  return axios.post<OpenTenantRes>('/open/tenant/get', { tenantAlias });
}
