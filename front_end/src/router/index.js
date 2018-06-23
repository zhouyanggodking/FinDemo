import Vue from 'vue';
import Router from 'vue-router';

import authService from '@/services/authService';
import MainPage from '@/components/pages/MainPage';
import TopList from '@/components/pages/TopList';

// component lazy loading, refer to https://router.vuejs.org/zh-cn/advanced/lazy-loading.html
// const MainPage = () => import(/* webpackChunkName: "group-MainPage" */ '@/components/MainPage.vue');
// const ResultPage = () => import(/* webpackChunkName: "group-ResultPage" */ '@/components/ResultPage.vue');
// const DemoPage = () => import(/* webpackChunkName: "group-DemoPage" */ '@/components/DemoPage.vue');

Vue.use(Router);

const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main-page',
      component: MainPage
    },
    {
      path: '/top-list',
      name: 'top-list',
      component: TopList
    }    
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!authService.isLoggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next(); // 确保一定要调用 next()
  }
});

export default router;
