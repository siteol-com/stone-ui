<template>
  <a-row :gutter="16">
    <a-col :span="12">
      <a-form class="form" :model="data" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
        <a-form-item field="name" :label="$t('plat.router.name')">
          <a-skeleton v-if="loading" :animation="true">
            <a-skeleton-line :widths="['200px']" :line-height="32" />
          </a-skeleton>
          <span v-else class="formSpan">{{ data.name }}</span>
        </a-form-item>
        <a-form-item field="url" :label="$t('plat.router.url')">
          <a-skeleton v-if="loading" :animation="true">
            <a-skeleton-line :widths="['200px']" :line-height="32" />
          </a-skeleton>
          <span v-else class="formSpan">{{ data.url }}</span>
        </a-form-item>
        <a-form-item field="serviceCode" :label="$t('plat.serviceCode')">
          <a-skeleton v-if="loading" :animation="true">
            <a-skeleton-line :widths="['200px']" :line-height="32" />
          </a-skeleton>
          <span v-else class="formSpan">{{ dictMap.serviceCode[data.serviceCode] }}</span>
        </a-form-item>
        <a-form-item field="type" :label="$t('plat.router.type')">
          <a-skeleton v-if="loading" :animation="true">
            <a-skeleton-line :widths="['200px']" :line-height="32" />
          </a-skeleton>
          <span v-else class="formSpan">{{ dictMap.routerType[data.type] }}</span>
          <template #extra>
            <div>{{ $t('plat.router.type.tips') }}</div>
          </template>
        </a-form-item>
      </a-form>
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
const data = ref<any>({});
// 提交查询
async function getRouter() {
  try {
    const res = await routerGet(props.popup.itemId);
    data.value = res.data;
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
