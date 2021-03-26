import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import "./assets/css/global.css"
import axios from 'axios'

// 把axios挂载到vue的原型对象上,这样vue的组件都可以通过this直接访问到$http
Vue.prototype.$http = axios
// 配置请求的根据经
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
