<script >export let wrapper;
export let isOpen;
export let isPopup;
export let toRight;
</script>

<div bind:this={wrapper} class:isOpen class:isPopup class:to-right={toRight}>
	<slot />
</div>

<style>
	div {
		padding: 10px;
		background-color: white;
		margin: 0 10px 10px;
		border: 1px solid black;
		display: none;
	}
	.isOpen {
		display: block;
	}
	.isOpen.to-right {
		display: flex;
		flex-direction: column;
	}
	.isPopup {
		position: absolute;
		z-index: 2;
	}
</style>
