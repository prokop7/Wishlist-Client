<template>
	<div id="page-content">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>{{wishlists[0].name}}</span>
			</div>
			<div v-for="item in $store.state.user.wishlists[0].items" :key="item.id" class="text item">
				{{item.name}}
			</div>
		</el-card>
		<el-button @click="$router.push('/user/' + (parseInt(userId) + 1))">Go to /user/{{parseInt(userId) + 1}}</el-button>
		<a href="https://oauth.vk.com/authorize?client_id=6284569&redirect_uri=http://10.241.1.87:8081/user&scope=3">OAuth2 Link</a>
	</div>
</template>
<script>
	import ElButton from "../../node_modules/element-ui/packages/button/src/button.vue";
	import api from "@/api"

	const data = {
		wishlists: [{name: "Blank", id: 0, items: []}],
		userId: 0
	};

	export default {
		components: {ElButton},
		data: function () {
			return data;
		},
		methods: {
			loadWishLists() {
				if (!this.userId)
					return;
				api.request("GET", "http://localhost:8080/user/" + this.userId, {}, this.setWishLists, this.errorHandle)
			},
			setWishLists(result) {
				data.wishlists = result['wishlists']
				this.$store.commit('setUser', result)
			},
			errorHandle(e, eMessage) {
				this.$router.push('/404');
				console.log(e)
			}
		},
		mounted: function () {
			data.userId = this.$route.params['userId']
			this.loadWishLists();
		},
		watch: {
			'$route' (to, from) {
				data.userId = to.params['userId']
				this.loadWishLists();
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