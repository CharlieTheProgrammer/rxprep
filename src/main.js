import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)

new Vue({
  render: h => h(App),
}).$mount('#app')
