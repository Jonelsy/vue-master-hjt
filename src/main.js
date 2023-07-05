import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios';
Vue.prototype.$axios = axios;
axios.defaults.baseURL = 'http://43.143.189.51:9999';
axios.defaults.headers.common['Authorization'] = localStorage.getItem("token");
Vue.use(ElementUI);
import formatDate from './DataChange/FormData.js'
Vue.prototype.$formatDate = formatDate
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

