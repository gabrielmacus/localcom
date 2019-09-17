<script>
	window.mapbox_feature_counter = !window.mapbox_feature_counter ? 1 : window.mapbox_feature_counter + 1
	import { getContext, setContext, onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
    import mapbox from 'mapbox-gl';

	const dispatch = createEventDispatcher();
	const { getLayer,addFeature,deleteFeature,updateFeature } = getContext("map-layer");
    const { getDraw, getMap,deleteFeatureFromSource } = getContext("map")

	let layer = getLayer()
	let draw = getDraw()
	let map = getMap()
	let features
	let showPopup = false

    export let editable = false
    export let coordinates = []
    export let type
    export let properties = {}
	export let id = `${window.mapbox_polygon_counter}`


	$: feature =  {
		"id":id,
		"type": "Feature",
		"properties":properties,
		"geometry": {
			"type": type,
			"coordinates": coordinates
		}
	}

	setContext("feature", {
		 getFeature:() => feature
	})


	beforeUpdate(()=>{
		feature.geometry.coordinates = coordinates
		feature.id = id
		updateFeature(id, feature)
	})

	onMount(()=>{
		addFeature(feature)
		return ()=>{
			console.log("Destroying feature",feature)
			draw.trash()
			deleteFeature(id)
		}
	})


</script>

<div class="feature" >
    {#if showPopup}
        <slot></slot>
    {/if}
</div>
