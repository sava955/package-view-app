import Vue from 'vue'
import App from './App.vue'

import router from './router/index'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import AppDropdown from './components/AppDropdown'

Vue.config.productionTip = false

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.component('AppDropdown', AppDropdown)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
