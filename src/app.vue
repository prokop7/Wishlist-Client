<template>
	<div id="app">
		<el-container :style="'background-color:' + $store.getters.background">
			<el-header style="height: auto">
				<top-bar></top-bar>
			</el-header>
			<el-container>
				<el-main class="wishlists-board u-fancy-scrollbar">
					<router-view>
					</router-view>
				</el-main>
			</el-container>
			<el-footer height="8px"></el-footer>
		</el-container>
	</div>
</template>
<script>
	import TopBar from "./pages/top-bar.vue"
	import PageContent from "./pages/page-content.vue"
	import ElAside from "../node_modules/element-ui/packages/aside/src/main.vue";
	import ElFooter from "../node_modules/element-ui/packages/footer/src/main.vue";

	const data = {
		code: "",
		visible: false
	};

	export default {
		components: {
			ElFooter,
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

	.el-container{
		height: 100%;
	}

	html, body {
		height: 100%;
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

	.el-textarea__inner {
		resize: none;
		word-wrap: break-word;
		background-color: rgba(0,0,0,0);
		overflow: hidden;
		/*height: auto!important;*/
	}
</style>