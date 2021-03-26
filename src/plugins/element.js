import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

// 注册为全局可用的组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 这个和其他的配置方式不一样，需要全局挂载，挂载到vue，$message是个自定义属性，后面的Message是个弹框组件。之后都可以通过this访问$messgae
Vue.prototype.$message = Message

