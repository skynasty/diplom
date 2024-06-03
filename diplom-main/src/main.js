import "./assets/style.css";

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import 'element-plus/theme-chalk/dark/css-vars.css'

import App from './App.vue'
import router from './router'


const app = createApp(App)


app.use(createPinia()).use(router).use(ElementPlus).mount('#app')


