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
import { ref, computed } from 'vue';
import { useAppStore } from '@/store';

const appStore = useAppStore();
// 当前主题状态
const theme = computed(() => {
  return appStore.theme;
});
// 提示语
const tips = ref('index.welcome');
// 启动分析处理
</script>

<style scoped lang="less">
.index {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  height: 100vh;
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
        z-index: -1;
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
