import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

window.axios = require('axios')

require('@/assets/css/header.css')
require('@/assets/css/style.css')
require('@/assets/css/home.css')
require('@/assets/css/login.css')
require('@/assets/css/board.css')

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
