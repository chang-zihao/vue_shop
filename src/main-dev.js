import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 全局样式
import "./assets/css/global.css"
//图标
import "./assets/fonts/iconfont.css"
//导入axios
import axios from 'axios'
// 导入带有树形表格的插件
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

//导入nprogress包对应的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置请求的根据经
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

//在axios挂载到vue原型对象之前，设置拦截器
//请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use(config => { //config就是请求对象
  // 在request 拦截器中，展示进度条，NProgress.start()
  NProgress.start()
  //为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})
// 在 response拦截器中隐藏进度条，NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  // 必须return config
  return config
})

// 把axios挂载到vue的原型对象上,这样vue的组件都可以通过this直接访问到$http
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 注册带有树形结构的表格的插件
Vue.component('tree-table', TreeTable)

// 将富文本编辑器注册为全局可用得到组件
Vue.use(VueQuillEditor)

// 全局时间格式过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal * 1000)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
