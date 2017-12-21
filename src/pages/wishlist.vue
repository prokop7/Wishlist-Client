<template>
	<div :id="'wishlist-' + wishlist.id">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>{{wishlist.name}}</span>
				<el-button v-if="isMine"
				           @click="displayWishlist()"
				           id="edit-button"
				           icon="el-icon-edit"
				           size="mini">
				</el-button>
			</div>
			<div class="items-body">
				<item v-for="item in wishlist.items"
				      :key="item.id"
				      :item="item"
				      :wishlistId="wishlist.id"
				      :userId="$route.params['userId']"
				      :isMine="isMine">
				</item>
			</div>
			<div class="card-footer">
				<div class="bottom clearfix" v-if="isMine">
					<el-button
							type="text"
							class="button"
							@click="itemCreateVisible=true;setListener();">
						Add item
					</el-button>
				</div>
			</div>
		</el-card>
		<el-dialog :title="'Wishlist: ' + wishlistEditForm.name"
		           :visible.sync="wishlistFormVisible">
			<el-form :model="wishlistEditForm" ref="wishlistEditForm" :rules="formRules">
				<el-form-item label="Wishlist name" :label-width="formLabelWidth" prop="name">
					<el-input v-model="wishlistEditForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Visibility" :label-width="formLabelWidth" prop="visibility">
					<el-select v-model="wishlistEditForm.visibility"
					           placeholder="please select visibility">
						<el-option label="Public" value=2></el-option>
						<el-option label="Private" value=0></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="Friend exclusion"
				              :label-width="formLabelWidth"
				              prop="friend-exclusion">
					<el-select
							v-model="wishlistEditForm.friendExclusion"
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
					<el-button type="primary" @click="editWishlist(wishlist)">Submit</el-button>
					<el-button @click="wishlistFormVisible=false">Cancel</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<el-dialog :title="'Item: ' + itemCreateForm.name"
		           :visible.sync="itemCreateVisible">
			<el-form :model="itemCreateForm" :ref="'itemCreateForm'" :rules="formRules">
				<el-form-item label="Item name" :label-width="formLabelWidth" prop="name">
					<el-input v-model="itemCreateForm.name" auto-complete="off" :autofocus="true"></el-input>
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
					<el-button type="primary" @click="createItem();removeListener()">Save</el-button>
					<el-button @click="itemCreateVisible = false;removeListener()">Cancel</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>
<script>
	import Ajax from '@/api'
	import Item from './item.vue'

	export default {
		components: {
			Item
		},
		props: {
			wishlist: {name: "", id: 0, items: []},
			isMine: false
		},
		data: function () {
			return {
				activeItem: "",
				itemCreateVisible: false,
				itemCreateForm: {
					name: "",
					description: "",
					price: "",
					link: ""
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
				takeItemObjects: {},
				wishlistFormVisible: false,
				wishlistEditForm: {
					name: "",
					visibility: "",
					friendExclusion: []
				}
			}
		},
		methods: {
			createItem() {
				this.$refs['itemCreateForm'].validate((valid) => {
					if (valid) {
						this.itemCreateVisible = false;
						let _this = this;
						Ajax.addItem(
							this.$store.state.user.id,
							this.wishlist.id,
							this.itemCreateForm,
							function (data) {
								_this.$message({message: 'The item was created', showClose: true,});
								_this.$emit('loadWishlists', data)
							},
							this.errorHandle);
						this.itemCreateForm = {}
					} else {
						return false;
					}
				});
			},
			displayWishlist() {
				this.wishlistEditForm = {
					name: this.wishlist.name,
					visibility: this.wishlist.visibility === 'PUBLIC' ? '2' : '0',
					friendExclusion: []
				};
				console.log(this.wishlistEditForm);
				this.wishlist.exclusions.forEach(excl => this.wishlistEditForm.friendExclusion.push(excl.id));
				this.wishlistFormVisible = true;
				this.setListener()
			},
			editWishlist() {
				this.$refs['wishlistEditForm'].validate((valid) => {
					if (valid) {
						this.wishlistFormVisible = false;
						let _this = this;
						let userId = this.$store.state.user.id;
						let exclusions = [];
						this.wishlistEditForm.friendExclusion.forEach(exclusion => exclusions.push({id: exclusion}));
						let wishlist = {
							id: this.wishlist.id,
							name: this.wishlistEditForm.name,
							visibility: this.wishlistEditForm.visibility,
							exclusions: exclusions
						};
						Ajax.editWishlist(
							userId,
							this.wishlist.id,
							wishlist,
							() => {
								_this.$message({message: 'The wishlist was edited', showClose: true,});
								_this.$emit('loadWishlists', userId)
							},
							this.errorHandle);
						this.wishlistEditForm = {
							id: "",
							name: "",
							visibility: "",
							friendExclusion: []
						}
					} else {
						return false;
					}
				});
			},
			setListener() {
				window.addEventListener('keyup', this.keyListener);
			},
			removeListener() {
				window.removeEventListener('keyup', this.keyListener)
			},
			keyListener(event) {
				if (event.keyCode === 13)
					if (this.itemVisible && this.isMine)
						this.editItem();
					else if (this.itemCreateVisible)
						this.createItem();
					else if (this.wishlistFormVisible)
						this.editWishlist();
			}
		},
		mounted: function () {
		},

		beforeDestroy: function () {
			this.removeListener()
		}
	}

</script>

<style lang="scss">
	.item {
		justify-content: flex-start;
		align-items: flex-start;
		background-color: #FFFFFF;
		color: #4d4d4d;
		border-radius: 3px;
		border: #ffffff;
		outline: none;
		opacity: 1;
		width: 95%;
		padding: 1% 3%;
		min-height: 17px;
		margin: 0 auto 7px auto;
		cursor: pointer;
		font-weight: 400;
		font-size: 12px;
	}

	.el-card__body {
		padding: 0 10px;
	}

	.items-body {
		overflow-y: scroll;
		overflow-x: hidden;
		max-height: 70vh;
	}

	.el-card__header {
		padding-top: 8px;
		padding-bottom: 8px;
		padding-left: 16px;
	}

	#edit-button {
		float: right;
		background-color: rgba(0, 0, 0, 0);
		border: none;
		padding: 4px 0 0;
	}

	.box-card {
		width: 100%;
		background-color: #E2E4E6;
	}
</style>