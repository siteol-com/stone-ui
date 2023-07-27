<template>
  <a-row :gutter="16">
    <a-col :span="12">
      <a-form
        ref="responseAdd"
        :loading="loading"
        :model="formData"
        :label-col-props="{ span: 6 }"
        :wrapper-col-props="{ span: 18 }"
        @submit="handleSubmit"
      >
        <a-form-item field="code" :label="$t('plat.response.code')">
          <template #extra>
            <div>{{ $t('plat.response.code.tips') }}</div>
          </template>
          <a-input v-model="formData.code" disabled />
        </a-form-item>

        <a-form-item
          field="serviceCode"
          :label="$t('plat.serviceCode')"
          :rules="[{ required: true, message: $t('common.rule.required') }]"
        >
          <template #extra>
            <div>{{ $t('plat.response.serviceCode.tips') }}</div>
          </template>
          <a-select
            v-model="formData.serviceCode"
            :options="dict.serviceCode"
            allow-clear
            allow-search
            :placeholder="$t('common.select.all')"
          />
        </a-form-item>

        <a-form-item
          field="type"
          :label="$t('plat.response.type')"
          :rules="[{ required: true, message: $t('common.rule.required') }]"
        >
          <template #extra>
            <div>{{ $t('plat.response.type.tips') }}</div>
          </template>
          <a-select
            v-model="formData.type"
            :options="dict.responseType"
            allow-clear
            allow-search
            :placeholder="$t('common.select.all')"
          />
        </a-form-item>

        <a-form-item
          field="remark"
          :label="$t('plat.response.remark')"
          :rules="[{ required: true, message: $t('common.rule.required') }]"
        >
          <a-input
            v-model="formData.remark"
            :max-length="64"
            allow-clear
            show-word-limit
            :placeholder="$t('plat.response.remark.place')"
          />
        </a-form-item>

        <a-form-item
          field="zhCn"
          :label="$t('plat.response.zhCn')"
          :rules="[{ required: true, message: $t('common.rule.required') }]"
        >
          <a-input
            v-model="formData.zhCn"
            :max-length="128"
            allow-clear
            show-word-limit
            :placeholder="$t('plat.response.zhCn.place')"
          />
        </a-form-item>

        <a-form-item
          field="enUs"
          :label="$t('plat.response.enUs')"
          :rules="[{ required: true, message: $t('common.rule.required') }]"
        >
          <a-input
            v-model="formData.enUs"
            :max-length="128"
            allow-clear
            show-word-limit
            :placeholder="$t('plat.response.enUs.place')"
          />
        </a-form-item>

        <a-form-item class="formbtn">
          <a-space>
            <a-button type="primary" html-type="submit" :loading="loading">
              <template #icon>
                <icon-check />
              </template>
              {{ $t('common.button.submit') }}
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import useLoading from '@/hooks/loading';
import type { PopUp } from '@/hooks/popup';
import { ResponseInit, responseAdd } from '@/api/plat/response';
// 加载中变量
const { loading, setLoading } = useLoading(false);
// 表单数据初始化
const formData = ResponseInit();
// 顶部导航根据入参读取
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
// const responseAdd = ref<FormInstance>();
// 提交数据
const handleSubmit = async ({ errors, values }: { errors: any; values: any }) => {
  if (loading.value) return;
  if (!errors) {
    setLoading(true);
    try {
      // const res = await responseAdd.value?.validate();
      await responseAdd(values);
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
