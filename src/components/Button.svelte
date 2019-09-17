<script>
export let type ="button";
export let loadingContent;
export let loading = false;
export let disabled = false
export let pressed = false
export let style = 1
export let className
</script>

<div class="button" >

    <button class={`style-${style}`} on:mousedown on:mouseup on:touchstart on:touchend   on:click on:dblclick disabled={loading || disabled}    class:pressed={pressed} class:loading={loading} type="{type}">
    {#if loading}
        {#if loadingContent}
        <div class="loading">{@html loadingContent}</div>
        {:else}
        <div class="loading"><span class="icon-loading icon-spinner"></span></div>
        {/if}
    {:else}
        <slot></slot>
    {/if}
    </button>


</div>
<style lang="scss">
@import "../assets/common";
@keyframes rotation {
		from {
				-webkit-transform: rotate(0deg);
		}
		to {
				-webkit-transform: rotate(360deg);
		}
}
.loading
{
    display: flex;
    align-items: center;
    justify-content: center;
    & > .icon-loading
    {
        font-size: 1rem;
        animation-name: rotation;
        animation-duration: 1000ms;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }
}
button:disabled
{
    color: theme-color('primary','light-contrast');
    background-color:theme-color('primary','light');
}
button{
  font-size: 0.8rem;
  user-select: none;
    cursor: pointer;
    transition: 0.2s all;
    color:theme-color('primary','contrast');
    background-color:theme-color('primary');
    padding: 0.5rem;
    border: 0;
    margin: 0;
    display: block;
    outline:0;
    width: 100%;

    font-weight: 600;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
}
button.style-2
{
  color:theme-color('secondary','contrast');
  background-color:theme-color('secondary');
}

@media (hover: hover) {
  button.style-2:not(:disabled):hover
  {
      color:theme-color('secondary','light-contrast');
      background-color:theme-color('secondary','light');
  }

  button:not(:disabled):hover
  {
      color:theme-color('secondary','contrast');
      background-color:theme-color('secondary');
  }

}

button.pressed
{
  box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color:theme-color('primary','dark');
  color:theme-color('primary','dark-contrast');
}
button:active
{
    box-shadow:none;
    color:theme-color('primary','dark-contrast');
    background-color:theme-color('primary','dark');
}
.button
{
    user-select: none;
    width: 100%;
    display:block;
}

</style>
