import Vue from 'vue'
import Router from 'vue-router'

import Content from '@/pages/page-content.vue'
import Registration from '@/pages/registration.vue'

Vue.use(Router)

export default new Router({
	routes: [
		{ path: '/', component: Content },
		{ path: '/user/:userId', component: Content },
		{ path: '/404', component:
			{template: '<div><p>Page not found</p><router-link to="/user/1">To /user/1</router-link></div>'}},
		{ path: '/registration', component: Registration }
	],
	mode: 'history'
})