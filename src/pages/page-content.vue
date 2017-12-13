<template>
	<div id="page-content">
		<el-row :gutter="10">
			<div class="el-col el-col-4"
			     style="padding-left: 5px; padding-right: 5px;"
			     v-for="wishlist in wishlists">
				<div class="grid-content">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span>{{wishlist.name}}</span>
						</div>
						<div v-for="item in wishlist.items" :key="item.id" class="text item">
							{{item.name}}
						</div>
					</el-card>
				</div>
			</div>
		</el-row>
	</div>
</template>
<script>
	import ElButton from "../../node_modules/element-ui/packages/button/src/button.vue";
	import api from "@/api"
	import ElCol from "element-ui/packages/col/src/col";

	export default {
		components: {
			ElCol,
			ElButton
		},
		data: function () {
			return {
				wishlists: [{name: "Blank", id: 0, items: []}],
				userId: 0
			};
		},
		methods: {
			loadWishLists(userId) {
				api.request("GET", "http://localhost:8080/user/" + userId, {}, this.setWishLists, this.errorHandle, this.$store.state.token)
			},
			setWishLists(result) {
				this.wishlists = result['wishlists']
				this.resize();
			},
			setUser(result) {
				this.wishlists = result['wishlists']
				this.$store.commit('setUser', result)
				this.resize();
			},
			resize() {
				let count = this.wishlists.length;
				if (count > 6) {
					document.getElementById('app').style.width = count / 6.0 * 100 + "%";
				} else
					document.getElementById('app').style.width = '100%';
			},
			errorHandle(e, eMessage) {
				this.$router.push('/404');
				console.log(e)
				console.log(eMessage)
			}
		},
		mounted: function () {
			this.loadWishLists(this.$route.params['userId']);
		},
		watch: {
			'$route'(to, from) {
				this.loadWishLists(to.params['userId']);
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
		width: 100%;
	}

	.el-row {
		margin-bottom: 20px;
		&:last-child {
			margin-bottom: 0;
		}
	}

	.el-col {
		border-radius: 4px;
	}
</style>