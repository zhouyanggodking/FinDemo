import Vue from 'vue';
import ElementUI from 'element-ui';

import App from './App';
import router from './router';

import './main.scss';

import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;

Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
