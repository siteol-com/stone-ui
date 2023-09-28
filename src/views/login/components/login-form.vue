<template>
  <div class="login-form login-form-wrapper">
    <a-form ref="loginForm" :model="userInfo" class="login-form" layout="vertical" @submit="handleSubmit">
      <a-form-item
        field="account"
        :rules="[
          {
            required: true,
            message: $t('login.form.account.errMsg'),
          },
        ]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input v-model="userInfo.account" :placeholder="$t('login.form.account.placeholder')" allow-clear>
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="password"
        :rules="[
          {
            required: true,
            message: $t('login.form.password.errMsg'),
          },
        ]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password v-model="userInfo.password" :placeholder="$t('login.form.password.placeholder')" allow-clear>
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="login-form-password-actions">
          <a-checkbox
            checked="rememberPassword"
            :model-value="loginConfig.rememberPassword"
            @change="setRememberPassword as any"
          >
            {{ $t('login.form.rememberPassword') }}
          </a-checkbox>
          <a-link status="danger" :hoverable="false">{{ $t('login.form.forgetPassword') }}</a-link>
        </div>
        <a-button type="primary" shape="round" html-type="submit" long :loading="loading">
          {{ $t('login.form.login') }}
        </a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store';
import { useStorage } from '@vueuse/core';
import useLoading from '@/hooks/loading';
import type { AuthLoginReq } from '@/api/open/auth';

// 登录菜单参数读取
const props = defineProps({
  tenantAlias: {
    type: String,
    default: '',
  },
});
// 路由跳转
const router = useRouter();
// 加载图标
const { loading, setLoading } = useLoading();
// 用户缓存数据
const userStore = useUserStore();
// 记住账号和密码
const loginConfig = useStorage('login-config', {
  rememberPassword: true,
  account: '',
  password: '',
});
// 登陆框信息
const userInfo = reactive({
  account: loginConfig.value.account,
  password: loginConfig.value.password,
  tenantAlias: props.tenantAlias,
});
// 提交登陆
const handleSubmit = async ({ errors, values }: { errors: any; values: any }) => {
  if (loading.value) return;
  if (!errors) {
    setLoading(true);
    try {
      // 提交登陆
      await userStore.accountLogin(values as AuthLoginReq);
      const { rememberPassword } = loginConfig.value;
      // 密码记忆
      if (rememberPassword) {
        loginConfig.value.account = values.account;
        loginConfig.value.password = values.password;
      } else {
        loginConfig.value.account = '';
        loginConfig.value.password = '';
      }
      // 进入通用的驾驶舱页面
      router.push({ path: '/center' });
    } catch (err) {
      // DoNothing CommonPopUp
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  }
};
const setRememberPassword = (value: boolean) => {
  loginConfig.value.rememberPassword = value;
};
</script>

<style lang="less" scoped>
.login-form {
  margin: 15px 0;
  &-wrapper {
    width: 100%;
  }

  &-password-actions {
    display: flex;
    justify-content: space-between;
  }
}
</style>
