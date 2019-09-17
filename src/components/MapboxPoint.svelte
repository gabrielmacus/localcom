<script>


import MapboxFeature from './MapboxFeature.svelte'

export let id = null
export let editable = null
export let coordinates = null
export let properties = null


</script>

<MapboxFeature type={"Point"} on:changedcoords on:moved on:deleted on:selected on:deselected id={id} editable={editable} properties={properties} bind:coordinates={coordinates} >
<slot></slot>
</MapboxFeature>
