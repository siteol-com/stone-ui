<template>
  <a-row :gutter="16">
    <a-col :span="12">
      <a-spin :loading="loading">
        <a-form class="form" :model="formData" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
          <a-form-item field="serviceCode" :label="$t('plat.serviceCode')">
            <span class="formSpan">{{ dictMap.serviceCode[formData.serviceCode] }}</span>
          </a-form-item>
          <a-form-item field="name" :label="$t('plat.router.name')">
            <span class="formSpan">{{ formData.name }}</span>
          </a-form-item>
          <a-form-item field="url" :label="$t('plat.router.url')">
            <span class="formSpan">{{ formData.url }}</span>
          </a-form-item>
          <a-form-item field="printReq" :label="$t('plat.router.printReq')">
            <span class="formSpan">{{ dictMap.printLog[formData.printReq] }}</span>
          </a-form-item>
          <a-form-item field="printRes" :label="$t('plat.router.printRes')">
            <span class="formSpan">{{ dictMap.printLog[formData.printRes] }}</span>
          </a-form-item>
          <a-form-item field="type" :label="$t('plat.router.type')">
            <span class="formSpan">{{ dictMap.routerType[formData.type] }}</span>
            <template #extra>
              <div>{{ $t('plat.router.type.tips') }}</div>
            </template>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import useLoading from '@/hooks/loading';
import { routerGet } from '@/api/plat/router';
import { PopUp } from '@/hooks/popup';
// 加载中变量
const { loading, setLoading } = useLoading(true);
// 顶部导航根据入参读取
const props = defineProps({
  dictMap: {
    type: Object,
    default: () => {
      return {
        serviceCode: {} as any,
        routerType: {} as any,
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
async function getRouter() {
  try {
    const res = await routerGet(props.popup.itemId);
    formData.value = res.data;
  } catch (err) {
    // DoNothing CommonPopUp
  } finally {
    setLoading(false);
  }
}

// 页面渲染
onMounted(() => {
  getRouter();
});
</script>
