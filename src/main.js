import Vue from 'vue'
import VueRouter from "vue-router"

import App from './app.vue'

Vue.use(VueRouter)

const NotFound = { template: '<p>Page not found</p>' }
const Yeah = { template: '<p>YEAAAAH!!!</p>' }


const router = new VueRouter({
	routes: [
		{ path: '/', component: App },
		{ path: '/user', component: App },
		{ path: '/yeah', component: Yeah }
	],
	mode: 'history'
})

export var mainVue = new Vue({
	router,
}).$mount("#app");

