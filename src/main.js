import Vue from 'vue'
import router from './router'
import App from './app.vue'
import Vuex from 'vuex'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Vuex)
Vue.use(ElementUI)

const store = new Vuex.Store({
	state: {
		count: 0,
		user: {
			name: "",
			photoLink: "",
			wishlists: [{name: "Blank", id: 0, items: []}]
		},
	},
	getters: {
		user(state) {
			return state.user
		},
		wishlists(state) {
			return state.user.wishlists
		}
	},
	mutations: {
		increment(state) {
			state.count++
		},
		setUser(state, user) {
			state.user = user
		}
	}
});


export const mainVue = new Vue({
	el: '#app',
	template: "<app/>",
	components: {
		'app': App
	},
	router,
	store
}).$mount("#app")

