<template>
  <a-layout class="layout" :class="{ mobile: appStore.hideMenu }">
    <a-layout-sider class="layout-sider" breakpoint="xl" :collapsed="collapsed" :collapsible="true" :width="menuWidth" :hide-trigger="true" @collapse="setCollapsed">
      <div class="logo-wrapper" :class="{ collapsed: collapsed }">
        <div class="logo" :class="{ dark: theme === 'dark' }" />
      </div>
      <div class="menu-wrapper">
        <Menu />
      </div>
    </a-layout-sider>
    <a-layout class="layout-content" :style="paddingStyle">
      <NavBar />
      <TabBar />
      <a-layout-content>
        <PageLayout />
        <Footer v-if="footer" />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref, computed, watch, provide, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAppStore, useUserStore } from '@/store';
import NavBar from '@/components/navbar/index.vue';
import Menu from '@/components/menu/index.vue';
import Footer from '@/components/footer/index.vue';
import TabBar from '@/components/tab-bar/index.vue';
import usePermission from '@/hooks/permission';
import useResponsive from '@/hooks/responsive';
import PageLayout from './page-layout.vue';

const isInit = ref(false);
const appStore = useAppStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const permission = usePermission();
useResponsive(true);
const navbarHeight = `60px`;
const navbar = computed(() => appStore.navbar);
const renderMenu = computed(() => appStore.menu && !appStore.topMenu);
const hideMenu = computed(() => appStore.hideMenu);
const footer = computed(() => appStore.footer);
// 菜单宽度 - 收缩48 展开220
const menuWidth = computed(() => {
  return appStore.menuCollapse ? 48 : appStore.menuWidth;
});
// 菜单折叠
const collapsed = computed(() => {
  return appStore.menuCollapse;
});
// 当前主题状态
const theme = computed(() => {
  return appStore.theme;
});
// 主区域的侧边空边区域
const paddingStyle = computed(() => {
  const paddingLeft = { paddingLeft: `${menuWidth.value}px` };
  return { ...paddingLeft };
});
// 设置折叠
const setCollapsed = (val: boolean) => {
  if (!isInit.value) return; // for page initialization menu state problem
  appStore.updateSettings({ menuCollapse: val });
};
watch(
  () => userStore.role,
  (roleValue) => {
    if (roleValue && !permission.accessRouter(route)) router.push({ name: 'notFound' });
  }
);
const drawerVisible = ref(false);
const drawerCancel = () => {
  drawerVisible.value = false;
};
provide('toggleDrawerMenu', () => {
  drawerVisible.value = !drawerVisible.value;
});
onMounted(() => {
  isInit.value = true;
});
</script>

<style scoped lang="less">
@nav-size-height: 60px;
@layout-max-width: 1100px;

.layout {
  width: 100vw;
  height: 100vh;
}

.layout-sider {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  height: 100%;
  transition: all 0.2s linear;
  * {
    /*transition: all 0.3s cubic-bezier(0, 1, 0, 1);*/
    transition: all 0.2s linear;
  }
  &::after {
    position: absolute;
    top: 0;
    right: -1px;
    display: block;
    width: 1px;
    height: 100%;
    background-color: var(--color-border);
    content: '';
  }

  > :deep(.arco-layout-sider-children) {
    overflow-y: hidden;
  }
}

.logo-wrapper {
  height: 60px;
  width: 100%;
  padding: 7px 28px;
  overflow: hidden;
  background-color: var(--color-bg-2);
  .logo {
    background: url(/static/img/logo.png);
    background-size: 100% 100%;
    width: 165px;
    height: 46px;
  }
  .logo.dark {
    background: url(/static/img/logo-dark.png);
    background-size: 100% 100%;
  }
}
.logo-wrapper.collapsed {
  padding: 14px 13px;
  .logo {
    height: 32px;
    width: 120px;
  }
}

.menu-wrapper {
  height: calc(100% - 60px);
  overflow: auto;
  overflow-x: hidden;

  :deep(.arco-menu) {
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    ::-webkit-scrollbar-thumb {
      border: 0 solid transparent;
      background-clip: padding-box;
      border-radius: 0;
      background-color: transparent;
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: transparent;
    }
  }
}

.layout-content {
  height: 100vh;
  overflow-y: hidden;
  background-color: var(--color-fill-2);
  transition: all 0.2s linear;
  .arco-layout-content {
    height: calc(100vh - 94px);
    position: relative;
    overflow: auto;
  }
  .arco-layout-content::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .arco-layout-content::-webkit-scrollbar-thumb {
    background-color: var(--color-fill-4);
  }
  .arco-layout-content::-webkit-scrollbar-track {
    background-color: transparent;
  }
}
</style>

<style></style>
