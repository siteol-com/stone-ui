import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import i18n from '@/locale';
import { useUserStore } from '@/store';
import { getToken } from '@/utils/auth';

// 定义响应结构体
export interface HttpResponse<T = unknown> {
  code: string; // 响应码
  msg: string; // 响应文言
  data: T; // 响应数据
}

// 绑定请求URL
if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}
// 超时时间（暂定100秒）
axios.defaults.timeout = 100000;
// 请求拦截器
axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 为请求携带登陆Token
    const token = getToken();
    const lang = localStorage.getItem('arco-locale');
    // 如果没有Header，初始化一个
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Token = `${token}`;
    // 提交语言
    config.headers.Lang = `${lang}`;
    return config;
  },
  (error) => {
    // do something
    // eslint-disable-next-line no-console
    console.log(error); // for debug
    return Promise.reject(error);
  }
);
// 响应拦截器
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    // 读取响应数据
    const res = response.data;
    // 后端所有响应均进行了翻译处理
    // 特定响应码的处理逻辑
    // 成功类型响应码 2 开头 如200 2001000 2999001
    if (res.code.indexOf('2') === 0) {
      Message.success(res.msg);
      return res;
    }
    // 尚未登陆，或没有权限，自动登出浏览器，前往登陆页
    if (res.code === '403' || res.code === '401') {
      // 接口无权限，提示刷新页面权限
      Modal.error({
        title: i18n.global.t('common.logout.tips'),
        content: res.msg, // 服务端翻译好的提示文言
        okText: i18n.global.t('common.sure'),
        async onOk() {
          // 登出处理
          const userStore = useUserStore();

          await userStore.logout();
          window.location.reload();
        },
      });
    } else {
      // 其他错误码均为业务错误码或500系统未知异常
      Message.error(res.msg);
    }
    return Promise.reject(new Error(res.msg || 'Error'));
  },
  (error) => {
    // 意料之外的异常，理论上后端全部响应200状态码
    Message.error({
      content: error.msg || 'Request Error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);
