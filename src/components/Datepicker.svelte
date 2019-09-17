<script>
import CharInput from './CharInput.svelte';
import Flatpickr from 'svelte-flatpickr'
import {onMount,getContext} from 'svelte'
import 'flatpickr/dist/flatpickr.css'
import 'flatpickr/dist/themes/light.css'
import { Spanish } from "flatpickr/dist/l10n/es.js"

let focused = false
let now = new Date()
let component
let dateInput
let dateValue
let flatpickr


window.datepicker_counter = !window.datepicker_counter ? 1 :   window.datepicker_counter + 1;

export let value = null;
export let enableTime = false
export let dateFormat = !enableTime? "Y-m-d": "Y-m-d H:i:S"
export let altFormat =  !enableTime? "d-m-Y" : "d-m-Y H:i:S"
export let defaultDate = !enableTime? `${now.getFullYear()}-0${now.getMonth() + 1}-0${now.getDate()}`:
`${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
onMount(()=>{
  dateInput.oninput=(e)=>{
    dateValue = e.target.nextSibling.value
  }
})

function onClickedInput()
{
 flatpickr.$$.ctx.fp.toggle()
}

$: flatpickrOptions = {
  element:"#datepicker-"+  window.datepicker_counter,
  enableTime,
  dateFormat,
  altInput: true,
  altFormat,
  disableMobile: true,
  locale:Spanish,
  onReady:()=>{
    if((!value || value == "") && defaultDate && defaultDate!="")
    {
      value = defaultDate
    }

    setTimeout(()=>{
      dateValue = dateInput.nextSibling.value
      dateInput.nextSibling.hidden = true
    })

  }
}

</script>

<CharInput readonly={true} on:click={onClickedInput} focused={focused} value={dateValue} bind:this={component}>
	<slot></slot>
  <div class="input-content"  slot="content">
  <Flatpickr bind:this={flatpickr} options="{ flatpickrOptions }" value={value} element={"#datepicker-"+  window.datepicker_counter}>
          <div class="flatpickr" id={"datepicker-"+  window.datepicker_counter}>
              <input   bind:this={dateInput} type="text" bind:value={value} data-input on:focus on:focus={()=>{focused = true}} on:blur on:blur={()=>{focused = false}}  on:input on:keyup on:keydown on:keypress>
          </div>
  </Flatpickr>

	</div>
</CharInput>

<style lang="scss">
@import "../assets/common";

</style>
