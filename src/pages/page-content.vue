<template>
	<div id="page-content" style="white-space: nowrap">
		<!--<el-row :gutter="10" >-->
			<div class="column"
			     v-for="wishlist in wishlists">
				<div class="grid-content">
					<wishlist
							@loadWishlists="loadWishlists"
							:isMine="isUser()"
							:wishlist="wishlist">
					</wishlist>
				</div>
			</div>
		<!--</el-row>-->
		<el-button id="create-wishlist" v-if="isUser()" @click="wishlistFormVisible = true">Create wishlist</el-button>
		<el-dialog :title="'Wishlist: ' + wishlistCreateForm.name" :visible.sync="wishlistFormVisible">
			<el-form :model="wishlistCreateForm" ref="wishlistForm" :rules="formRules">
				<el-form-item label="Wishlist name" :label-width="formLabelWidth" prop="name">
					<el-input v-model="wishlistCreateForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitWishlist('wishlistForm')">Submit</el-button>
					<el-button @click="wishlistFormVisible = false">Cancel</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>
<script>
	import ElButton from "../../node_modules/element-ui/packages/button/src/button.vue";
	import Ajax from "@/api"
	import ElCol from "element-ui/packages/col/src/col";
	import Wishlist from "./wishlist.vue"

	export default {
		components: {
			ElCol,
			ElButton,
			Wishlist
		},
		data: function () {
			let validateName = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('Please input the name'));
				} else {
					if (value.length < 3) {
						callback(new Error('Name should be at least 3 symbol'));
					}
					callback();
				}
			};
			return {
				wishlists: [{name: "", id: 0, items: []}],
				userId: 0,
				wishlistFormVisible: false,
				wishlistCreateForm: {
					name: "",
				},
				formRules: {
					name: [
						{required: true, message: 'Please input a name', trigger: 'blur'},
						{min: 3, message: 'Length should be at least 3 character', trigger: 'blur'}
					]
				},
				formLabelWidth: '120px',
				stages: ['on-hold', 'in-progress', 'needs-review', 'approved'],
				blocks: [
					{
						id: 10,
						status: 'Wishlist 1',
						title: 'Test',
					},
				],
				wishlistNames: ['on-hold', 'in-progress', 'needs-review', 'approved']
			};
		},
		methods: {
			loadWishlists(userId) {
				if (Object.keys(userId).length !== 0)
					Ajax.getWishlists(userId, this.setWishlists, this.errorHandle);
				else if (this.$store.state.user.id) {
					Ajax.getWishlists(this.$store.state.user.id, this.setWishlists, this.errorHandle)
				}
			},
			setWishlists(result) {
				this.wishlists = result;
				this.resize();
				this.setWishlistNames();
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
			},
			submitWishlist(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.wishlistFormVisible = false;
						let wishlist = {name: this.wishlistCreateForm.name};
						let userId = this.$store.state.user.id;
						Ajax.addWishlist(userId, wishlist, this.loadWishlists, this.errorHandle)
					} else {
						return false;
					}
				});

			},
			isUser() {
				return this.$route.params['userId'] == this.$store.state.user.id;
			},
			setWishlistNames() {
				this.wishlistNames = [];
				this.wishlists.forEach(w => this.wishlistNames.push(w.name));
			}
		},
		mounted: function () {
			if (!this.$store.state.token)
				this.$router.push('/registration/');
			else {
				Ajax.setToken(this.$store.state.token);
				this.loadWishlists(this.$store.state.user.id);
			}
		},
		watch: {
			'$route'(to, from) {
				this.loadWishlists(to.params['userId']);
			}
		}
	}
</script>

<style lang="scss">
	#page-content {
		text-align: left;
	}

	.text {
		font-size: 14px;
	}

	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}

	.clearfix:after {
		clear: both
	}


	.column {
		border-radius: 4px;
		padding-left: 5px;
		padding-right: 5px;
		width: 350px;
		display: inline-block;
		vertical-align: top;
		/*float: left;*/
	}

	#create-wishlist {
		display: inline-block;
	}
</style>