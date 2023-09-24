<template>
  <a-form ref="permissionEdit" label-align="left" layout="vertical" :model="formData" @submit="handleSubmit">
    <a-row :gutter="20">
      <a-col :span="12">
        <a-form-item field="level" :label="$t('plat.permission.level')">
          <template #extra>
            <div>{{ $t('plat.permission.level.tips') }}</div>
          </template>
          <span class="formSpan">{{ dictMap.permissionLevel[formData.level] }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          field="static"
          :label="$t('plat.permission.static')"
          :rules="[{ required: true, message: $t('common.rule.required') }]"
        >
          <template #extra>
            <div>{{ $t('plat.permission.static.tips') }}</div>
          </template>
          <span class="formSpan">{{ dictMap.permissionType[formData.static] }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          field="name"
          :label="$t('plat.permission.name')"
          :rules="[{ required: true, message: $t('common.rule.required') }]"
        >
          <a-input
            v-model="formData.name"
            :max-length="32"
            allow-clear
            show-word-limit
            :placeholder="$t('plat.permission.name.place')"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          field="alias"
          :label="$t('plat.permission.alias')"
          :rules="[
            { required: true, message: $t('common.rule.required') },
            {
              match: /^[a-zA-Z_]*$/,
              message: $t('plat.permission.alias.format'),
            },
          ]"
        >
          <a-input
            v-model="formData.alias"
            :max-length="32"
            allow-clear
            show-word-limit
            :placeholder="$t('plat.permission.alias.place')"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-divider orientation="left">
      <a-tooltip :content="$t('plat.permission.routers.tips')" :mini="true">
        <a-button type="primary" status="danger" shape="circle" size="small" @click="openAdd">
          <template #icon>
            <icon-edit />
          </template>
        </a-button>
      </a-tooltip>
      {{ $t('plat.permission.routers') }}
    </a-divider>
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
    <div class="formbtn formBtnLine">
      <a-space>
        <a-button type="primary" html-type="submit" :loading="loading">
          <template #icon>
            <icon-check />
          </template>
          {{ $t('common.button.submit') }}
        </a-button>
      </a-space>
    </div>
  </a-form>
  <a-modal
    v-model:visible="routerAdd"
    :hide-title="true"
    :width="900"
    :on-before-ok="confirmAdd"
    :on-before-cancell="cancelAdd"
  >
    <select-router v-if="routerAdd" :do-select="doSelect" :data="selectData" />
  </a-modal>
</template>

<script lang="ts" setup>
import { onMounted, computed } from 'vue';
import useLoading from '@/hooks/loading';
import type { PopUp } from '@/hooks/popup';
import { useI18n } from 'vue-i18n';
import { PermissionInit, RouterAddUtils, permissionEdit, permissionGet } from '@/api/plat/permission';
import SelectRouter from '../router/select-router.vue';

const { t } = useI18n();
// 路由列表对象
const RouterSelectColumns = computed(() => [
  { title: t('plat.serviceCode'), dataIndex: 'serviceCode', slotName: 'serviceCode' },
  { title: t('plat.router.name'), dataIndex: 'name' },
  { title: t('plat.router.url'), dataIndex: 'url' },
]);
// 加载中变量
const { loading, setLoading } = useLoading(false);
// 表单数据初始化
const formData = PermissionInit();
// 入参读取
const props = defineProps({
  dict: {
    type: Object,
    required: true,
    default: () => {
      return {};
    },
  },
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
  popup: {
    type: Object,
    required: true,
    default: () => {
      return {} as PopUp;
    },
  },
  success: {
    type: Function,
    required: true,
  },
});
// 提交查询
async function getPermission() {
  try {
    const res = await permissionGet(props.popup.itemId);
    formData.value = res.data;
  } catch (err) {
    // DoNothing CommonPopUp
  } finally {
    setLoading(false);
  }
}
// 路由添加方法
const { routerAdd, selectData, openAdd, cancelAdd, confirmAdd, doSelect } = RouterAddUtils(formData);
// const permissionEdit = ref<FormInstance>();
// 提交数据
const handleSubmit = async ({ errors, values }: { errors: any; values: any }) => {
  if (loading.value) return;
  if (!errors) {
    setLoading(true);
    try {
      // const res = await permissionEdit.value?.validate();
      await permissionEdit(values);
      props.popup.closePop();
      props.success(false);
    } catch (err) {
      // DoNothing CommonPopUp
    } finally {
      setLoading(false);
    }
  }
};
// 页面渲染
onMounted(() => {
  getPermission();
});
</script>
