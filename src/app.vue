<template>
	<!-- App -->
	<div id="app">
		{{code}}
		<a href="https://oauth.vk.com/authorize?client_id=6284569&redirect_uri=http://10.241.1.87:8081/user&scope=3">Text</a>
	</div>
</template>
<script>
	import Ajax from "@/ajax"

	var data = {
		code: ""
	}

	export default {
		data: function () {
			return data;
		},
		mounted: function () {
			console.log(this)
			this.code = this.$route.query["code"]
			this.check()
		},
		methods: {
			check: function () {
				if (this.code) {
					var _this = this
					Ajax.request("GET", "http://10.241.1.87:8080/user/registration?code=" + this.code, {}, function () {
						_this.$router.push("/yeah")
					}, function () {
						console.log("ERROR")
					})
				}
				console.log("EMPTY")
			}
		}

	}
</script>