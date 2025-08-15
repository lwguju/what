import { createApp } from 'vue'

import App from './App.vue'

import router from './router'

const app = createApp(App)




import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { zhCn } from 'element-plus/es/locales.mjs'  


import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'  // 导入插件
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate) 

app.use(pinia)

app.use(router)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(ElementPlus, {
    locale: zhCn, // 设置语言为中文
})


app.mount('#app')