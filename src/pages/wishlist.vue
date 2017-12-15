<template>
	<div :id="'wishlist-' + wishlist.id">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>{{wishlist.name}}</span>
			</div>
			<el-collapse v-model="activeItem" accordion v-for="item in wishlist.items"
			             :key="item.id">
				<el-collapse-item :title="item.name" :name="item.id">
					<el-table :data="getItem(item)"
					          :showHeader="false"
					          emptyText="No description">
						<el-table-column
								prop="key">
						</el-table-column>
						<el-table-column
								prop="value">
						</el-table-column>
					</el-table>
				</el-collapse-item>
			</el-collapse>
			<div class="bottom clearfix" v-if="canAdd">
				<el-button
						type="text"
						class="button"
						@click="itemFormVisible=true">
					Add item
				</el-button>
			</div>
		</el-card>
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
					<el-button type="primary" @click="submitItem('itemCreateForm-' + wishlist.id)">Submit</el-button>
					<el-button @click="itemFormVisible = false">Cancel</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>
<script>
	import Ajax from '@/api'

	export default {
		components: {},
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
				formLabelWidth: '120px'
			}
		},
		props: {
			wishlist: {name: "", id: 0, items: []},
			canAdd: false
		},
		methods: {
			submitItem(formName) {
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
			getItem(item) {
				let keys = Object.keys(item);
				let itemView = [];
				keys.forEach(key => {
					if (item[key] && key !== 'id' && key !== 'name')
						itemView.push({key: key, value: item[key]})
				});
				return itemView;
			}
		},
		mounted: function () {
		}
	}

</script>