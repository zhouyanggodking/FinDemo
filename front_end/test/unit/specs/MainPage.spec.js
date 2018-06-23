import ElementUI from 'element-ui';
import Vue from 'vue';
import VueRouter from 'vue-router';
import { shallow, createLocalVue } from '@vue/test-utils';

import MainPage from '@/components/MainPage';

Vue.use(ElementUI);

describe('MainPage.vue', () => {
  it('should initialize searchText to empty', () => {
    const Constructor = Vue.extend(MainPage);
    const vm = new Constructor().$mount();
    expect(vm.$data.searchText).toEqual('');
  });

  it('when click search button, it should navigate to right page', () => {
    const localVue = createLocalVue();
    localVue.use(VueRouter);
    const router = new VueRouter();
    const wrapper = shallow(MainPage, {
      localVue,
      router
    });
    spyOn(wrapper.vm.$router, 'push');
    wrapper.vm.search('query');
    expect(wrapper.vm.$router.push).toHaveBeenCalled();
  });
});
