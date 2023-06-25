<template>
  <div class="container light" :class="{ dark: theme === 'dark', load: load, lineIn: lineIn }">
    <div class="head">
      <NavBar :type="false" />
    </div>
    <ul class="line">
      <li></li>
      <li></li>
      <li></li>
    </ul>
    <div class="login" :class="{ login_run: tenant.alias }">
      <div v-if="tenant.alias" class="login_div">
        <div class="logo">
          <img :src="tenant.logo + (theme === 'dark' ? '-dark' : '')" />
        </div>
        <div class="title">{{ tenant.name }}</div>
        <LoginForm :tenant-alias="tenant.alias" />
      </div>
      <div v-else class="load">
        <icon-loading :size="36" />
        <p>{{ $t(errMsg) }}</p>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts" setup>
import NavBar from '@/components/navbar/index.vue';
import Footer from '@/components/footer/index.vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/store';
import { getOpenTenant } from '@/api/open/tenant';
import LoginForm from './components/login-form.vue';

const router = useRouter();
const appStore = useAppStore();
// 当前主题状态
const theme = computed(() => {
  return appStore.theme;
});
// 错误信息
const errMsg = ref('login.tips.get');
// 租户信息
const tenant: any = ref({});
// 查询租户数据
async function getTenant() {
  const { tenantAlias } = router.currentRoute.value.params;
  try {
    const res = await getOpenTenant(tenantAlias as string);
    // 检证登陆模板
    if (res.data.theme === 'light') {
      // 租户对象赋值
      tenant.value = res.data;
      // 获取租户成功，即将跳转到租户登陆页面
      localStorage.setItem('tenantAlias', tenant.value.alias);
    } else {
      errMsg.value = 'login.tips.theme';
      setTimeout(() => {
        router.push({ path: `/login/${res.data.theme}/${res.data.alias}` });
      }, 1000);
    }
  } catch (err) {
    // 查询失败
    errMsg.value = (err as Error).message;
  }
}
// 样式加载器
const load = ref(false);
const lineIn = ref(false);

// 先渲染后查询
onMounted(() => {
  setTimeout(() => {
    load.value = true;
    setTimeout(() => {
      lineIn.value = true;
    }, 500);
  }, 500);
  getTenant();
});
</script>

<style lang="less" scoped>
.light {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  * {
    transition: all 0.4s ease;
  }
  .login {
    position: absolute;
    width: 400px;
    height: 350px;
    left: calc(50% - 200px);
    top: calc(50% - 175px);
    padding: 20px 25px;
    border-radius: 15px;
    background-color: rgba(242, 244, 245, 0.45);
    display: flex;
    transform: scale(0.8);
    &_run {
      transform: scale(1);
    }
    &_div {
      width: 100%;
      .logo {
        width: 240px;
        height: 65px;
        margin: 5px auto;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .title {
        color: var(--color-text-2);
        font-size: 16px;
        line-height: 30px;
        text-align: center;
      }
    }
    .load {
      display: flex;
      margin: auto;
      flex-wrap: wrap;
      justify-content: center;
      color: var(--color-text-1);
      p {
        text-align: center;
        display: block;
        width: 100%;
        line-height: 30px;
        margin: 15px 0 5px 0;
        color: var(--color-text-1);
      }
    }
  }

  .line {
    list-style: none;
    display: block;
    position: relative;
    width: calc(100vw + 50px);
    height: calc(100vh - 280px);
    overflow: hidden;
    opacity: 0;
    left: -25px;
    top: -50vh;
    margin: 0;
    padding: 0;
    transform: skewY(5deg);
    animation: hpin 10s ease-in-out infinite;
    background-image: linear-gradient(-45deg, #fd853a, #ffc692);
  }

  .line li {
    position: absolute;
    width: 33%;
    height: 33.33%;
    left: -4%;
    top: 102%;
    background-image: linear-gradient(95deg, #fd853a, #ffc692);
    animation: spin 4s ease-in-out infinite;
  }
  .line li:nth-child(2) {
    left: 64%;
  }
  .footer {
    position: fixed;
    bottom: 15px;
    left: 0;
  }
}

.light.load {
  .line {
    opacity: 0.85;
    top: 117px;
  }
}
.light.lineIn {
  .line li {
    width: 33%;
    height: 33.33%;
    top: 0%;
  }
  .line li:nth-child(2) {
    top: 33%;
  }
  .line li:nth-child(3) {
    top: 67%;
  }
}
.light.dark {
  .line {
    opacity: 0.7;
  }
  .login {
    background-color: rgba(0, 0, 0, 0.3);
  }
}
</style>
