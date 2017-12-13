<template>
	<div id="top-bar">
		<el-menu :router="true"
		         class="el-menu-demo"
		         mode="horizontal"
		         menuTrigger="click"
		         background-color="#545c64"
		         text-color="#fff"
		         active-text-color="#ffd04b">
			<el-menu-item index="1" :route="/user/ + $store.state.user.id">Home</el-menu-item>
			<el-submenu index="2">
				<template slot="title">Friends</template>
				<el-menu-item v-for="friend in $store.getters.friends"
				              :key="friend.id"
				              :index="'2-' + friend.id"
				              :route="'/user/' + friend.id">
					{{friend.name}}
				</el-menu-item>
			</el-submenu>
			<el-menu-item index="10" id="login-link">
				<a href="https://oauth.vk.com/authorize?client_id=6284569&redirect_uri=http://10.241.1.87:8081/registration&scope=3"
				target="_self">{{loginState}}</a>
			</el-menu-item>
		</el-menu>
	</div>
</template>
<script>

	export default {
		data: function () {
			return {
				loginState: this.$store.state.token ? 'Logout' : 'Login'
			}
		},
		components: {},
		methods: {
			handleSelect: function (selected) {
				console.log(selected)
			}
		}
	}
</script>