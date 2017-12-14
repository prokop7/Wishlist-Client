<template>
	<div id="page-content">
		<el-button type="text" @click="wishlistFormVisible = true">Create wishlist</el-button>
		<el-row :gutter="10">
			<div class="el-col el-col-6"
			     style="padding-left: 5px; padding-right: 5px;"
			     v-for="wishlist in wishlists">
				<div class="grid-content">
					<wishlist
							@loadWishlists="loadWishlists"
							:wishlist="wishlist">
					</wishlist>
				</div>
			</div>
		</el-row>
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
				formLabelWidth: '120px'
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
		},
		mounted: function () {
			if (!this.$store.state.token)
				this.$router.push('/registration/');
			else {
				console.log("push")
				Ajax.setToken(this.$store.state.token);
				this.loadWishlists(this.$store.state.user.id);
			}
		},
		watch: {
			'$route'(to, from) {
				console.log("watch")
				this.loadWishlists(to.params['userId']);
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