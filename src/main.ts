import './assets/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { plugin } from '@formkit/vue'
import customConfig from '../formkit.config'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// FormKit
app.use(plugin, customConfig)
app.config.errorHandler = (error) => {
  // TODO > improve the custom handler
  console.error(error)
}

app.mount('#app')
