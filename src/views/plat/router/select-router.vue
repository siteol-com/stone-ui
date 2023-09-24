<template>
  <div>
    <a-form :model="query" label-align="left" layout="vertical">
      <a-row :gutter="20">
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
        <a-col :span="24" class="doBtn">
          <a-space>
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
    <!--表格，吸顶和滚动条不可同时使用 -->
    <a-table
      v-model:selectedKeys="selectedKeys"
      size="small"
      :bordered="false"
      :scrollbar="false"
      :sticky-header="false"
      :row-key="'id'"
      :loading="loading"
      :pagination="page"
      :columns="RouterSelectColumns"
      :data="list"
      :row-selection="{ type: 'checkbox' }"
      style="height: 410px"
      @page-change="changePage"
      @select="selectKeys"
    >
      <template #serviceCode="{ record }"> {{ dictMap.serviceCode[record.serviceCode] }} </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { Pagination } from '@/types/global';
import { useI18n } from 'vue-i18n';
import useLocale from '@/hooks/locale';
import { dictList } from '@/api/plat/dict';
import useLoading from '@/hooks/loading';
import { routerPage } from '@/api/plat/router';
// 加载中变量
const { loading, setLoading } = useLoading(true);
// 当前语言
const { currentLocale } = useLocale();
const { t } = useI18n();
// 路由列表对象
const RouterSelectColumns = computed(() => [
  { title: t('plat.serviceCode'), dataIndex: 'serviceCode', slotName: 'serviceCode' },
  { title: t('plat.router.name'), dataIndex: 'name' },
  { title: t('plat.router.url'), dataIndex: 'url' },
]);
// 入参读取
const props = defineProps({
  doSelect: {
    type: Function,
    required: true,
  },
  data: {
    type: Object,
    required: true,
    default: () => {
      return {};
    },
  },
});

// 选择对象
const selectedKeys = ref<any>([]);
const selectedItems = ref<any>([]);
// 去掉响应式
const { data } = props;
// 初始化赋值
selectedItems.value = data.selectedItems;
selectedKeys.value = data.selectedKeys;
// 选择事件
function selectKeys(keys: (string | number)[], thisKey: string | number, item: any) {
  if (keys.includes(thisKey)) {
    selectedItems.value.push(item);
  } else {
    selectedItems.value = selectedItems.value.filter((i: any) => {
      return i.id !== thisKey;
    });
  }
  // 传值给父级
  const cacheKeys: any[] = [];
  selectedItems.value.forEach((i: any) => {
    cacheKeys.push(i.id);
  });
  props.doSelect(selectedItems.value, cacheKeys);
}
// 初始化查询对象
const initQuery = () => {
  return {
    name: '',
    url: '',
    serviceCode: '',
    type: '1',
  };
};
// 查询对象
const query = ref(initQuery());
// 默认分页对象
const page: Pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: true,
});
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

// 初始化字典对象
const dict = ref({ serviceCode: [] });
const dictMap = ref({
  serviceCode: {} as any,
});
// 查询字典列表
async function getDictList() {
  // 指定字典Key
  await dictList({ groupKeys: ['serviceCode'] }).then((r) => {
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
