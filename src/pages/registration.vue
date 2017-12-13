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
				this.$store.commit('token', localStorage.getItem('token'));
				this.loadUser(this.$store.state.token);
			}
			else
				this.register()
		},
		methods: {
			register: function () {
				if (this.code) {
					Ajax.request("GET", "http://10.241.1.87:8080/registration?code=" + this.code, {}, this.setToken, this.error)
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
				this.loadUser(token)
			},
			loadUser: function (token) {
				let userId = jwtDecode(token).sub;
				Ajax.request("GET", "http://10.241.1.87:8080/user/" + userId, {}, this.setUser, this.error, token);
				Ajax.request("GET", "http://10.241.1.87:8080/user/" + userId + "/all_friends", {}, this.setUserFriends, this.error, this.$store.state.token);
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