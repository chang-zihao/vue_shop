import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import "./assets/css/global.css"
import "./assets/fonts/iconfont.css"
import axios from 'axios'

// 配置请求的根据经
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

//在axios挂载到vue原型对象之前，设置拦截器
//请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use(config => { //config就是请求对象
  //为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})

// 把axios挂载到vue的原型对象上,这样vue的组件都可以通过this直接访问到$http
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
