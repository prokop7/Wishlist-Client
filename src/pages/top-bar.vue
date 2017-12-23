<template>
	<div id="top-bar">
		<el-menu
				class="el-menu-demo"
				mode="horizontal"
				menuTrigger="click"
				@select="selectedMenu"
				background-color="#00000030"
				transparency="0.15"
				text-color="#FFF"
				active-text-color="#FFFFFF"
		>
			<el-menu-item index="photo"
			              v-if="isSigned"
			              :route="/user/ + $store.state.user.id">
				<img :src="$store.state.user.photoLink" style="height: 50px; border-radius: 50%" alt="">
			</el-menu-item>
			<el-menu-item index="user"
			              v-if="isSigned"
			              :route="/user/ + $store.state.user.id">
				{{$store.state.user.name}}
			</el-menu-item>
			<el-menu-item index="friends"
			              @click=""
			              v-if="isSigned"
			              route="#">
				<el-select v-model="optionValue"
				           filterable
				           :placeholder="$t('friends')"
				           @change="selectChange"
				           :noDataText="$t('noRegisteredFriends')"
				           :noMatchText="$t('notFound')">
					<el-option-group :label="$t('registered')">
						<el-option
								v-for="friend in $store.getters.friends"
								:key="friend.id"
								:label="friend.name"
								:value="friend.id"
								v-if="friend.registered"
						>
						</el-option>
					</el-option-group>
					<el-option-group :label="$t('notRegistered')">
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
				<a :href="loginRef"
				   target="_self">{{$t(isSigned ? "logout" : "login")}}</a>
			</el-menu-item>
			<el-menu-item index="locale" id="locale-change" route="#">
				<el-select :value="$i18n.locale" @change="setLocale" style="width: 100px">
					<el-option
							v-for="locale in locales"
							:key="locale.value"
							:label="locale.name"
							:value="locale.value"
					></el-option>
				</el-select>
			</el-menu-item>
		</el-menu>
	</div>
</template>
<script>
	import {redirectUri, locales} from "@/config"

	const loginUri = `https://oauth.vk.com/authorize?client_id=6284569&redirect_uri=${redirectUri}`;

	export default {
		data: function () {
			return {
				optionValue: '',
				locales
			}
		},
		components: {},
		methods: {
			selectChange(userId) {
				this.$router.push('/user/' + userId)
			},
			selectedMenu(index) {
				if (index !== 'friends') {
					this.optionValue = "";
					if (index === 'login')
						this.$router.push("/registration/?logout=true");
					else
						this.$router.push("/user/" + this.$store.state.user.id);
				}
			},
			setLocale(locale) {
				this.$i18n.locale = locale;
			}
		},
		computed: {
			isSigned() {
				return !!this.$store.state.token
			},
			loginRef() {
				return this.isSigned ? "#" : loginUri
			},
		}
	}
</script>

<style lang="scss">
	.el-menu--horizontal .el-submenu > .el-menu {
		overflow-y: scroll;
		height: 500px;
	}

	#locale-change {
		float: right;
		padding-right: 20px;
	}

	#login-link {
		float: right;
		padding-right: 20px;
		}
</style>