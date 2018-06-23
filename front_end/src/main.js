// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import axios from 'axios';
import Vue from 'vue';
import {
  Button, 
  Carousel,
  CarouselItem,
  Checkbox,
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Form,
  FormItem,
  Input,
  Loading,
  Option,
  Pagination,
  Select,
  Table, 
  TableColumn,
  Tabs,
  TabPane,
  Tree
} from 'element-ui';


import authService from '@/services/authService';
import App from './App';
import router from './router';

import './main.scss';

Vue.use(Button);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Checkbox);
Vue.use(Dialog);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Loading.directive);
Vue.use(Option);
Vue.use(Pagination);
Vue.use(Select);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tree);

Vue.config.productionTip = false;

// use interceptor to add auth token to every request exception login
axios.interceptors.request.use(config => {
  if (config.url.indexOf('/api/login') === -1) {
    const authToken = authService.getAuthToken();
    if (authToken) {
      config.headers.Authorization = authToken;
    }  
  }  
  return config;
});

axios.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response.status === 401) {
    const currentUrl = router.currentRoute.fullPath;
    if (currentUrl.indexOf('/login') === -1) {
      router.push({
        path: '/login',
        query: {
          redirect: currentUrl
        }
      });
    }    
  }
  return Promise.reject(error);
});

window.eventBus = new Vue();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
