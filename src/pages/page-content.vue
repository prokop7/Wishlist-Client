<template>
	<div id="page-content" v-loading.fullscreen.lock="globalLoading">
		<div class="column"
		     v-for="wishlist in wishlists">
			<div class="grid-content">
				<wishlist
						@commitEditingWishlist="commitEditingWishlist"
						@deleteWishlist="deleteWishlist"
						:isMine="isUser()"
						@moveWishlist="moveWishlist"
						:wishlist="wishlist">
				</wishlist>
			</div>
		</div>
		<el-button id="create-wishlist" v-if="isUser()" @click="wishlistFormVisible = true" style="margin-right: 20px">{{$t('createWishlist')}}</el-button>
		<no-wishlists v-if="wishlists.length === 0 && !isUser() && !globalLoading"></no-wishlists>
		<el-dialog :title="$t('wishlistName') + wishlistCreateForm.name"
		           :visible.sync="wishlistFormVisible">
			<el-form :model="wishlistCreateForm" ref="wishlistForm" :rules="formRules">
				<el-form-item :label="$t('wishlist.name')" :label-width="formLabelWidth" prop="name">
					<el-input type="textarea" autosize v-model="wishlistCreateForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item :label="$t('wishlist.visibility')" :label-width="formLabelWidth" prop="visibility">
					<el-select v-model="wishlistCreateForm.visibility"
					           placeholder="please select visibility">
						<el-option :label="$t('public')" value=2></el-option>
						<el-option :label="$t('private')" value=0></el-option>
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('wishlist.exclusions')"
				              :label-width="formLabelWidth"
				              prop="friend-exclusion">
					<el-select
							v-model="wishlistCreateForm.friendExclusion"
							multiple
							:clearable="true"
							:collapseTags="true"
							:placeholder="$t('select')"
							:noDataText="$t('noRegisteredFriends')"
							:noMatchText="$t('notFound')">
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
					<el-button type="primary" @click="createWishlist()">{{$t('save')}}</el-button>
					<el-button @click="wishlistFormVisible = false">{{$t('cancel')}}</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>
<script>
	import Ajax from "@/api"
	import Wishlist from "./wishlist.vue"
	import NoWishlists from "./no-wishlists.vue"
	import JwtDecode from 'jwt-decode'

	export default {
		components: {
			Wishlist,
			NoWishlists
		},
		data: function () {
			return {
				wishlists: [],
				loading: {
					user: false,
					wishlists: false,
					friends: false
				},
				userId: 0,
				wishlistFormVisible: false,
				wishlistCreateForm: {
					name: "",
					visibility: "2",
					friendExclusion: []
				},
				formRules: {
					name: [
						{required: true, message: this.$t('input.name'), trigger: 'blur'},
						{min: 3, message: this.$t('input.length'), trigger: 'blur'}
					],
					visibility: [
						{required: true, message: this.$t('input.visibility'), trigger: 'blur'}
					],
					friendExclusion: []
				},
				formLabelWidth: '160px',
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
							name: this.wishlistCreateForm.name.trim(),
							visibility: this.wishlistCreateForm.visibility,
							exclusions: exclusions
						};
						let _this = this;
						Ajax.addWishlist(
							userId,
							wishlist,
							(data) => {
								_this.$message({message: _this.$t('messages.wishlistCreated'), showClose: true,});
								_this.addWishlist(data)
							},
							this.errorHandle);
						this.wishlistCreateForm = {
							name: "",
							visibility: "2",
							friendExclusion: []
						}
					} else {
						return false;
					}
				});
			},
			addWishlist(response) {
				this.wishlists.push(response);
			},
			commitEditingWishlist(wishlist) {
				let i = this.wishlists.findIndex((w1) => w1.id === wishlist.id);
				wishlist.items = this.wishlists[i].items;
				wishlist.wishlsitOrder = this.wishlists[i].wishlsitOrder;
				this.wishlists.splice(i, 1, wishlist);
			},
			deleteWishlist(wishlist) {
				let _this = this;
				Ajax.deleteWishlist(
					this.$store.state.user.id,
					wishlist.id,
					() => {
						_this.wishlists.splice(wishlist.wishlistOrder, 1);
						let length = _this.wishlists.length;
						for (let i = 0; i < length; i++)
							_this.wishlists[i].wishlistOrder = i;
					},
					(e) => console.log(e)
				)
			},
			isUser() {
				return this.$route.params['userId'] == this.$store.state.user.id;
			},
			setWishlistNames() {
				this.wishlistNames = [];
				this.wishlists.forEach(w => this.wishlistNames.push(w.name));
				this.loading.wishlists = false;
			},
			loadUser(userId) {
				this.loading.user = true;
				this.loading.friends = true;
				Ajax.getUser(userId, this.setUser, this.error);
				Ajax.getUserFriends(userId, this.setUserFriends, this.error);
			},
			setUserFriends(result) {
				this.$store.commit('friends', result);
				this.loading.friends = false;
			},
			setUser(result) {
				this.$store.commit('setUser', result);
				this.loading.user = false;
			},
			moveWishlist(wishlist, direction) {
				let i = wishlist.wishlistOrder;
				let _this = this;
				let checkBoundaries = function (index) {
					return index >= 0 && index < _this.wishlists.length
				};
				if (direction > 0) {
					if (checkBoundaries(this.wishlists[i].wishlistOrder + 1) &&
						checkBoundaries(this.wishlists[i + 1].wishlistOrder - 1)) {
						this.wishlists[i].wishlistOrder++;
						this.wishlists[i + 1].wishlistOrder--;
						this.wishlists.sort(function (w1, w2) {
							return w1.wishlistOrder - w2.wishlistOrder
						});
						this.sendWishlistsOrder()
					}
				} else {
					if (checkBoundaries(this.wishlists[i].wishlistOrder - 1) &&
						checkBoundaries(this.wishlists[i - 1].wishlistOrder + 1)) {
						this.wishlists[i].wishlistOrder--;
						this.wishlists[i - 1].wishlistOrder++;
						this.wishlists.sort(function (w1, w2) {
							return w1.wishlistOrder - w2.wishlistOrder
						});
						this.sendWishlistsOrder()
					}
				}
			},
			sendWishlistsOrder() {
				let orders = [];
				this.wishlists.forEach(wishlist => orders.push({
					id: wishlist.id,
					wishlistOrder: wishlist.wishlistOrder
				}));
				let _this = this;
				Ajax.sendWishlistsOrder(
					this.$store.state.user.id,
					orders,
					() => _this.$message({
						message: _this.$t('messages.orderUpdated'),
						showClose: true,
					}),
					(e) => console.log(e)
				)
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
					this.loading.wishlists = true;
					this.loadWishlists(this.$route.params['userId']);
				}
			}
			this.wishlists.sort(function (w1, w2) {
				return w1.wishlistOrder - w2.wishlistOrder
			})
		},
		computed: {
			globalLoading() {
				return this.loading.user || this.loading.friends || this.loading.wishlists
			}
		},
		watch: {
			'$route'(to, from) {
				this.loading.wishlists = true;
				this.loadWishlists(to.params['userId']);
			}
		}
	}
</script>

<style lang="scss">
	#page-content {
		text-align: left;
		white-space: nowrap;
		width: 100%;
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

	.el-dialog__header {
		/*padding: 15px 15px 10px;*/
		word-wrap: break-word;
		white-space: normal;
	}

	.el-dialog__body {
		padding-bottom: 2px !important;
		padding-top: 2px !important;
	}

	#page-content {
		background: -moz-element(#no-wishlists);
	}

	.el-dialog {
		min-width: 400px;
	}
</style>