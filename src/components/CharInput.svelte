<script>
	import BaseInput from './BaseInput.svelte';
	export let value = ""
	export let type = "text"
	export let id
	export let readonly

	let focused = false
	$: if(type == "number")
	{
		value = parseFloat(value)
	}
</script>

<BaseInput focused={focused}>
	<slot></slot>
	<div class="input-content" class:focused={focused} slot="content">
			<input id={id} bind:value={value} readonly={readonly} on:focus on:focus={()=>{focused = true}} on:click on:blur on:blur={()=>{focused = false}}  on:input on:keyup on:keydown on:keypress >
			<slot name="content"></slot>
	</div>
</BaseInput>

<style lang="scss">
@import "../assets/common";
input
{
	transition: 0.2s all;
	background: transparent;
	display: block;
	width:100%;
	border: 0;
    border-bottom: 1px solid theme-color('primary');
    outline: none;
    padding: 0.3rem;
	font-size: 1rem;
	padding-left:0;
	padding-top:0;
}
.input-content.focused > input{
	border-color:theme-color('secondary')
}
</style>
