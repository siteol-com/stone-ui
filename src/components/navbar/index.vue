<template>
  <div class="navbar">
    <div v-if="type" class="left-side">
      <a-button class="nav-btn" @click="onCollapse">
        <template #icon>
          <icon-menu-fold v-if="!collapsed" :style="{ fontSize: '22px' }" />
          <icon-menu-unfold v-else :style="{ fontSize: '22px' }" />
        </template>
      </a-button>
    </div>
    <div v-if="type" class="center-side">
      <transition name="breadcrumb">
        <a-breadcrumb v-if="breadList.list[0]">
          <a-breadcrumb-item> <icon-apps /> </a-breadcrumb-item>
          <a-breadcrumb-item v-for="(item, index) in breadList.list" :key="index">{{
            $t(item.meta?.locale ? item.meta?.locale : '')
          }}</a-breadcrumb-item>
        </a-breadcrumb>
      </transition>
    </div>
    <ul class="right-side">
      <li v-if="type">
        <a-tooltip :content="$t('settings.navbar.alerts')">
          <div class="message-box-trigger">
            <a-badge :count="9" dot>
              <a-button class="nav-btn" :shape="'circle'" @click="setPopoverVisible">
                <icon-notification />
              </a-button>
            </a-badge>
          </div>
        </a-tooltip>
        <a-popover
          trigger="click"
          :arrow-style="{ display: 'none' }"
          :content-style="{ padding: 0, width: '400px' }"
          content-class="message-popover"
        >
          <div ref="refBtn" class="ref-btn"></div>
          <template #content>
            <message-box />
          </template>
        </a-popover>
      </li>
      <li>
        <a-tooltip :content="isFullscreen ? $t('settings.navbar.screen.toExit') : $t('settings.navbar.screen.toFull')">
          <a-button class="nav-btn" :shape="'circle'" @click="toggleFullScreen">
            <template #icon>
              <icon-fullscreen-exit v-if="isFullscreen" />
              <icon-fullscreen v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip :content="$t('settings.language')">
          <a-button class="nav-btn" :shape="'circle'" @click="setDropDownVisible">
            <template #icon>
              <icon-language />
            </template>
          </a-button>
        </a-tooltip>
        <a-dropdown trigger="click" @select="changeLocale as any">
          <div ref="triggerBtn" class="trigger-btn"></div>
          <template #content>
            <a-doption v-for="item in locales" :key="item.value" :value="item.value">
              <template #icon>
                <icon-check v-show="item.value === currentLocale" />
              </template>
              {{ item.label }}
            </a-doption>
          </template>
        </a-dropdown>
      </li>
      <li>
        <a-tooltip
          :content="theme === 'light' ? $t('settings.navbar.theme.toDark') : $t('settings.navbar.theme.toLight')"
        >
          <a-button class="nav-btn" :shape="'circle'" @click="handleToggleTheme">
            <template #icon>
              <icon-moon-fill v-if="theme === 'dark'" />
              <icon-sun-fill v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip :content="isColorWeak ? $t('settings.colorWeak.out') : $t('settings.colorWeak.in')">
          <a-button class="nav-btn" :shape="'circle'" @click="setVisible">
            <template #icon>
              <icon-palette />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li v-if="type">
        <a-dropdown trigger="click">
          <a-avatar :size="32" :style="{ cursor: 'pointer' }">
            <img alt="avatar" :src="avatar" />
          </a-avatar>
          <template #content>
            <a-doption>
              <a-space @click="switchRoles">
                <icon-tag />
                <span>
                  {{ $t('messageBox.switchRoles') }}
                </span>
              </a-space>
            </a-doption>
            <a-doption>
              <a-space @click="$router.push({ name: 'Info' })">
                <icon-user />
                <span>
                  {{ $t('messageBox.userCenter') }}
                </span>
              </a-space>
            </a-doption>
            <a-doption>
              <a-space @click="$router.push({ name: 'Setting' })">
                <icon-settings />
                <span>
                  {{ $t('messageBox.userSettings') }}
                </span>
              </a-space>
            </a-doption>
            <a-doption>
              <a-space @click="handleLogout">
                <icon-export />
                <span>
                  {{ $t('messageBox.logout') }}
                </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, onUnmounted, nextTick } from 'vue';
