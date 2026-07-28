import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import { createPinia } from 'pinia'
import VueApexCharts from "vue3-apexcharts";

createApp(App)
    .use(router)
    .use(createPinia())
    .component('apexchart', VueApexCharts)
    .mount('#app')
