<template>
	<div :id="'wishlist-' + wishlist.id">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>{{wishlist.name}}</span>
			</div>
			<div class="item"
			     v-for="item in wishlist.items"
			     :key="item.id">
				<el-button @click="displayItem(item);" type="text">{{item.name}}</el-button>
			</div>
			<!--<el-collapse v-model="activeItem" accordion v-for="item in wishlist.items"-->
			<!--:key="item.id">-->
			<!--<el-collapse-item :title="item.name" :name="item.id">-->
			<!--<el-table :data="getItem(item)"-->
			<!--:showHeader="false"-->
			<!--emptyText="No description">-->
			<!--&lt;!&ndash;<el-table-column&ndash;&gt;-->
			<!--&lt;!&ndash;prop="key">&ndash;&gt;-->
			<!--&lt;!&ndash;</el-table-column>&ndash;&gt;-->
			<!--<el-table-column-->
			<!--prop="value">-->
			<!--</el-table-column>-->
			<!--</el-table>-->
			<!--</el-collapse-item>-->
			<!--</el-collapse>-->
			<div class="bottom clearfix" v-if="canAdd">
				<el-button
						type="text"
						class="button"
						@click="itemFormVisible=true">
					Add item
				</el-button>
			</div>
		</el-card>
		<el-dialog
				title="Edit"
				:visible.sync="itemVisible"
				width="50%"
				center
				v-if="itemVisibleObject">
			<el-form :model="itemVisibleObject" :ref="'itemEditForm-' + wishlist.id" :rules="formRules">
				<el-form-item label="Item name" :label-width="formLabelWidth" prop="name">
					<el-input v-model="itemVisibleObject.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Item description" :label-width="formLabelWidth" prop="description">
					<el-input v-model="itemVisibleObject.description" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Item price" :label-width="formLabelWidth" prop="price">
					<el-input v-model="itemVisibleObject.price" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Item link" :label-width="formLabelWidth" prop="link">
					<el-input v-model="itemVisibleObject.link" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="editItem('itemEditForm-' + wishlist.id)">Submit</el-button>
					<el-button @click="itemVisible=false">Cancel</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<el-dialog :title="'Item: ' + itemCreateForm.name" :visible.sync="itemFormVisible">
			<el-form :model="itemCreateForm" :ref="'itemCreateForm-' + wishlist.id" :rules="formRules">
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
					<el-button type="primary" @click="createItem('itemCreateForm-' + wishlist.id)">Submit</el-button>
					<el-button @click="itemFormVisible = false">Cancel</el-button>
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
		data: function () {
			return {
				activeItem: "",
				itemFormVisible: false,
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
				}
			}
		},
		props: {
			wishlist: {name: "", id: 0, items: []},
			canAdd: false
		},
		methods: {
			createItem(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.itemFormVisible = false;
						let _this = this;
						Ajax.addItem(
							this.$store.state.user.id,
							this.wishlist.id,
							this.itemCreateForm,
							function (data) {
								_this.$emit('loadWishlists', data)
							},
							this.errorHandle);
					} else {
						return false;
					}
				});
			},
			editItem(formName) {
				this.$refs[formName].validate((valid) => {
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
			}
		},
		mounted: function () {
		}
	}

</script>

<style lang="scss">
	.item {
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		background-color: #FFFFFF;
		color: #4d4d4d;
		border-radius: 3px;
		border: none;
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
	}

	.box-card {
		width: 100%;
		background-color: #d9dee3;
	}
</style>