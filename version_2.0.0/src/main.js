// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
import App from './App'
import router from './router'
// import axios from 'axios'

// import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/base.css';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import './assets/css/login.css';
import './assets/css/index.css';
import store from './store/index';
import { Select,Form,FormItem,Input,Option,Message,MessageBox} from 'element-ui';
import getTime from '@/util/getTime'


// Vue.use(ElementUI);
Vue.use(Select);
Vue.use(FormItem);
Vue.use(Form);
Vue.use(Input);
Vue.use(Option);
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.component(CollapseTransition.name, CollapseTransition)
Vue.config.productionTip = false

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$http = axios;
Vue.config.devtools = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
