<script>
    import { onMount} from 'svelte';
    import BaseInput from './BaseInput.svelte'
</script>

<BaseInput>
<slot></slot>
<div class="checkinput-group" > 
<slot name="options"></slot>
</div>
</BaseInput>


<style lang="scss">
@import "../assets/common";
.checkinput-group > :global(*){
    display: flex;
    flex-wrap:wrap;
}
.checkinput-group > :global(*) > :global(*)
{
    margin-right:1rem
}
</style>