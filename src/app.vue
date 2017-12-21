<template>
	<div id="app">
		<el-container>
			<el-header style="height: auto">
				<top-bar></top-bar>
			</el-header>
			<el-container>
				<el-main  class="wishlists-board u-fancy-scrollbar">
					<router-view>
					</router-view>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>
<script>
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
		}
	}
</script>

<style lang="scss">
	.el-header, .el-footer {
		/*background-color: #B3C0D1;*/
		/*color: #333;*/
		text-align: center;
		line-height: 60px;
		padding: 0;
	}

	.el-main {
		color: #333;
		line-height: 100%;
		height: 100%;
	}

	.el-container, .el-main, #page-content {
		height: 100%;
		background-color: #0079BF;
	}

	 html, body{
		 height:100%;
		 margin: 0;
	 }
	#app {
		height: 100vh;
	}
	* {
		font-family: "Helvetica Neue", Arial, Helvetica, sans-serif;
		/*line-height: 18px;*/
		font-weight: 400;
	}
</style>