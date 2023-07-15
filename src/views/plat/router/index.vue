<template>
  <div class="container" :class="{ 's-pop': popup.pop }">
    <a-card class="general-card s-list">
      <a-row>
        <a-col :flex="1">
          <a-form :model="query" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="name" :label="$t('plat.router.name')">
                  <a-input v-model="query.name" allow-clear :placeholder="$t('plat.router.name.sc')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="url" :label="$t('plat.router.url')">
                  <a-input v-model="query.url" allow-clear :placeholder="$t('plat.router.url.sc')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="serviceCode" :label="$t('plat.serviceCode')">
                  <a-select
                    v-model="query.serviceCode"
                    :options="dict.serviceCode"
                    allow-clear
                    allow-search
                    :placeholder="$t('common.select.all')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="routerType" :label="$t('plat.router.type')">
                  <a-select
                    v-model="query.type"
                    :options="dict.routerType"
                    allow-clear
                    allow-search
                    :placeholder="$t('common.select.all')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="16" style="display: flex; align-items: center; justify-content: end">
                <a-space>
                  <a-button type="primary" @click="search">
                    <template #icon>
                      <icon-search />
                    </template>
                    {{ $t('common.button.search') }}
                  </a-button>
                  <a-button @click="resetQuery">
                    <template #icon>
                      <icon-refresh />
                    </template>
                    {{ $t('common.button.reset') }}
                  </a-button>
                </a-space>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-col :span="24">
          <a-space>
            <a-button
              type="primary"
              status="danger"
              @click="openPop('add', 0, $t('plat.router.add'), $t('plat.router.add.sub'))"
            >
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('common.button.create') }}
            </a-button>
          </a-space>
        </a-col>
        <a-divider />
      </a-row>
      <!--表格，吸顶和滚动条不可同时使用 -->
      <a-table
        :bordered="false"
        :scrollbar="false"
        :sticky-header="true"
        :row-key="'id'"
        :loading="loading"
        :pagination="page"
        :columns="columns"
        :data="list"
        @page-change="changePage"
      >
        <template #serviceCode="{ record }"> {{ dictMap.serviceCode[record.serviceCode] }} </template>
        <template #type="{ record }"> {{ dictMap.routerType[record.type] }} </template>
        <template #operations="{ record }">
          <a-space>
            <a-tooltip :content="$t('common.button.view')" :mini="true">
              <a-button type="text" size="small" @click="openPop('get', record.id, $t('plat.router.get'), record.name)">
                <template #icon> <icon-eye /> </template>
              </a-button>
            </a-tooltip>
            <a-tooltip :content="$t('common.button.edit')" :mini="true">
              <a-button
                type="text"
                size="small"
                @click="openPop('edit', record.id, $t('plat.router.edit'), record.name)"
              >
                <template #icon> <icon-edit /> </template>
              </a-button>
            </a-tooltip>
            <a-tooltip :content="$t('common.button.delete')" :mini="true">
              <a-button type="text" size="small" @click="confirmDelete(record)">
                <template #icon> <icon-delete /> </template>
              </a-button>
            </a-tooltip>
          </a-space>
        </template>
      </a-table>
    </a-card>
    <a-card class="general-card s-item">
      <a-page-header :title="(popup.header as string)" :subtitle="(popup.subHeader as string)" @back="popup.closePop" />
      <add-router v-if="popup.add" :dict="dict" :popup="popup" :success="pageQuery" />
      <edit-router v-if="popup.edit" :dict="dict" :popup="popup" :success="pageQuery" />
      <get-router v-if="popup.get" :dict-map="dictMap" :popup="popup" />
    </a-card>
    <!-- 刪除确认-->
    <a-modal v-model:visible="delItem.delConfirm" :title="t('plat.router.del')" :on-before-ok="routerDelete">
      <div>{{ t('plat.router.del.tips') }}</div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { Pagination } from '@/types/global';
import { useI18n } from 'vue-i18n';
import { dictList } from '@/api/plat/dict';
import useLoading from '@/hooks/loading';
import usePopup from '@/hooks/popup';
import useLocale from '@/hooks/locale';
import { routerPage, routerDel } from '@/api/plat/router';
import { Modal } from '@arco-design/web-vue';
import AddRouter from './add-router.vue';
import GetRouter from './get-router.vue';
import EditRouter from './edit-router.vue';

// 加载中变量
const { loading, setLoading } = useLoading(true);
// 弹层处理
const { popup, openPop } = usePopup();
// 当前语言
const { currentLocale } = useLocale();
const { t } = useI18n();
// 初始化查询对象
const initQuery = () => {
  return {
    name: '',
    url: '',
    serviceCode: '',
    type: '',
  };
};
// 查询对象
const query = ref(initQuery());
// 默认分页对象
const page: Pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 100,
  showTotal: true,
});
// 表格表头和数据指定
const columns = computed(() => [
  { title: t('plat.router.name'), dataIndex: 'name' },
  { title: t('plat.router.url'), dataIndex: 'url' },
  { title: t('plat.serviceCode'), dataIndex: 'serviceCode', slotName: 'serviceCode' },
  { title: t('plat.router.type'), dataIndex: 'type', slotName: 'type' },
  { title: t('common.table.oper'), slotName: 'operations', width: 130 },
]);
// 列表对象
const list = ref([]);
// 重置查询
function resetQuery() {
  query.value = initQuery();
  page.current = 1;
  page.total = 0;
  list.value = [];
}
// 分页检索
async function pageQuery() {
  setLoading(true);
  try {
    // 路由分页
    const res = await routerPage({ ...query.value, ...page });
    list.value = res.data.list;
    page.total = res.data.total;
  } catch (e) {
    // 清空数据
    list.value = [];
    page.current = 1;
    page.total = 0;
  } finally {
    setLoading(false);
  }
}
// 搜索方法
function search() {
  page.current = 1;
  pageQuery();
}
// 切换分页
function changePage(current: number) {
  page.current = current;
  pageQuery();
}
const delItem = reactive({
  delConfirm: false,
  delId: 0,
});
// 确认删除
function confirmDelete(item: any) {
  delItem.delId = item.id;
  delItem.delConfirm = true;
}
// 路由删除
async function routerDelete() {
  try {
    await routerDel(delItem.delId);
    pageQuery();
    return true;
  } catch (err) {
    return false;
  } finally {
    // Nothing
  }
}
// 初始化字典对象
const dict = ref({ serviceCode: [], routerType: [] });
const dictMap = ref({
  serviceCode: {} as any,
  routerType: {} as any,
});
// 查询字典列表
async function getDictList() {
  // 指定字典Key
  await dictList({ groupKeys: ['serviceCode', 'routerType'] }).then((r) => {
    dict.value = r.data.list;
    dictMap.value = r.data.map;
  });
}
function init() {
  // 初始化后端字典对象
  getDictList();
  // 初始化搜索
  pageQuery();
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
