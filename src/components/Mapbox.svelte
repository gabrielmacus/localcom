<style>
.map
{
    width:100%;
    height:50vh
}

</style>

<script>
import { beforeUpdate,onMount,setContext,createEventDispatcher} from 'svelte';
import mapbox from 'mapbox-gl';
import MapboxDraw  from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.js'
import async from 'async'
import clone from 'clone'

let draw;
let container;
let map;
let mapLoaded = false

const dispatch = createEventDispatcher();

export let drawControls = null
export let navigationControl = null
export let center = [0,0]
export let zoom = 0
export let token;
export let style = 'mapbox://styles/mapbox/streets-v11'
export let featuresSource
export let fitBounds
export let fitBoundsOptions = {padding:5}
/*
function compareFitBounds(newFitBounds)
{
  console.log(JSON.stringify(fitBounds))
  console.log(JSON.stringify(newFitBounds))
}
$: compareFitBounds(fitBounds)*/

setContext("map", {
    getMap: () => map,
    getDraw: () => draw,
    getFeaturesSource: () => featuresSource,
    setFeaturesSource: (f) => {featuresSource = f},
    deleteFeatureFromSource:(id) => {
       let idx = featuresSource.findIndex((el)=>{
            return el.id == id;
        })

        if(idx > -1)
        {
            featuresSource.splice(idx,1)
            featuresSource = featuresSource
        }
    }
});

let lastFitBounds
let lastCenter
beforeUpdate((e)=>{

  if(map && (!lastCenter || JSON.stringify(center) != JSON.stringify(lastCenter)))
  {
    map.setCenter(center)
    lastCenter = clone(center)
  }
  if (fitBounds && map && (!lastFitBounds || JSON.stringify(fitBounds) != JSON.stringify(lastFitBounds)))
  {
    try{
      map.fitBounds(fitBounds,fitBoundsOptions);
      lastFitBounds = clone(fitBounds)
    }catch(e){
    }
  }

})
onMount(() => {

        let links = []
		async.waterfall([
		    (callback)=>{
                let link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/mapbox-gl/dist/mapbox-gl.css';
                link.onload = ()=>{
                    links.push(link)
                    callback();
                };
                document.head.appendChild(link);
		    },
		    (callback)=>{
                 let link = document.createElement('link');
                 link.rel = 'stylesheet';
                 link.href = 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.9/mapbox-gl-draw.css';
                 link.onload = ()=>{
                     links.push(link)
                     callback();
                 };
                 document.head.appendChild(link);
		    }
		],(err, result)=>{

		    mapbox.accessToken = token;
            map = new mapbox.Map({
                container,
                style: style,
                center: center,
                zoom
            });
            if(drawControls)
            {
                draw =new MapboxDraw({
                    displayControlsDefault: false,
                    controls: drawControls
                });
                draw.options.styles[0].paint["fill-opacity"] = 0
                draw.options.styles[3].paint["line-width"] = 0
                draw.options.styles[9].paint["circle-opacity"] = 0
                draw.options.styles[10].paint["circle-color"] = "transparent"
                map.addControl(draw);

            }
            if(navigationControl)
            {
              map.addControl(new mapbox.NavigationControl(navigationControl));
            }
            map.on('style.load', () => {
                mapLoaded = true
            });
            map.on('draw.create',(e)=>{
                let feature = e.features[0]
                window.mapbox_feature_counter = !window.mapbox_feature_counter ? 1 : window.mapbox_feature_counter + 1
                draw.delete(feature.id)
                feature.id = `${window.mapbox_feature_counter}`
                featuresSource.push(feature)
                featuresSource = featuresSource
                dispatch("featurecreated",{feature:feature})
            })

		});



		return () => {
			map.remove();
			links.forEach(function(link) {
			  link.parentNode.removeChild(link)
			})
		};
	});


</script>

<div class="map" bind:this={container}>
{#if mapLoaded}
		<slot></slot>
{/if}
</div>
