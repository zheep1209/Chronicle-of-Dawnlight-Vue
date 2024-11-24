import './assets/style/base.css'
import './assets/style/codeBlocks.css'
import './assets/style/reElement.css'
import './assets/style/scrollBar.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import piniaPluginPersist from 'pinia-plugin-persist';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { createPinia } from 'pinia'
const app = createApp(App)
import 'default-passive-events'
app.use(VueAxios, axios)
app.use(createPinia().use(piniaPluginPersist))
app.use(router)
app.use(ElementPlus)
app.mount('#app')
