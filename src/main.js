import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'

Vue.config.productionTip = false
const isProd = process.env.NODE_ENV === "production"

import VueAnalytics from 'vue-analytics'
Vue.use(VueAnalytics, {
  id: 'UA-131470507-1',
  debug: {
    enabled: !isProd,
    disabled: isProd,
  }
})
new Vue({
  render: h => h(App),
}).$mount('#app')
