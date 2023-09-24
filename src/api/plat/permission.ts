import axios from 'axios';
import { ref } from 'vue';

// 权限结构体
export type PlatPermission = {
  id: number; // 默认数据ID
  name: string; // 权限名称，界面展示，建议与界面导航一致
  alias: string; // 权限别名，英文+下划线，规范如下： sys  sys_account sys_account_add
  level: string; // 权限等级 1模块2页面3按钮
  pid: number; // 父级ID，默认为1
  static: string; //  默认启用权限，1 不启 2启用  启用后，该权限默认被分配，不可去勾
  routerIds: number[]; // 路由集，权限绑定的路由
  routerList: any[]; // 关联路由
  pName: string; // 父级权限名（前端赋予、后端查询）
};

// 初始化权限机构体
export function PermissionInit() {
  return ref<PlatPermission>({
    id: 0,
    name: '',
    alias: '',
    level: '',
    pid: 1,
    static: '',
    routerIds: [],
    routerList: [],
    pName: '',
  });
}

// 路由选择工具类
export function RouterAddUtils(formData: any) {
  // 路由添加层
  const routerAdd = ref(false);
  // 路由选择对象
  const selectData: any = ref({
    selectedKeys: [],
    selectedItems: [],
  });
  // 初始化选择对象
  function initAdd() {
    if (!formData.value.routerIds || formData.value.routerIds.length === 0) {
      formData.value.routerIds = [];
      formData.value.routerList = [];
    }
    // 重新赋值，消除响应性
    selectData.value = {
      selectedKeys: [],
      selectedItems: [],
    };
    formData.value.routerList.forEach((i: any) => {
      selectData.value.selectedItems.push(i);
      selectData.value.selectedKeys.push(i.id);
    });
  }
  // 打开选择画面
  function openAdd() {
    initAdd();
    routerAdd.value = true;
  }
  // 取消选择画面
  function cancelAdd() {
    initAdd();
    routerAdd.value = false;
  }
  // 确认选择画面
  function confirmAdd() {
    // 与内部选择组件进行双向同步
    formData.value.routerList = selectData.value.selectedItems;
    formData.value.routerIds = selectData.value.selectedKeys;
    return true;
  }
  // 子组件选择(传入方法)
  function doSelect(items: any[], keys: any[]) {
    selectData.value.selectedItems = items;
    selectData.value.selectedKeys = keys;
  }
  return {
    routerAdd,
    selectData,
    openAdd,
    cancelAdd,
    confirmAdd,
    doSelect,
  };
}

// 获取权限树
export function permissionTree(req: any) {
  return axios.post('/plat/permission/tree', req);
}

export function permissionAdd(req: any) {
  return axios.post('/plat/permission/add', req);
}

export function permissionGet(id: number) {
  return axios.post('/plat/permission/get', { id });
}

export function permissionEdit(req: any) {
  return axios.post('/plat/permission/edit', req);
}

export function permissionDel(id: number) {
  return axios.post('/plat/permission/del', { id });
}

export function permissionBro(id: number) {
  return axios.post('/plat/permission/bro', { id });
}

export function permissionSort(req: any) {
  return axios.post('/plat/permission/sort', req);
}
