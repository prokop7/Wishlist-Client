import Vue from 'vue'
import router from './router'
import App from './app.vue'
import Vuex from 'vuex'

import ElementUI from 'element-ui'
import {Select, Option, Table} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Vuex);
Vue.use(ElementUI);

Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(Table.name, Table);

const store = new Vuex.Store({
	state: {
		count: 0,
		user: {
			id: 0,
			name: "",
			photoLink: "",
			wishlists: [{name: "Blank", id: 0, items: []}],
		},
		friends: [{name: "Default name", id: -1}],
		token: ""
	},
	getters: {
		user(state) {
			return state.user
		},
		wishlists(state) {
			return state.user.wishlists
		},
		token(state) {
			return state.token
		},
		friends(state) {
			return state.friends
		},
		wishlistsCount(state, getters) {
			return getters.wishlists.length
		}
	},
	mutations: {
		increment(state) {
			state.count++
		},
		setUser(state, user) {
			state.user = user
		},
		token(state, value) {
			state.token = value
		},
		friends(state, friends) {
			state.friends = friends
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
}).$mount("#app");

