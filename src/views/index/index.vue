<template>
  <div class="container index">
    <div class="head">
      <NavBar :type="false" />
    </div>
    <div class="tips">
      <div class="logo" :class="{ dark: theme === 'dark' }">
        <div class="lruner logo" :class="{ dark: theme === 'dark' }"></div>
      </div>
      <div class="info">{{ $t(tips) }}</div>
      <div class="load"><icon-loading :size="36" /></div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts" setup>
import Footer from '@/components/footer/index.vue';
import NavBar from '@/components/navbar/index.vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/store';
import { getOpenTenant } from '@/api/open/tenant';

const appStore = useAppStore();
const router = useRouter();
// 当前主题状态
const theme = computed(() => {
  return appStore.theme;
});
// 提示语 欢迎访问Stone授权基座
const tips = ref('index.welcome');
function go() {
  setTimeout(async () => {
    // 启动分析处理
    // 尝试获取租户缓存数据，获取到跳转
    const tenantAlias = localStorage.getItem('tenantAlias');
    if (tenantAlias) {
      // 提示语 正在为您检查最近访问租户的状态
      tips.value = 'index.tips.cached';
      try {
        const res = await getOpenTenant(tenantAlias);
        // 获取租户成功，即将跳转到租户登陆页面
        localStorage.setItem('tenantAlias', res.data.alias);
        setTimeout(() => {
          tips.value = 'index.tips.go';
          setTimeout(() => {
            router.push({ path: `/login/light/${res.data.alias}` });
          }, 1500);
        }, 1500);
      } catch (err) {
        // 查询失败
        tips.value = (err as Error).message;
      }
    } else {
      // 获取不到，提示请联系管理员
      tips.value = 'index.tips';
    }
  }, 1000);
}

// 界面渲染完成启动
onMounted(() => {
  go();
});
</script>

<style scoped lang="less">
.index {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  color: var(--color-text-1);
  .tips {
    div {
      width: 100%;
      text-align: center;
      margin: 15px;
    }
    .logo {
      position: relative;
      background: url(/static/img/logo.png);
      background-size: 100% 100%;
      width: 300px;
      height: 80px;
      margin: 15px auto;
      .lruner {
        position: absolute;
        left: 0;
        top: -15px;
        z-index: 999;
        opacity: 0.6;
        transform: scale(1);
        animation: bili 1s linear infinite;
      }
    }
    .logo.dark {
      background: url(/static/img/logo-dark.png);
      background-size: 100% 100%;
    }
    .info {
      font-size: 18px;
      line-height: 30px;
    }
  }
  .footer {
    position: absolute;
    bottom: 25px;
  }
}
</style>
