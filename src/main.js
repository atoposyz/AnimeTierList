import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import emitter from './utils/eventBus'

const app = createApp(App)

app.use(router)

app.config.globalProperties.$bus = emitter

app.mount('#app')
