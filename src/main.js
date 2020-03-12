// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import request from './plugins/request'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import '@/assets/user.css'
import '@babel/polyfill'
import axios from 'axios'
import headerTop from "../src/components/header"
// import Cookies from 'js-cookie'


//引用cookie插件
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
//引用cookie插件

import store from '../src/store'

// import '@/assets/quill.core.css'
// import '@/assets/quill.snow.css'
// import '@/assets/quill.bubble.css'
import Vuex from 'vuex'
Vue.use(Vuex)
  


Vue.config.productionTip = false
Vue.use(ElementUI, { size: 'small', zIndex: 3000 });
Vue.use(request)
Vue.use(VueQuillEditor)
Vue.component("head-view",headerTop);
/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})