<template>
  <a-spin :loading="loading">
    <a-form label-align="left" layout="vertical" :model="formData">
      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-item field="level" :label="$t('plat.permission.level')">
            <span class="formSpan">{{ dictMap.permissionLevel[formData.level] }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="static" :label="$t('plat.permission.static')">
            <span class="formSpan">{{ dictMap.permissionType[formData.static] }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="name" :label="$t('plat.permission.name')">
            <span class="formSpan">{{ formData.name }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="alias" :label="$t('plat.permission.alias')">
            <span class="formSpan">{{ formData.alias }}</span>
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider orientation="left">{{ $t('plat.permission.routers') }}</a-divider>
      <!--表格，子页无需吸顶 -->
      <a-table
        :bordered="false"
        :scrollbar="false"
        :sticky-header="false"
        :row-key="'id'"
        :columns="RouterSelectColumns"
        :data="formData.routerList"
        :pagination="false"
        size="small"
        style="margin-top: 10px"
      >
        <template #serviceCode="{ record }"> {{ dictMap.serviceCode[record.serviceCode] }} </template>
      </a-table>
    </a-form>
  </a-spin>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import useLoading from '@/hooks/loading';
import { PopUp } from '@/hooks/popup';
import { useI18n } from 'vue-i18n';
import { permissionGet } from '@/api/plat/permission';

const { t } = useI18n();
// 路由列表对象
const RouterSelectColumns = computed(() => [
  { title: t('plat.serviceCode'), dataIndex: 'serviceCode', slotName: 'serviceCode' },
  { title: t('plat.router.name'), dataIndex: 'name' },
  { title: t('plat.router.url'), dataIndex: 'url' },
]);
// 加载中变量
const { loading, setLoading } = useLoading(true);
// 入参读取
const props = defineProps({
  dictMap: {
    type: Object,
    default: () => {
      return {
        serviceCode: {} as any,
        permissionLevel: {} as any,
        permissionType: {} as any,
      };
    },
  },
  id: {
    type: String,
    default: '',
  },
  popup: {
    type: Object,
    required: true,
    default: () => {
      return {} as PopUp;
    },
  },
});
// 查询数据
const formData = ref<any>({});
// 提交查询
async function getPermission() {
  try {
    const res = await permissionGet(Number(props.id));
    formData.value = res.data;
  } catch (err) {
    // DoNothing CommonPopUp
  } finally {
    setLoading(false);
  }
}

// 页面渲染
onMounted(() => {
  getPermission();
});
</script>
