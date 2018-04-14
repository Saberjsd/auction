// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
import App from './App'
import router from './router'
// import axios from 'axios'

// import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/login.css';
import './assets/css/index.css';
import store from './store/index';
import { Select,Form,FormItem,Input,Option,Message} from 'element-ui';

// Vue.use(ElementUI);
Vue.use(Select);
Vue.use(FormItem);
Vue.use(Form);
Vue.use(Input);
Vue.use(Option);
Vue.use(VueRouter);
Vue.use(Vuex);

Vue.config.productionTip = false

Vue.prototype.$message = Message;
Vue.prototype.$http = axios;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
