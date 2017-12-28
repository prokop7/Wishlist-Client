<template>
	<div id="registration" v-loading.fullscreen.lock="loading">
		{{state}}
	</div>
</template>
<script>
	import Ajax from "@/api"
	import jwtDecode from 'jwt-decode'

	export default {
		data() {
			return {
				state: "Registration",
				loading: false
			}
		},
		mounted() {
			this.code = this.$route.query["code"];
			if (this.$route.query["logout"]) {
				this.state = "You need a registration";
				this.$store.commit('token', "");
				this.$store.commit('setUser', {});
				localStorage.removeItem('token')
			} else if (localStorage.getItem('token')) {
				this.setToken(localStorage.getItem('token'))
			}
			else if (this.code)
				this.register();
		},
		methods: {
			register() {
				let _this = this;
				_this.loading = true;
				Ajax.registerWithCode(
					this.code,
					localStorage.getItem('locale'),
					(data) => {
						_this.loading = false;
						_this.setToken(data['accessToken'])
					},
					this.error)
			},
			error() {
				console.log("ERROR");
				this.loading = false;
			},
			setToken(token) {
				localStorage.setItem('token', token);
				this.$store.commit('token', token);
				Ajax.setToken(token);
				this.$router.push("/user/" + jwtDecode(token).sub)
			},
		}
	}
</script>