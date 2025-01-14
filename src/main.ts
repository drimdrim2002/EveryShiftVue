import './assets/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VeeValidatePlugin from '@/plugins/VeeValidatePlugin'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// Vee Validate
app.use(VeeValidatePlugin)
app.config.errorHandler = (error) => {
  // TODO > improve the custom handler
  console.error(error)
}

app.mount('#app')
