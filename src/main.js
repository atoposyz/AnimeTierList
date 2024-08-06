import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import emitter from './utils/eventBus'

const app = createApp(App)

app.config.globalProperties.$bus = emitter

app.mount('#app')
