<template>
  <a-col :span="24" class="doBtn treeBtn">
    <a-space>
      <a-tooltip :content="$t('common.button.refresh')" :mini="true">
        <a-button @click="treeQuery(false)">
          <template #icon>
            <icon-sync />
          </template>
        </a-button>
      </a-tooltip>
      <!-- 创建子集，3层不可 -->
      <a-tooltip :content="$t('plat.permission.add.sub')" :mini="true">
        <a-button
          :disabled="!treeNode.level || treeNode.level == '3'"
          type="primary"
          status="danger"
          @click="openPopWithObj('add', 0, $t('plat.permission.add'), $t('plat.permission.add.sub'), treeNode)"
        >
          <template #icon>
            <icon-plus />
          </template>
        </a-button>
      </a-tooltip>
      <!-- 编辑，根节点不可 -->
      <a-tooltip :content="$t('plat.permission.edit')" :mini="true">
        <a-button
          :disabled="!treeNode.level || treeNode.key == '1'"
          type="primary"
          status="warning"
          @click="openPop('edit', Number(treeNode.key), $t('plat.permission.edit'), treeNode.title)"
        >
          <template #icon>
            <icon-edit />
          </template>
        </a-button>
      </a-tooltip>
      <!-- 同级排序 -->
      <a-tooltip :content="$t('plat.permission.sort')" :mini="true">
        <a-button :disabled="!treeNode.level || treeNode.key == '1'" type="primary" @click="confirmSort(treeNode)">
          <template #icon>
            <icon-sort-ascending />
          </template>
        </a-button>
      </a-tooltip>
      <!-- 删除，根节点不可 -->
      <a-tooltip :content="$t('plat.permission.del')" :mini="true">
        <a-button :disabled="!treeNode.level || treeNode.key == '1'" @click="confirmDelete(treeNode)">
          <template #icon>
            <icon-delete />
          </template>
        </a-button>
      </a-tooltip>
    </a-space>
  </a-col>
  <!-- 刪除确认-->
  <a-modal v-model:visible="delItem.delConfirm" :title="$t('plat.permission.del')" @before-ok="permissionDelete">
    <div>{{ $t('plat.permission.del.tips') }}</div>
  </a-modal>
  <!-- 排序确认-->
  <a-modal
    v-model:visible="sortItem.sortConfirm"
    :width="340"
    :title="$t('plat.permission.sort')"
    @before-ok="permissionSorting"
  >
    <a-spin :loading="loading" class="sortList">
      <a-table
        :columns="columns"
        :data="sortList"
        :draggable="{ type: 'handle', width: 40 }"
        :pagination="false"
        :show-header="false"
        @change="sortChange"
      />
    </a-spin>
  </a-modal>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue';
import { permissionDel, permissionBro, permissionSort } from '@/api/plat/permission';
import { useI18n } from 'vue-i18n';
import useLoading from '@/hooks/loading';
// 加载中变量
const { loading, setLoading } = useLoading(false);

const { t } = useI18n();
// 路由列表对象
const columns = computed(() => [{ title: t('plat.permission.name'), dataIndex: 'name' }]);
// 入参读取
const props = defineProps({
  treeNode: {
    type: Object,
    required: true,
    default: () => {
      return {};
    },
  },
  treeQuery: {
    type: Function,
    required: true,
  },
  openPop: {
    type: Function,
    required: true,
  },
  openPopWithObj: {
    type: Function,
    required: true,
  },
});
// 删除对象
const delItem = reactive({
  delConfirm: false,
  delId: 0,
});
// 确认删除
function confirmDelete(item: any) {
  delItem.delId = Number(item.key);
  delItem.delConfirm = true;
}
// 权限删除
async function permissionDelete() {
  try {
    await permissionDel(delItem.delId);
    props.treeQuery(true);
    return true;
  } catch (err) {
    return false;
  } finally {
    // Nothing
  }
}
// 排序对象
const sortList = ref([]);
const sortItem = reactive({
  sortConfirm: false,
  sortId: 0,
});
// 查询排序列表
async function getBroList() {
  setLoading(true);
  try {
    const res = await permissionBro(sortItem.sortId);
    sortList.value = res.data;
  } catch (err) {
    // DoNothing CommonPopUp
  } finally {
    setLoading(false);
  }
}
// 确认排序
function confirmSort(item: any) {
  sortItem.sortId = Number(item.key);
  sortItem.sortConfirm = true;
  // 查询排序列表
  getBroList();
}
// 排序更新
function sortChange(data: any) {
  sortList.value = data;
}
// 提交排序
async function permissionSorting() {
  setLoading(true);
  try {
    const sortObj: any[] = [];
    sortList.value.forEach((item: any, i) => {
      sortObj.push({
        id: item.id,
        sort: i,
      });
    });
    const res = await permissionSort(sortObj);
    if (res.data) {
      props.treeQuery(false);
    }
  } catch (err) {
    // DoNothing CommonPopUp
  } finally {
    setLoading(false);
  }
}
</script>
