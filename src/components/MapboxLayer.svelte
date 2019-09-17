<script>
	import { onMount, afterUpdate, beforeUpdate, getContext, setContext,createEventDispatcher } from 'svelte';
    import mapbox from 'mapbox-gl';

		const {getDraw, getMap,getFeaturesSource, setFeaturesSource} = getContext("map");
    const dispatch = createEventDispatcher();

    let map = getMap()
    let layer
    let draw = getDraw()

    export let id
    export let type
    export let paint = {}
    export let layout = {}
    export let aboveLayer="type:symbol"
    export let minzoom = 0
    export let filter = null
    export let features = []
		export let editable = true

    setContext("map-layer", {
        getLayer: () => layer,
        getFeatures: () => features,
        addFeature: (feature) =>{
            features.push(feature)
            initLayer()
        },
        updateFeature: (id, feature) => {
            let idx = features.findIndex((el)=>{
                return el.id == id
            })

            if(idx > -1)
            {
                features[idx] = feature
            }
            initLayer()

        },
        deleteFeature: (id) => {
            let idx = features.findIndex((el)=>{
                return el.id == id
            })

            if(idx > -1)
            {
                features.splice(idx,1)
                initLayer()
            }
        },

    });


    onMount(()=>{
        initLayer()
        return () =>{
            destroyLayer()
        }
    })

    beforeUpdate(()=>{
        initLayer()
    })

    function onClickLayer(evt)
    {
        if(evt.features.length > 0)
        {
            let feature = evt.features[0]
            dispatch('featureClicked',{feature:feature})
        }
    }
    function onDrawSelectionChange(evt)
    {
       if(evt.features.length > 0)
        {
            let feature = evt.features[0]
            dispatch('featureSelected',{feature:feature,selection_mode:draw.getMode()})
        }
        else{
            dispatch('featureDeselected',{})
        }
    }
    function onDrawModeChange(evt)
    {
        console.log(evt)
    }
    function onDrawUpdate(evt)
    {
        if(evt.features.length > 0)
        {
            let feature = evt.features[0]
            let idx = features.findIndex((el)=>{ return el.id == feature.id})
            if(idx > -1)
            {
                features[idx].geometry.coordinates = feature.geometry.coordinates
            }
            dispatch('featureUpdated',{feature:feature})
        }
    }
    function onDrawDelete(evt)
    {
        if(evt.features.length > 0)
        {
            let feature = evt.features[0]
            let idx = features.findIndex((el)=>{ return el.id == feature.id})
            if(idx > -1)
            {
              features.splice(idx,1)
              features = features
            }
            dispatch('featureDeleted',{feature:feature})
        }

    }
    function destroyLayer()
    {
        if(layer && map.getLayer(layer.id))
        {
            map.off("touchend",layer.id,onClickLayer)
						map.off("click",layer.id,onClickLayer)
            map.off("draw.selectionchange",onDrawSelectionChange)
            map.off("draw.modechange",onDrawModeChange)
            map.off("draw.update",onDrawUpdate)
            map.off("draw.delete",onDrawDelete)
            map.removeLayer(layer.id)
            map.removeSource(layer.id)
        }
    }

    function initLayer()
    {

        let source = {'type': 'geojson','data': {
        "type": "FeatureCollection",
        "features": features
        }}

        let layers = map.getStyle().layers;

        if(aboveLayer.match(/^type:([a-z]*)$/gm))
        {
            let type = aboveLayer.replace("type:","")
            for (let i = 0; i < layers.length; i++) {

                if (layers[i].type == type) {
                    aboveLayer = layers[i].id;
                    break;
                }
            }
        }

        layer = {id,type,source,paint,layout,minzoom}
        if(filter)
        {
            layer["filter"] = filter
        }

        if(!map.getLayer(layer.id))
        {
            map.addLayer(layer,aboveLayer)
            map.on("touchend",layer.id,onClickLayer)
						map.on("click",layer.id,onClickLayer)
            map.on("draw.selectionchange",onDrawSelectionChange)
            map.on("draw.modechange",onDrawModeChange)
            map.on("draw.update",onDrawUpdate)
            map.on("draw.delete",onDrawDelete)
        }
        else
        {
           for(let prop in paint)
           {
            map.setPaintProperty(id,prop,paint[prop])
           }

           map.setFilter(id,filter)
           map.getSource(id).setData(source.data)
        }
				if(editable)
				{
					draw.add({
							 "type":"FeatureCollection",
							 "features":features
					})
				}

    }


</script>

<div class="layer" >
    {#if layer}
        <slot></slot>
    {/if}
</div>
