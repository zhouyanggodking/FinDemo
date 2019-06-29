import Vue from 'vue';
import Router from 'vue-router';
// import MainPage from './views/MainPage';
import SecurityPage from './views/SecurityPage';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'security',
      component: SecurityPage  
    }
  ]
});
