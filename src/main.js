// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'

import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/login.css'
import './assets/css/product.css'

Vue.use(infiniteScroll);
Vue.use(Vuex);
Vue.use(VueLazyload, {
    loading: 'static/loading-svg/loading-bubbles.svg',
    try: 3 // default 1
})

Vue.filter("currency", currency);

Vue.config.productionTip = false;

const store = new Vuex.Store({
    state: {
        cartCount: 0,
    },
    mutations: {
        initCartCount(state, num) {
            state.cartCount = num;

        },
        updateCartCount(state, num) {
            state.cartCount += Number(num);
        }
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: {App}
})
