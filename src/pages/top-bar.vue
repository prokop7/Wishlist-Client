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
			              style="padding-right: 5px"
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
				<el-button icon="el-icon-refresh"
				           @click="refreshFriends"
				           size="mini"
				           id="refresh-friends-button"></el-button>
			</el-menu-item>
			<el-menu-item
					index="login"
					id="login-link"
					@click="loginProcess()">
				<a href="#"
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
			<el-menu-item index="background" id="background-change" route="#">
				<el-color-picker size="mini" v-model="backgroundColor"></el-color-picker>
			</el-menu-item>
		</el-menu>
	</div>
</template>
<script>
	import Ajax from "@/api"
	import {redirectUri, locales} from "@/config"
	import ElButton from "../../node_modules/element-ui/packages/button/src/button.vue";

	const loginUri = `https://oauth.vk.com/authorize?client_id=6284569&redirect_uri=${redirectUri}`;

	export default {
		components: {ElButton},
		data: function () {
			return {
				optionValue: '',
				locales
			}
		},
		methods: {
			selectChange(userId) {
				this.$router.push('/user/' + userId)
			},
			selectedMenu(index) {
				if (index !== 'friends') {
					this.optionValue = "";
					if (index === 'user' || index === 'photo')
						this.$router.push("/user/" + this.$store.state.user.id);
				}
			},
			setLocale(locale) {
				this.$i18n.locale = locale;
			},
			loginProcess() {
				if (this.isSigned) {
					console.log('logout');
					this.$store.commit('token', "");
					localStorage.removeItem('token');
					this.$router.push("/registration");
				} else {
					console.log(this.$store.state);
					window.open(loginUri, "_self");
				}
			},
			refreshFriends() {
				let _this = this;
				let userId = this.$store.state.user.id;
				let locale = localStorage.getItem('locale');
				Ajax.refreshFriends(
					userId,
					locale,
					(friends) => _this.$store.commit('friends', friends),
					(e) => console.log(e)
				)
			}
		},
		computed: {
			isSigned() {
				return !!this.$store.state.token
			},
			backgroundColor: {
				get() {
					return this.$store.getters.background
				},
				set(color) {
					if (!color)
						color = '#0079BF';
					let _this = this;
					Ajax.editBackground(
						this.$store.state.user.id,
						color,
						() => _this.$store.commit('background', color),
						(e) => console.log(e)
					);

				}
			}
		},
		mounted() {
			let locale = localStorage.getItem('locale');
			this.$i18n.locale = locale ? locale : 'en';
		},
		watch: {
			'$i18n.locale': locale => localStorage.setItem('locale', locale)
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

	#background-change {
		float: right;
		padding-right: 20px;
	}

	.el-icon-refresh {
		margin-right: 2px !important;
	}

	#refresh-friends-button {
		padding: 10px 0;
		background-color: transparent;
		color: #fff;
		border: none;
	}

	#refresh-friends-button:hover {
		background-color: rgba(0, 0, 0, 0.3);
	}
</style>