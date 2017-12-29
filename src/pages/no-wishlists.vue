<template>
	<div id="no-wishlists">
		<div class="no-wishlists-message">
			<p v-html="$t('noWishlists')"></p>
		</div>
	</div>
</template>
<script>
	export default {}
</script>
<style type="scss">
	.no-wishlists-message {
		white-space: normal;
		width: 70%;
		line-height: 60px;
		color: #fff;
		font-size: 56px;
		position: fixed;
		top: 30%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
	}

	#no-wishlists {
		width: 100%;
		text-align: center;
	}
</style>