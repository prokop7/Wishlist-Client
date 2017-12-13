<template>
	<div id="page-content">
		<el-button type="text" @click="dialogFormVisible = true">Create wishlist</el-button>
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
		<el-dialog :title="'Wishlist: ' + form.name" :visible.sync="dialogFormVisible">
			<el-form :model="form" ref="wishlistForm" :rules="formRules">
				<el-form-item label="Wishlist name" :label-width="formLabelWidth" prop="name">
					<el-input v-model="form.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitWishlist('wishlistForm')">Submit</el-button>
					<el-button @click="dialogFormVisible = false">Cancel</el-button>
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
				userId: 0,
				dialogFormVisible: false,
				form: {
					name: "",
				},
				formRules: {
					name: [
						{required: true, message: 'Please input Wishlist name', trigger: 'blur'},
						{min: 3, message: 'Length should be at least 3 character', trigger: 'blur'}
					]
				},
				formLabelWidth: '120px'
			};
		},
		methods: {
			loadWishLists(userId) {
//				console.log(Object.keys(userId).length !== 0);
				if (Object.keys(userId).length !== 0)
					api.request("GET", "http://localhost:8080/user/" + userId + "/wishlist", {}, this.setWishLists, this.errorHandle, this.$store.state.token)
				else if (this.$store.state.user.id) {
					console.log(this.$store.state.user.id);
					api.request("GET", "http://localhost:8080/user/" + this.$store.state.user.id + "/wishlist", {}, this.setWishLists, this.errorHandle, this.$store.state.token)
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
						this.dialogFormVisible = false;
						let wishlist = {name: this.form.name};
						let userId = this.$store.state.user.id;
						api.request("POST", "http://localhost:8080/user/" + userId + "/wishlist", wishlist, this.loadWishLists, this.errorHandle, this.$store.state.token)
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