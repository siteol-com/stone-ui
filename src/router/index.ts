import { createRouter, createWebHistory } from 'vue-router'
// NProgress
// eslint-disable-next-line import/no-named-as-default
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import appRoutes from './app'
import MainLayout from '@/layout/main.vue'

// NProgress Configuration
NProgress.configure({ showSpinner: false })

// InitRouter
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: 'index',
    },
    {
      // AppRouter
      name: 'root',
      path: '/',
      component: MainLayout,
      children: appRoutes,
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/base/login.vue'),
      meta: {
        locale: 'menu.base.login',
        needAuth: false,
      },
    },
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'notFound',
    //   component: () => import('@/views/not-found/index.vue'),
    // },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

// Router Jump
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  // HaveToken ?
  if (false) {
    // HavePermission ?
  } else {
    if (to.name === 'login') {
      next()
      NProgress.done()
      return
    }
    // To Login
    next({
      name: 'login',
    })
    // Do not log query parameters
    //   query: {
    //     redirect: to.name,
    //     ...to.query,
    //   } as LocationQueryRaw,
    NProgress.done()
  }
})

export default router
