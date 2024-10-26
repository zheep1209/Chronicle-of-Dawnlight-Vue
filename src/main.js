import './assets/style/base.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
const app = createApp(App)

app.use(VueAxios, axios)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')
