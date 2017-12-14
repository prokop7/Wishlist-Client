<template>
	<div id="registration">
		{{state}}
	</div>
</template>
<script>
	import Ajax from "@/api"
	import jwtDecode from 'jwt-decode'

	export default {
		data: function () {
			return {
				state: "Registration"
			}
		},
		mounted: function () {
			this.code = this.$route.query["code"]
			if (this.$route.query["logout"]) {
				this.state = "You need a registration"
				this.$store.commit('token', "");
				this.$store.commit('setUser', {});
				localStorage.removeItem('token')
			} else if (localStorage.getItem('token')) {
				this.state = "Wait";
				let token = localStorage.getItem('token')
				this.$store.commit('token', token);
				Ajax.setToken(token);
				this.loadUser(jwtDecode(token).sub);
			}
			else
				this.register()
		},
		methods: {
			register: function () {
				if (this.code) {
					Ajax.registerWithCode(this.code, this.setToken, this.error)
				}
				console.log("EMPTY")
			},
			error: function () {
				console.log("ERROR")
			},
			setToken: function (d) {
				let token = d['accessToken'];
				localStorage.setItem('token', token);
				this.$store.commit('token', token);
				Ajax.setToken(token);
				this.loadUser(jwtDecode(token).sub)
			},
			loadUser: function (userId) {
				Ajax.getUser(userId, this.setUser, this.error);
				Ajax.getUserFriends(userId, this.setUserFriends, this.error);
			},
			setUser: function (result) {
				this.$store.commit('setUser', result);
				this.$router.push("/user/" + result.id)
			},
			setUserFriends: function (result) {
				this.$store.commit('friends', result);
			}
		}
	}
</script>