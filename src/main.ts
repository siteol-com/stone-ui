import { createApp } from 'vue'
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css'
import '@/assets/style/base.css'
import '@/assets/style/customize.css'
// TODO # Vue Theme Package Wait Open
import router from './router'
import i18n from './locale'
// store

const app = createApp(App)
app.use(ArcoVue)
app.use(ArcoVueIcon)
app.use(router)
app.use(i18n)
app.mount('#app')
