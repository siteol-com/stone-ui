<template>
  <a-form ref="routerAdd" label-align="left" layout="vertical" :model="formData" @submit="handleSubmit">
    <a-row :gutter="20">
      <a-col :span="12">
        <a-form-item
          field="type"
          :label="$t('plat.router.type')"
          :rules="[{ required: true, message: $t('common.rule.required') }]"
        >
          <template #extra>
            <div>{{ $t('plat.router.type.tips') }}</div>
          </template>
          <a-select
            v-model="formData.type"
            :options="dict.routerType"
            allow-clear
            allow-search
            :placeholder="$t('common.select.all')"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          field="serviceCode"
          :label="$t('plat.serviceCode')"
          :rules="[{ required: true, message: $t('common.rule.required') }]"
        >
          <a-select
            v-model="formData.serviceCode"
            :options="dict.serviceCode"
            allow-clear
            allow-search
            :placeholder="$t('common.select.all')"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          field="name"
          :label="$t('plat.router.name')"
          :rules="[{ required: true, message: $t('common.rule.required') }]"
        >
          <a-input
            v-model="formData.name"
            :max-length="32"
            allow-clear
            show-word-limit
            :placeholder="$t('plat.router.name.place')"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          field="url"
          :label="$t('plat.router.url')"
          :rules="[
            { required: true, message: $t('common.rule.required') },
            {
              match: /^(\/)[a-z0-9\/]*$/,
              message: $t('plat.router.url.format'),
            },
          ]"
        >
          <a-input
            v-model="formData.url"
            :max-length="64"
            allow-clear
            show-word-limit
            :placeholder="$t('plat.router.url.place')"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          field="printReq"
          :label="$t('plat.router.printReq')"
          :rules="[{ required: true, message: $t('common.rule.required') }]"
        >
          <a-select
            v-model="formData.printReq"
            :options="dict.printLog"
            allow-clear
            allow-search
            :placeholder="$t('common.select.all')"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          field="printRes"
          :label="$t('plat.router.printRes')"
          :rules="[{ required: true, message: $t('common.rule.required') }]"
        >
          <a-select
            v-model="formData.printRes"
            :options="dict.printLog"
            allow-clear
            allow-search
            :placeholder="$t('common.select.all')"
          />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-divider />
        <div class="formbtn">
          <a-space>
            <a-button type="primary" html-type="submit" :loading="loading">
              <template #icon>
                <icon-check />
              </template>
              {{ $t('common.button.submit') }}
            </a-button>
          </a-space>
        </div>
      </a-col>
    </a-row>
  </a-form>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import useLoading from '@/hooks/loading';
import type { PopUp } from '@/hooks/popup';
import { routerInit, routerAdd } from '@/api/plat/router';
// 加载中变量
const { loading, setLoading } = useLoading(false);
// 表单数据初始化
const formData = routerInit();
// 入参读取
const props = defineProps({
  dict: {
    type: Object,
    required: true,
    default: () => {
      return {};
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
// const routerAdd = ref<FormInstance>();
// 提交数据
const handleSubmit = async ({ errors, values }: { errors: any; values: any }) => {
  if (loading.value) return;
  if (!errors) {
    setLoading(true);
    try {
      // const res = await routerAdd.value?.validate();
      await routerAdd(values);
      props.popup.closePop();
      props.success();
    } catch (err) {
      // DoNothing CommonPopUp
    } finally {
      setLoading(false);
    }
  }
};
// 页面渲染
onMounted(() => {
  // Nothing
});
</script>
