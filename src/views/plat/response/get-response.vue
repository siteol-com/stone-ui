<template>
  <a-spin :loading="loading">
    <a-form class="form" label-align="left" layout="vertical" :model="formData">
      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-item field="serviceCode" :label="$t('plat.serviceCode')">
            <template #extra>
              <div>{{ $t('plat.response.serviceCode.tips') }}</div>
            </template>
            <span class="formSpan">{{ dictMap.serviceCode[formData.serviceCode] }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="type" :label="$t('plat.response.type')">
            <template #extra>
              <div>{{ $t('plat.response.type.tips') }}</div>
            </template>
            <span class="formSpan">{{ dictMap.responseType[formData.type] }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="code" :label="$t('plat.response.code')">
            <template #extra>
              <div>{{ $t('plat.response.code.tips') }}</div>
            </template>
            <span class="formSpan">{{ formData.code }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="remark" :label="$t('plat.response.remark')">
            <span class="formSpan">{{ formData.remark }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="zhCn" :label="$t('plat.response.zhCn')">
            <span class="formSpan">{{ formData.zhCn }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="enUs" :label="$t('plat.response.enUs')">
            <span class="formSpan">{{ formData.enUs }}</span>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-spin>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import useLoading from '@/hooks/loading';
import { responseGet } from '@/api/plat/response';
import { PopUp } from '@/hooks/popup';
// 加载中变量
const { loading, setLoading } = useLoading(true);
// 入参读取
const props = defineProps({
  dictMap: {
    type: Object,
    default: () => {
      return {
        serviceCode: {} as any,
        responseType: {} as any,
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
});
// 查询数据
const formData = ref<any>({});
// 提交查询
async function getresponse() {
  try {
    const res = await responseGet(props.popup.itemId);
    formData.value = res.data;
  } catch (err) {
    // DoNothing CommonPopUp
  } finally {
    setLoading(false);
  }
}

// 页面渲染
onMounted(() => {
  getresponse();
});
</script>
