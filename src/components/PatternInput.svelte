<script>
	import CharInput from './CharInput.svelte';
	export let value = "";
	export let regex = null;
	export let type = "text";

	function onKeyDown(e)
	{
	     let possibleValue = e.target.value + e.key;
         if (['Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].indexOf(e.key) == -1 && !e.ctrlKey
                 && !possibleValue.match(regex))
         {
             e.preventDefault()
         }
	}
</script>

<CharInput bind:value={value} type={type} on:keydown={onKeyDown} on:blur on:focus on:keyup on:keydown on:keypress >
	<slot></slot>
</CharInput>
