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
			this.register()
		},
		methods: {
			register: function () {
				if (this.code) {
					Ajax.request("GET", "http://10.241.1.87:8080/registration?code=" + this.code, {}, this.setToken, this.error)
				}
				console.log("EMPTY")
			},
			error: function() {
				console.log("ERROR")
			},
			setToken: function (d) {
				let token = d['accessToken'];
				localStorage.setItem('token', token);
				this.$store.commit('token', token);
				let userId = jwtDecode(token).sub;
				Ajax.request("GET", "http://10.241.1.87:8080/user/" + userId, {}, this.setUser, this.error, token);
			},
			setUser: function (result) {
				this.$store.commit('setUser', result)
				this.$router.push("/user/" + result.id)
			}
		}
	}
</script>