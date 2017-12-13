<template>
	<div id="page-content">
		<el-button type="text" @click="wishlistFormVisible = true">Create wishlist</el-button>
		<el-row :gutter="10">
			<div class="el-col el-col-6"
			     style="padding-left: 5px; padding-right: 5px;"
			     v-for="wishlist in wishlists">
				<div class="grid-content">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span>{{wishlist.name}}</span>
						</div>
						<!--<div  class="text item">-->
							<el-collapse v-model="activeItem" accordion v-for="item in wishlist.items" :key="item.id">
								<el-collapse-item :title="item.name" :name="item.id">
									<div v-if="item.description">{{item.description}}</div>
									<div v-if="item.link">{{item.link}}</div>
									<div v-if="item.price">{{item.price}}</div>
								</el-collapse-item>
							</el-collapse>
						<!--</div>-->
						<div class="bottom clearfix">
							<el-button
									type="text"
									class="button"
									@click="itemFormVisible=true; itemCreateForm.id = wishlist.id">
								Add item
							</el-button>
						</div>
					</el-card>
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
		<el-dialog :title="'Item: ' + itemCreateForm.name" :visible.sync="itemFormVisible">
			<el-form :model="itemCreateForm" ref="itemCreateForm" :rules="formRules">
				<el-form-item label="Item name" :label-width="formLabelWidth" prop="name">
					<el-input v-model="itemCreateForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Item description" :label-width="formLabelWidth" prop="description">
					<el-input v-model="itemCreateForm.description" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Item price" :label-width="formLabelWidth" prop="price">
					<el-input v-model="itemCreateForm.price" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Item link" :label-width="formLabelWidth" prop="link">
					<el-input v-model="itemCreateForm.link" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitItem('itemCreateForm')">Submit</el-button>
					<el-button @click="itemFormVisible = false">Cancel</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
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
				wishlists: [{name: "Blank", id: 0, items: []}],
				activeItem: "",
				userId: 0,
				wishlistFormVisible: false,
				itemFormVisible: false,
				wishlistCreateForm: {
					name: "",
				},
				itemCreateForm: {
					id: "",
					name: "",
					description: "",
					price: "",
					link: ""
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
			loadWishLists(userId) {
				if (Object.keys(userId).length !== 0)
					api.request("GET", "http://10.241.1.87:8080/user/" + userId + "/wishlist", {}, this.setWishLists, this.errorHandle, this.$store.state.token)
				else if (this.$store.state.user.id) {
					api.request("GET", "http://10.241.1.87:8080/user/" + this.$store.state.user.id + "/wishlist", {}, this.setWishLists, this.errorHandle, this.$store.state.token)
				}
			},
			setWishLists(result) {
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
						api.request("POST", "http://10.241.1.87:8080/user/" + userId + "/wishlist", wishlist, this.loadWishLists, this.errorHandle, this.$store.state.token)
					} else {
						return false;
					}
				});

			},
			submitItem(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.itemFormVisible = false;
						let item = {
							name: this.itemCreateForm.name,
							description: this.itemCreateForm.description,
							link: this.itemCreateForm.link,
							price: this.itemCreateForm.price
						};
						let userId = this.$store.state.user.id;
						api.request("POST", "http://10.241.1.87:8080/user/" + userId + "/wishlist/" + this.itemCreateForm.id + "/item",
							item,
							this.loadWishLists,
							this.errorHandle,
							this.$store.state.token)
					} else {
						return false;
					}
				});
			}
		},
		mounted: function () {
			if (!this.$store.state.token)
				this.$router.push('/registration/');
			else {
				console.log("push")
				this.loadWishLists(this.$store.state.user.id);
			}
		},
		watch: {
			'$route'(to, from) {
				console.log("watch")
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