import { Message } from '@arco-design/web-vue';
import { useDark, useToggle, useFullscreen } from '@vueuse/core';
import { useAppStore, useUserStore } from '@/store';
import { listenerRouteChange, removeRouteListener } from '@/utils/route-listener';
import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';
import { LOCALE_OPTIONS } from '@/locale';
import useLocale from '@/hooks/locale';
import useUser from '@/hooks/user';
import MessageBox from '../message-box/index.vue';

// 入参读取
const props = defineProps({
  type: {
    type: Boolean,
    default: true,
  },
});

const appStore = useAppStore();
const { logout } = useUser();
const { changeLocale, currentLocale } = useLocale();
const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();
const locales = [...LOCALE_OPTIONS];
// 用户数据
const userStore = useUserStore();
const avatar = computed(() => {
  return userStore.avatar;
});
const theme = computed(() => {
  return appStore.theme;
});
// 菜单折叠
const collapsed = computed(() => {
  return appStore.menuCollapse;
});
const onCollapse = () => {
  appStore.updateSettings({ menuCollapse: !collapsed.value });
};
// 暗黑模式
const isDark = useDark({
  selector: 'body',
  attribute: 'arco-theme',
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: 'arco-theme',
  onChanged(dark: boolean) {
    // overridden default behavior
    appStore.toggleTheme(dark);
  },
});
const toggleTheme = useToggle(isDark);
const handleToggleTheme = () => {
  toggleTheme();
};
// 设置色弱模式
const colorWeakSet = localStorage.getItem('colorWeak');
const isColorWeak = ref(false);
if (colorWeakSet && colorWeakSet === '1') {
  isColorWeak.value = true;
}
const initColorWeak = () => {
  document.body.style.filter = isColorWeak.value ? 'invert(80%)' : 'none';
};
initColorWeak();
const setVisible = () => {
  isColorWeak.value = !isColorWeak.value;
  localStorage.setItem('colorWeak', isColorWeak.value ? '1' : '0');
  initColorWeak();
};

// 路由切换
const breadList = reactive({ list: [] as RouteRecordNormalized[] });
if (props.type) {
  listenerRouteChange((route: RouteLocationNormalized) => {
    breadList.list = [];
    // 获取路由关系
    const { matched } = route;
    // 延时处理
    nextTick(() => {
      setTimeout(() => {
        breadList.list = matched.filter((item) => item.meta);
      }, 350);
    });
  }, true);
}

const refBtn = ref();
const triggerBtn = ref();
const setPopoverVisible = () => {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  refBtn.value.dispatchEvent(event);
};
const handleLogout = () => {
  logout();
};
const setDropDownVisible = () => {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  triggerBtn.value.dispatchEvent(event);
};
const switchRoles = async () => {
  const res = await userStore.switchRoles();
  Message.success(res as string);
};
// const toggleDrawerMenu = inject('toggleDrawerMenu') as () => void;
// 注销监听
onUnmounted(() => {
  //
  if (props.type) {
    removeRouteListener();
  }
});
</script>

<style scoped lang="less">
.navbar {
  display: flex;
  justify-content: space-between;
  height: 60px;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
}

.left-side {
  display: flex;
  align-items: center;
  padding-left: 25px;
  width: 60px;
}

.center-side {
  width: calc(100% - 405px);
  padding-left: 20px;
  display: flex;
}

.right-side {
  display: flex;
  justify-content: right;
  padding: 0 15px;
  width: 345px;
  list-style: none;
  :deep(.locale-select) {
    border-radius: 20px;
  }
  li {
    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  a {
    color: var(--color-text-1);
    text-decoration: none;
  }
  .nav-btn {
    border-color: rgb(var(--gray-2));
    color: rgb(var(--gray-8));
    font-size: 16px;
  }
  .trigger-btn,
  .ref-btn {
    position: absolute;
    top: 50px;
  }
  .trigger-btn {
    margin-left: 14px;
  }
}
.head {
  .navbar {
    border-bottom: 1px solid transparent;
    background: transparent;
  }
  .right-side {
    width: 100%;
  }
}
</style>

<style lang="less">
.message-popover {
  .arco-popover-content {
    margin-top: 0;
  }
}
</style>
