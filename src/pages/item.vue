<template>
	<div id="item">
		<div class="item" :style="'background-color:' + itemColor">
			<div class="item-name"
					@click="itemVisible=true;setListener();">
				<p>{{item.name}}</p>
			</div>
			<el-button class="item-action-button" v-if="(item.state!==2&&item.state!==1)"
			           @click="changeItemState()"
			           size="mini"
			           :type="buttonType">
				{{buttonText}}
			</el-button>
		</div>

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
					<el-button type="primary" @click="editItem(true);removeListener();" :autofocus="true">Save
					</el-button>
					<el-button @click="itemVisible=false;removeListener();">Cancel</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>
<style lang="scss">
	.item-name {
		font-size: 14px;
		min-height: 40px;
		display: inline-block;
		width: 65%;
		white-space: normal;
		overflow-wrap: break-word;
	}

	.item-action-button {
		vertical-align: middle;
	}
</style>
<script>
	import Ajax from "../api/index";

	export default {
		components: {},
		props: {
			item: Object,
			isMine: Boolean,
			wishlistId: Number,
			userId: String
		},
		data() {
			return {
				itemVisible: false,
				formLabelWidth: '120px',
				formRules: {
					name: [
						{required: true, message: 'Please input a name', trigger: 'blur'},
						{min: 3, message: 'Length should be at least 3 character', trigger: 'blur'}
					],
				},
				previousName: ""
			}
		},
		methods: {
			editItem(validation) {
				let _this = this;
				let submit = function () {
					_this.itemVisible = false;
					Ajax.editItem(
						_this.$store.state.user.id,
						_this.wishlistId,
						_this.itemVisibleObject.id,
						_this.itemVisibleObject,
						data => {
							const h = _this.$createElement;

							_this.$notify({
								title: 'Saved',
								message: h('i', { style: 'color: teal' }, 'The item was saved')
							});
							_this.$emit('loadWishlists', data)
						},
						e => console.log(e));
				};
				if (validation)
					this.$refs['itemEditForm'].validate((valid) => {
						if (valid) submit()
					});
				else
					submit()
			},
			changeItemState() {
				let newState = -1;
				if (this.isMine)
					newState = 2;
				else if (this.item.state === 0) {
					newState = 1;
				} else if (this.item.state === 3) {
					newState = 0;
				} else return;
				let _this = this;
				Ajax.changeItemState(
					this.userId,
					this.wishlistId,
					this.item.id,
					newState,
					() => _this.item.state = newState === 1 ? 3 : newState,
					(e) => console.log(e))
			},
			setListener() {
				window.addEventListener('keyup', this.keyListener);
			},
			removeListener() {
				window.removeEventListener('keyup', this.keyListener)
			},
			keyListener(event) {
				console.log(event);
				if (event.keyCode === 13)
					if (this.itemVisible && this.isMine)
						this.editItem();
					else if (this.itemCreateVisible)
						this.createItem();
					else if (this.wishlistFormVisible)
						this.editWishlist();
			}
		},
		computed: {
			itemColor() {
				let state = this.item.state;
				if (state === 3)
					return '#c4e1fb';
				else if (state === 2)
					return '#EDEFF0';
				else if (state === 1)
					return '#EDEFF0';
				else if (state === 0)
					return '#FFFFFF';
				else
					return '#000000'
			},
			itemVisibleObject() {
				return this.item
			},
			buttonType() {
				let state = this.item.state;
				if (state === 3)
					return 'danger';
				if (state === 0)
					if (this.isMine)
						return 'success';
					else
						return 'primary';
				return '';
			},
			buttonText() {
				let state = this.item.state;
				if (state === 3)
					return 'Cancel';
				if (state === 0)
					if (this.isMine)
						return 'Accept';
					else
						return 'Take';
				return '';
			}
		}
	}
</script>
