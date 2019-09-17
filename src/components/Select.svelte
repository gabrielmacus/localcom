<script>
import { onMount} from 'svelte';
import BaseInput from './BaseInput.svelte';

export let options
export let multiple = false
export let value
</script>

<BaseInput>
<slot></slot>
<div class="select" slot="content"  >



{#if multiple}
<select bind:value={value} multiple >
{#each  options as option,index (option)}
<option value={option.value}>{option.label}</option>
{/each}
</select>   
{:else}
<select bind:value={value} >
{#each  options as option,index (option)}
<option value={option.value}>{option.label}</option>
{/each}
</select>  
{/if}



</div>

</BaseInput>


<style lang="scss">
@import "../assets/common";
select
{
    background:transparent;
    outline:0;
    border: 0;
    
    &:not([multiple])
    {
        padding: 0.3rem;
        border-bottom: 1px solid theme-color('primary');
        padding-left:0
    }
    &[multiple]
    {
        border:1px solid theme-color('primary');
        option:not(:last-child)
        {
            border-bottom:1px solid theme-color('primary');
        }
    }


    width: 100%;
    option
    {
        padding: 0.3rem;
    }
}
</style>