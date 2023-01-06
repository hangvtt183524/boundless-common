import Vue from 'vue';
import singleSpaVue from 'single-spa-vue';

import App from './App.vue';
import router from "@/router";
import store from "@/store";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

Vue.config.productionTip = false;
Vue.config.devtools = true;
Vue.config.ignoredElements = ['trix-editor']

Vue.component('font-awesome-icon', FontAwesomeIcon)

import './bootstrap'

const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
    render(h) {
      return h(App, {
        props: {},
      });
    },
    router,
    store
  },
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;

export async function getCurrentUser () {
  if (!store.getters['user/currentUser'].id) {
    await store.dispatch('user/fetchCurrentUser')
  }
  return store.getters['user/currentUser']
}

export * from './shareUIComponents'
