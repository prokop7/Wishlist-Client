<template>
	<div id="app">
		<el-container>
			<el-header>
				<top-bar></top-bar>
			</el-header>
			<el-container>
				<el-main>
					<router-view>
					</router-view>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>
<script>
	import Ajax from "@/api"
	import TopBar from "./pages/top-bar.vue"
	import PageContent from "./pages/page-content.vue"
	import ElAside from "../node_modules/element-ui/packages/aside/src/main.vue";

	const data = {
		code: "",
		visible: false
	};

	export default {
		components: {
			ElAside,
			TopBar,
			PageContent
		},

		data: function () {
			return data;
		},
		mounted: function () {
//			console.log(this)
			this.code = this.$route.query["code"]
			this.check()
		},
		methods: {
			check: function () {
				if (this.code) {
					const _this = this
					Ajax.request("GET", "http://10.241.1.87:8080/user/registration?code=" + _this.code, {}, function () {
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

<style lang="scss">
	.el-header, .el-footer {
		background-color: #B3C0D1;
		color: #333;
		text-align: center;
		line-height: 60px;
		padding: 0;
	}

	.el-main {
		background-color: #E9EEF3;
		color: #333;
		text-align: center;
		line-height: 100%;
		height: 100%;
	}

	.el-container, .el-main, #page-content {
		height: 100%;
	}

	 html, body{
		 height:100%;
		 margin: 0;
	 }
	#app {
		height: 100%;
	}

</style>