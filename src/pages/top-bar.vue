<template>
	<div id="top-bar">
		Tob bar
		<el-button @click="$store.commit('increment')"></el-button>
	</div>
</template>
<script>
	import ElButton from "../../node_modules/element-ui/packages/button/src/button.vue";

	export default {components: {ElButton}}
</script>