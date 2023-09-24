import { reactive } from 'vue';

// 权限树对象
export type TreeNode = {
  key: string;
  title: string;
  level: string;
  children?: TreeNode[];
  headTitle: string; // 定制字段
};

export function TreeNodeInit() {
  return reactive<TreeNode>({
    key: '',
    title: '',
    level: '',
    children: [],
    headTitle: '',
  });
}
