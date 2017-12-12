import Vue from 'vue'
import router from './router'
import App from './app.vue'
import Vuex from 'vuex'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Vuex)
Vue.use(ElementUI)

const Yeah = {template: '<p>YEAAAAH!!!</p>'}


export const mainVue = new Vue({
	el: '#app',
	template: "<app/>",
	components: {
		'app': App
	},
	router
}).$mount("#app")

