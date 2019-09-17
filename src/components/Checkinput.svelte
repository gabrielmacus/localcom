<script>
    import { onMount} from 'svelte';
    import BaseInput from './BaseInput.svelte';
    window.checkinput_counter =  !window.checkinput_counter ? 1 : window.checkinput_counter + 1 ;
    let id = window.checkinput_counter
    export let value
    let type
    export let group = []
    let element
    onMount(()=>{
       let input =  element.querySelector("input")
       type = input.type
       if(!input.id)
       {
           input.id = id
       }
       else{
           id = input.id
       }
    })


</script>

<div class="checkinput" bind:this={element} >

        <label for={id} class="label"><slot></slot></label>

        <slot name="input" ></slot>
        {#if type == 'checkbox'}
        <label for={id} class="icon-unchecked icon-square-o"></label>
        <label for={id} class="icon-checked icon-check-square"></label>
        {:else}
        <label for={id} class="icon-unchecked icon-circle-thin"></label>
        <label for={id} class="icon-checked icon-check-circle"></label>
        {/if}


</div>

<style lang="scss">
@import "../assets/common";
.checkinput
{
    display: flex;
    align-items: center
}
.checkinput :global(input)
{
    display: none;
}
.label
{
  color: theme-color('background','contrast');
  font-weight:400;
  padding-right: 0.5rem;
  cursor: pointer;
}
label
{
    user-select: none
}
.icon-unchecked, .icon-checked
{
    top: 2px;
    position: relative;
    display: none;
}
input:checked + .icon-unchecked + .icon-checked
{
    display: block
}
input:not(:checked) + .icon-unchecked
{
    display: block
}
</style>
