<template>
  <div class="container" :class="{ 's-pop': popup.pop }">
    <a-card class="general-card s-list">
      <a-form :model="query" label-align="left" layout="vertical">
        <a-row :gutter="20">
          <a-col :span="8">
            <a-form-item field="code" :label="$t('plat.response.code')">
              <a-input v-model="query.code" allow-clear :placeholder="$t('plat.response.code.sc')" />
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
            <a-form-item field="responseType" :label="$t('plat.response.type')">
              <a-select
                v-model="query.responseType"
                :options="dict.responseType"
                allow-clear
                allow-search
                :placeholder="$t('common.select.all')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24" class="doBtn">
            <a-space>
              <a-tooltip :content="$t('common.button.create')" :mini="true">
                <a-button
                  type="primary"
                  status="danger"
                  @click="openPop('add', 0, $t('plat.response.add'), $t('plat.response.add.sub'))"
                >
                  <template #icon>
                    <icon-plus />
                  </template>
                </a-button>
              </a-tooltip>
              <a-tooltip :content="$t('common.button.search')" :mini="true">
                <a-button type="primary" @click="search">
                  <template #icon>
                    <icon-search />
                  </template>
                </a-button>
              </a-tooltip>
              <a-tooltip :content="$t('common.button.reset')" :mini="true">
                <a-button @click="resetQuery">
                  <template #icon>
                    <icon-refresh />
                  </template>
                </a-button>
              </a-tooltip>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
      <a-divider />
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
        <template #type="{ record }"> {{ dictMap.responseType[record.type] }} </template>
        <template #operations="{ record }">
          <a-space>
            <a-tooltip :content="$t('common.button.view')" :mini="true">
              <a-button
                type="text"
                size="small"
                @click="openPop('get', record.id, $t('plat.response.get'), record.code)"
              >
                <template #icon> <icon-eye /> </template>
              </a-button>
            </a-tooltip>
            <a-tooltip :content="$t('common.button.edit')" :mini="true">
              <a-button
                type="text"
                size="small"
                :disabled="record.mark === '1'"
                @click="openPop('edit', record.id, $t('plat.response.edit'), record.code)"
              >
                <template #icon> <icon-edit /> </template>
              </a-button>
            </a-tooltip>
            <a-tooltip :content="$t('common.button.delete')" :mini="true">
              <a-button type="text" size="small" :disabled="record.mark === '1'" @click="confirmDelete(record)">
                <template #icon> <icon-delete /> </template>
              </a-button>
            </a-tooltip>
          </a-space>
        </template>
      </a-table>
    </a-card>
    <a-card class="general-card s-item">
      <a-page-header :title="(popup.header as string)" :subtitle="(popup.subHeader as string)" @back="popup.closePop" />
      <add-response v-if="popup.add" :dict="dict" :popup="popup" :success="pageQuery" />
      <edit-response v-if="popup.edit" :dict="dict" :dict-map="dictMap" :popup="popup" :success="pageQuery" />
      <get-response v-if="popup.get" :dict-map="dictMap" :popup="popup" />
    </a-card>
    <!-- 刪除确认-->
    <a-modal v-model:visible="delItem.delConfirm" :title="$t('plat.response.del')" @before-ok="responseDelete">
      <div>{{ t('plat.response.del.tips') }}</div>
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
import { responsePage, responseDel } from '@/api/plat/response';
import AddResponse from './add-response.vue';
import GetResponse from './get-response.vue';
import EditResponse from './edit-response.vue';

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
    code: '',
    serviceCode: '',
    responseType: '',
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
  { title: t('plat.response.code'), dataIndex: 'code' },
  { title: t('plat.response.type'), dataIndex: 'type', slotName: 'type' },
  { title: t('plat.serviceCode'), dataIndex: 'serviceCode', slotName: 'serviceCode' },
  { title: t('plat.response.remark'), dataIndex: 'remark' },
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
    const res = await responsePage({ ...query.value, ...page });
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
async function responseDelete() {
  try {
    await responseDel(delItem.delId);
    pageQuery();
    return true;
  } catch (err) {
    return false;
  } finally {
    // Nothing
  }
}
// 初始化字典对象
const dict = ref({ serviceCode: [], responseType: [] });
const dictMap = ref({
  serviceCode: {} as any,
  responseType: {} as any,
});
// 查询字典列表
async function getDictList() {
  // 指定字典Key
  await dictList({ groupKeys: ['serviceCode', 'responseType'] }).then((r) => {
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

<script lang="ts">
export default {
  name: 'PlatResponse',
};
</script>
