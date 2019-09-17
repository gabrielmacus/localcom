<script>
import MapboxFeature from './MapboxFeature.svelte'

export let id
export let editable
export let coordinates
export let properties

</script>
<MapboxFeature type={"LineString"} on:changedcoords on:moved on:deleted on:selected on:deselected id={id} editable={editable} properties={properties} bind:coordinates={coordinates} >
<slot></slot>
</MapboxFeature>