<script >export let pos;
export let color;
</script>

<div style="left: {pos.x}%; top: {pos.y}%; background-color: {color.hex};" />

<style>
	div {
		position: absolute;
		width: 20px;
		height: 20px;
		border-radius: 10px;
		box-sizing: border-box;
		border: 2px solid black;
		box-shadow: 0 0 2px black;
		margin: -10px;
		pointer-events: none;
	}
</style>
