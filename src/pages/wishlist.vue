<template>
	<div :id="'wishlist-' + wishlist.id">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>{{wishlist.name}}</span>
			</div>
			<div class="item"
			     :id="'item-' + wishlist.id + '-' + item.id"
			     v-for="item in wishlist.items"
			     :key="item.id" :style="'background-color:' + getItemColor(item)">
				<el-button @click="displayItem(item);setListener();" type="text">{{item.name}}</el-button>
				<el-button v-if="!isMine&&(item.state!==2&&item.state!==1)"
				           @click="takeItem(item, wishlist.id)"
				           size="mini"
				           :type="item.state === 0 ? 'primary' : 'danger'"
				           style="float: right;margin-top: 7px">
					{{item.state === 0 ? 'Take' : 'Cancel'}}
				</el-button>
				<el-button v-if="isMine&&item.state!==2"
				           @click="acceptReceiving(item, wishlist.id)"
				           type="success"
				           size="mini"
				           style="float: right;margin-top: 7px">
					Accept
				</el-button>
			</div>
			<div class="bottom clearfix" v-if="isMine">
				<el-button
						type="text"
						class="button"
						@click="itemCreateVisible=true;setListener();">
					Add item
				</el-button>
			</div>
		</el-card>
		<el-dialog
				:title="isMine?'Edit':'View'"
				:visible.sync="itemVisible"
				width="50%"
				center
				v-if="itemVisibleObject">
			<el-form :model="itemVisibleObject" :ref="'itemEditForm'" :rules="formRules">
				<el-form-item label="Item name" :label-width="formLabelWidth" prop="name">
					<el-input :disabled="!isMine" v-model="itemVisibleObject.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Item description" :label-width="formLabelWidth" prop="description">
					<el-input :disabled="!isMine" v-model="itemVisibleObject.description"
					          auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Item price" :label-width="formLabelWidth" prop="price">
					<el-input :disabled="!isMine" v-model="itemVisibleObject.price" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Item link" :label-width="formLabelWidth" prop="link">
					<el-input :disabled="!isMine" v-model="itemVisibleObject.link" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item v-if="isMine">
					<el-button type="primary" @click="editItem();removeListener();" :autofocus="true">Save
					</el-button>
					<el-button @click="itemVisible=false;removeListener();">Cancel</el-button>
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
	import ElButton from "../../node_modules/element-ui/packages/button/src/button.vue";

	export default {
		components: {ElButton},
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
					]
				},
				formLabelWidth: '120px',
				itemVisible: false,
				itemVisibleObject: {
					id: "",
					name: "",
					description: "",
					price: "",
					link: ""
				},
				takeItemObjects: {}
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
								_this.$emit('loadWishlists', data)
							},
							this.errorHandle);
						this.itemCreateForm = {}
					} else {
						return false;
					}
				});
			},
			editItem() {
				this.$refs['itemEditForm'].validate((valid) => {
					if (valid) {
						this.itemVisible = false;
						let _this = this;
						Ajax.editItem(
							this.$store.state.user.id,
							this.wishlist.id,
							this.itemVisibleObject.id,
							this.itemVisibleObject,
							function (data) {
								_this.$emit('loadWishlists', data)
							},
							this.errorHandle);
					} else {
						return false;
					}
				});
			},
			getItem(item) {
				if (!item)
					return [];
				let keys = Object.keys(item);
				let itemView = [];
				keys.forEach(key => {
					if (item[key] && key !== 'id' && key !== 'name')
						itemView.push({key: key, value: item[key]})
				});
				return itemView;
			},
			displayItem(item) {
				this.itemVisibleObject = item;
				this.itemVisible = true;
			},
			takeItem(item, wishlistId) {
				let userId = this.$route.params['userId'];
				let newState = -1;
				if (item.state === 0) {
					newState = 1;
				} else if (item.state === 3) {
					newState = 0;
				} else return;
				Ajax.changeItemState(
					userId,
					wishlistId,
					item.id,
					newState,
					function () {
						item.state = newState ? 3 : 0;
					},
					this.errorCallback)
			},
			acceptReceiving(item, wishlistId) {
				let userId = this.$route.params['userId'];
				Ajax.changeItemState(
					userId,
					wishlistId,
					item.id,
					2,
					function () {
						item.state = 2;
					},
					this.errorCallback)
			},
			errorCallback(e) {
				console.log(e);
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
			},
			getItemColor(item) {
				if (item.state === 3)
					return '#c4e1fb';
				else if (item.state === 2)
					return '#EDEFF0';
				else if (item.state === 1)
					return '#EDEFF0';
				else if (item.state === 0)
					return '#FFFFFF';
				else
					return '#000000'
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
		/*display: flex;*/
		justify-content: flex-start;
		align-items: flex-start;
		background-color: #FFFFFF;
		color: #4d4d4d;
		border-radius: 3px;
		border: #ffffff;
		outline: none;
		opacity: 1;
		width: 90%;
		padding: 3% 4%;
		min-height: 17px;
		margin: 0 auto 7px auto;
		cursor: pointer;
		/*font-family: 'Open Sans', sans-serif;*/
		font-weight: 400;
		font-size: 12px;
	}

	.el-card__body {
		padding: 0 10px;
		overflow-y: auto;
		max-height: 70vh;
	}

	.box-card {
		width: 100%;
		background-color: #E2E4E6;
	}
</style>