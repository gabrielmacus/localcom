<script>
    import { getContext, onMount, beforeUpdate, afterUpdate, createEventDispatcher} from 'svelte';
    import mapbox from 'mapbox-gl';
    import polygonCenter from 'geojson-polygon-center'
    const { getFeature } = getContext("feature")
    const { getMap } = getContext("map")
    let feature = getFeature()
    let map = getMap()
    let popupDomElement
    let popup

    function positionPopup()
    {
        popup.addTo(map);
        popupDomElement.style.left = (popup._pos["x"] - (popupDomElement.clientWidth / 2) ) +"px"
        popupDomElement.style.top = (popup._pos["y"] - (popupDomElement.clientHeight / 2) ) +"px"
        popup.remove()
    }

    onMount(()=>{

        let center = polygonCenter(feature.geometry)
        popup = new mapbox.Popup({})
        .setLngLat(center["coordinates"])
        .setHTML("")
        positionPopup()
        map.on("drag",positionPopup)
        map.on("zoom",positionPopup)

        return ()=>{
            map.off("drag",positionPopup)
            map.off("zoom",positionPopup)
            popup.remove()

        }

    })
</script>
<style lang="scss">
@import "../assets/common";
/*
.popup
{
    display:grid;
    grid-row-gap: 0.3rem;
    background-color: theme-color('background');
    color: theme-color('foreground');
    position: absolute;

    padding: 0.5rem;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
}*/
</style>

<div bind:this={popupDomElement} class="popup">
<slot ></slot>
</div>
