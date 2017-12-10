<template>
	<div id="page-content">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>{{wishLists[0].name}}</span>
			</div>
			<div v-for="item in wishLists[0].items" :key="item.id" class="text item">
				{{item.name}}
			</div>
		</el-card>
		<el-button @click="loadWishLists">Load wishlists</el-button>
		<a href="https://oauth.vk.com/authorize?client_id=6284569&redirect_uri=http://10.241.1.87:8081/user&scope=3">OAuth2 Link</a>
	</div>
</template>
<script>
	import ElButton from "../../node_modules/element-ui/packages/button/src/button.vue";
	import api from "@/api"

	const data = {wishLists: [{name: "Blank", id: 0, items: []}]}

	export default {
		components: {ElButton},
		data: function () {
			return data;
		},
		methods: {
			loadWishLists() {
				console.log("Start loading");
				api.request("GET", "http://localhost:8080/user/1", {}, this.setWishLists, this.errorHandle)
			},
			setWishLists(result) {
				data.wishLists = result['wishlists']
			},
			errorHandle(e, eMessage) {
				console.log(e)
			}
		}
	}
</script>

<style lang="scss">
	.text {
		font-size: 14px;
	}

	.item {
		margin-bottom: 18px;
	}

	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}

	.clearfix:after {
		clear: both
	}

	.box-card {
		width: 300px;
	}
</style>