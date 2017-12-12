import Vue from 'vue'
import Router from 'vue-router'

import Content from '@/pages/page-content.vue'

Vue.use(Router)

export default new Router({
	routes: [
		{ path: '/', component: Content },
		{ path: '/user/:userId', component: Content },
	],
	mode: 'history'
})