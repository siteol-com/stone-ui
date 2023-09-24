<template>
  <div class="container" :class="{ 'tree-pop': popup.pop }">
    <div class="treeE">
      <div class="treeL">
        <a-input-search
          v-model="treeSearch"
          :placeholder="$t('plat.permission.name.sc')"
          allow-clear
          style="margin: 4px 0 10px 0"
          @press-enter="treeFilter"
          @search="treeFilter"
          @clear="treeFilter"
        />
        <a-spin :loading="loading" class="treeLe">
          <a-tree v-if="list[0]" v-model:selected-keys="treeSelect" :data="list" :show-line="true" @select="onSelect" />
        </a-spin>
      </div>
      <div class="treeR">
        <a-page-header
          :title="treeNode.headTitle || $t('plat.permission.tree')"
          :subtitle="treeNode.title || $t('plat.permission.tree.tips')"
          :show-back="false"
        />
        <!-- 树操作按钮 -->
        <index-button
          :tree-node="treeNode"
          :tree-query="treeQuery"
          :open-pop="openPop"
          :open-pop-with-obj="openPopWithObj"
        />
        <!-- 查询区域 -->
        <a-row :gutter="20">
          <!-- 选择前样式 -->
          <div v-if="treeSelect.length == 0" class="joinPath">
            <icon-left-circle :size="36" style="margin-right: 10px" /> {{ $t('plat.permission.tree.tips') }}
          </div>
          <a-col v-else :span="24">
            <get-permission v-if="treeNode.key" :id="treeNode.key" :dict-map="dictMap" />
          </a-col>
        </a-row>
      </div>
      <!-- 创建/修改操作区 -->
      <div class="treeRe">
        <a-page-header
          :title="(popup.header as string)"
          :subtitle="(popup.subHeader as string)"
          @back="popup.closePop"
        />
        <add-permission v-if="popup.add" :dict="dict" :dict-map="dictMap" :popup="popup" :success="treeQuery" />
        <edit-permission v-if="popup.edit" :dict="dict" :dict-map="dictMap" :popup="popup" :success="treeQuery" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { dictList } from '@/api/plat/dict';
import useLoading from '@/hooks/loading';
import usePopup from '@/hooks/popup';
import useLocale from '@/hooks/locale';
import { TreeNode, TreeNodeInit } from '@/api/plat/comm';
import { permissionTree } from '@/api/plat/permission';
import { useI18n } from 'vue-i18n';
import GetPermission from './get-permission.vue';
import AddPermission from './add-permission.vue';
import EditPermission from './edit-permission.vue';
import IndexButton from './index-button.vue';

const { t } = useI18n();
// 加载中变量
const { loading, setLoading } = useLoading(true);
// 弹层处理
const { popup, openPop, openPopWithObj } = usePopup();
// 当前语言
const { currentLocale } = useLocale();
// 列表对象
const origList = ref<TreeNode[]>([]);
const list = ref<TreeNode[]>([]);
// 树检索
const treeSearch = ref('');
// 执行树搜索
function treeFilter() {
  // 无检索
  if (treeSearch.value === '') {
    list.value = origList.value;
  }
  // 递归检索
  const loop = (data: TreeNode[]) => {
    const result: TreeNode[] = [];
    data.forEach((item: TreeNode) => {
      if (item.title.toLowerCase().indexOf(treeSearch.value.toLowerCase()) > -1) {
        result.push({ ...item });
      } else if (item.children) {
        const filterData = loop(item.children);
        if (filterData.length) {
          result.push({
            ...item,
            children: filterData,
          });
        }
      }
    });
    return result;
  };
  list.value = loop(origList.value);
}
// 树选择对象
const treeSelect = ref<any>([]);
// 树节点对象
const treeNode = TreeNodeInit();
// 刷新选择
async function refreshSelect(keyObj: any) {
  treeNode.key = '';
  // 控制查询重新初始化
  await nextTick();
  treeNode.key = keyObj.key;
  treeNode.title = keyObj.title;
  treeNode.level = keyObj.level;
  treeNode.headTitle = t('plat.permission.get');
}
// 树选择
function onSelect(keys: any[], event: any) {
  treeSelect.value = keys;
  const { node } = event;
  refreshSelect(node);
}
// 权限树查询
async function treeQuery(clean: boolean) {
  if (clean) {
    treeNode.key = '';
    treeNode.title = '';
    treeNode.level = '';
    treeNode.headTitle = '';
    treeSelect.value = [];
  }
  setLoading(true);
  try {
    // 路由分页
    const res = await permissionTree({});
    origList.value = res.data;
    list.value = res.data;
    // 树过滤保留
    treeFilter();
    // 如果树有所选择，则进行刷新
    if (treeNode.key !== '') {
      refreshSelect({
        key: treeNode.key,
        title: treeNode.title,
        level: treeNode.level,
      });
    }
  } catch (e) {
    // 清空数据
    origList.value = [];
    list.value = [];
  } finally {
    setLoading(false);
  }
}
// 初始化字典对象
const dict = ref({ serviceCode: [] });
const dictMap = ref({
  serviceCode: {} as any,
  permissionLevel: {} as any,
  permissionType: {} as any,
});
// 查询字典列表
async function getDictList() {
  // 指定字典Key
  await dictList({ groupKeys: ['serviceCode', 'permissionLevel', 'permissionType'] }).then((r) => {
    dict.value = r.data.list;
    dictMap.value = r.data.map;
  });
}
function init() {
  // 初始化后端字典对象
  getDictList();
  // 初始化树查询
  treeQuery(false);
}
// 页面渲染
onMounted(() => {
  init();
});
// 语言监听
watch(currentLocale, (n, o) => {
  if (n !== o) {
    init();
  }
});
</script>

<script lang="ts">
export default {
  name: 'PlatPermission',
};
</script>
