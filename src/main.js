import Vue from 'vue'
import router from './router'
import App from './app.vue'
import Vuex from 'vuex'

import ElementUI from 'element-ui'
import {Menu, MenuItem} from 'element-ui'

import styles from './css/scrollbars.css'

Vue.use(Vuex);
Vue.use(ElementUI);

const myMenu = {
	mixins: [Menu],
	methods: {
		mixColor(color, percent) {
			return `rgba(0, 0, 0, ${ (this.transparency)})`;
		},
	},
	props: {
		transparency: {
			default: 0.2
		}
	}
};
const myMenuItem = {
	mixins: [MenuItem],
	computed: {
		backgroundColor() {return `rgba(0, 0, 0, 0)`},
		// hoverBackground() {return "00000019"}
	}
}

Vue.component(Menu.name, myMenu);
Vue.component(MenuItem.name, myMenuItem);

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

