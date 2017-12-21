<template>
	<div id="page-content">
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
		<el-button id="create-wishlist" v-if="isUser()" @click="wishlistFormVisible = true">Create wishlist</el-button>
		<el-dialog :title="'Wishlist: ' + wishlistCreateForm.name"
		           :visible.sync="wishlistFormVisible">
			<el-form :model="wishlistCreateForm" ref="wishlistForm" :rules="formRules">
				<el-form-item label="Wishlist name" :label-width="formLabelWidth" prop="name">
					<el-input v-model="wishlistCreateForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Visibility" :label-width="formLabelWidth" prop="visibility">
					<el-select v-model="wishlistCreateForm.visibility"
					           placeholder="please select visibility">
						<el-option label="Public" value=2></el-option>
						<el-option label="Private" value=0></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="Friend exclusion"
				              :label-width="formLabelWidth"
				              prop="friend-exclusion">
					<el-select
							v-model="wishlistCreateForm.friendExclusion"
							multiple
							:clearable="true"
							placeholder="Select"
							noDataText="No registered friends"
							noMatchText="Not found">
						<el-option
								v-for="friend in this.$store.getters.friends"
								v-if="friend.registered"
								:key="friend.id"
								:label="friend.name"
								:value="friend.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="createWishlist()">Submit</el-button>
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
	import JwtDecode from 'jwt-decode'

	export default {
		components: {
			ElCol,
			ElButton,
			Wishlist
		},
		data: function () {
			return {
				wishlists: [{name: "", id: 0, items: []}],
				userId: 0,
				wishlistFormVisible: false,
				wishlistCreateForm: {
					name: "",
					visibility: "",
					friendExclusion: []
				},
				formRules: {
					name: [
						{required: true, message: 'Please input a name', trigger: 'blur'},
						{min: 3, message: 'Length should be at least 3 character', trigger: 'blur'}
					],
					visibility: [
						{required: true, message: 'Please select visibility option', trigger: 'blur'}
					],
					friendExclusion: []
				},
				formLabelWidth: '120px',
			};
		},
		methods: {
			loadWishlists(userId) {
				if (Object.keys(userId).length !== 0) {
					Ajax.getWishlists(userId, this.setWishlists, this.errorHandle);
				}
				else if (this.$store.state.user.id) {
					Ajax.getWishlists(this.$store.state.user.id, this.setWishlists, this.errorHandle)
				}
			},
			setWishlists(result) {
				this.wishlists = result;
				this.setWishlistNames();
			},
			errorHandle(e) {
				this.$router.push('/404');
				console.log(e)
			},
			createWishlist() {
				this.$refs['wishlistForm'].validate((valid) => {
					if (valid) {
						this.wishlistFormVisible = false;
						let userId = this.$store.state.user.id;
						let exclusions = [];
						this.wishlistCreateForm.friendExclusion.forEach(exclusion => exclusions.push({id: exclusion}));
						let wishlist = {
							name: this.wishlistCreateForm.name,
							visibility: this.wishlistCreateForm.visibility,
							exclusions: exclusions
						};
						Ajax.addWishlist(userId, wishlist, this.loadWishlists, this.errorHandle);
						this.wishlistCreateForm = {
							name: "",
							visibility: "",
							friendExclusion: []
						}
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
			},
			loadUser(userId) {
				Ajax.getUser(userId, this.setUser, this.error);
				Ajax.getUserFriends(userId, this.setUserFriends, this.error);
			},
			setUserFriends(result) {
				this.$store.commit('friends', result);
			},
			setUser(result) {
				this.$store.commit('setUser', result);
			}
		},
		mounted: function () {
			if (localStorage.getItem('token')) {
				let token = localStorage.getItem('token');
				Ajax.setToken(token);
				this.$store.commit('token', token);
				this.loadUser(JwtDecode(token).sub)
			}
			if (!this.$store.state.token) {
				console.log('SEND TO REGISTRATION');
				this.$router.push('/registration/');
			}
			else {
				Ajax.setToken(this.$store.state.token);
				if (!this.$route.params['userId']) {
					this.$router.push('/user/' + JwtDecode(this.$store.state.token).sub);
				} else {
					this.loadWishlists(this.$route.params['userId']);
				}
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
		white-space: nowrap;
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
		width: 270px;
		display: inline-block;
		vertical-align: top;
		/*float: left;*/
	}

	#create-wishlist {
		display: inline-block;
		color: rgb(179, 211, 229);
		border: none;
		background-color: rgba(0, 0, 0, 0.15);
	}
	#create-wishlist:hover {
		background-color: rgba(0, 0, 0, 0.30);
	}
</style>