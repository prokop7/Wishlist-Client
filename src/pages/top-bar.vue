<template>
	<div id="top-bar">
		<el-menu
				class="el-menu-demo"
				mode="horizontal"
				menuTrigger="click"
				@select="selectedMenu"
				background-color="#545c64"
				text-color="#fff"
				active-text-color="#ffd04b">
			<el-menu-item index="photo"
			              v-if="isSigned()"
			              :route="/user/ + $store.state.user.id">
				<img :src="$store.state.user.photoLink" style="height: 50px; padding-bottom: 5px" alt="">
			</el-menu-item>
			<el-menu-item index="user"
			              v-if="isSigned()"
			              :route="/user/ + $store.state.user.id">
				{{$store.state.user.name}}
			</el-menu-item>
			<el-menu-item index="friends"
			              @click=""
			              v-if="isSigned()"
			              route="#">
				<el-select v-model="optionValue"
				           filterable
				           placeholder="Friends"
				           @change="selectChange"
				           noDataText="No registered friends">
					<el-option-group label="Registered">
						<el-option
								v-for="friend in $store.getters.friends"
								:key="friend.id"
								:label="friend.name"
								:value="friend.id"
								v-if="friend.registered"
						>
						</el-option>
					</el-option-group>
					<el-option-group label="Not registered">
						<el-option
								v-for="friend in $store.getters.friends"
								:key="friend.id"
								:label="friend.name"
								:value="friend.id"
								v-if="!friend.registered"
								:disabled="!friend.registered"
						>
						</el-option>
					</el-option-group>

				</el-select>
			</el-menu-item>
			<el-menu-item
					index="login"
					id="login-link">
				<a :href="loginRef()"
				   target="_self">{{isSigned() ? "Logout" : "Login"}}</a>
			</el-menu-item>
		</el-menu>
	</div>
</template>
<script>
	import ElOptionGroup from "../../node_modules/element-ui/packages/select/src/option-group.vue";

	const loginUri = "https://oauth.vk.com/authorize?client_id=6284569&redirect_uri=http://10.241.1.87:8081/registration&scope=3";

	export default {
		data: function () {
			return {
				optionValue: '',
			}
		},
		components: {ElOptionGroup},
		methods: {
			handleSelect: function (selected) {
				console.log(selected)
			},
			isSigned: function () {
				return !!this.$store.state.token
			},
			loginRef: function () {
				return this.isSigned() ? "#" : loginUri
			},
			selectChange: function (userId) {
				this.$router.push('/user/' + userId)
			},
			selectedMenu: function (index) {
				if (index !== 'friends') {
					this.optionValue = "";
					if (index === 'login')
						this.$router.push("/registration/?logout=true");
					else
						this.$router.push("/user/" + this.$store.state.user.id);
				}
			}
		}
	}
</script>

<style lang="scss">
	.el-menu--horizontal .el-submenu > .el-menu {
		overflow-y: scroll;
		height: 500px;
	}
</style>