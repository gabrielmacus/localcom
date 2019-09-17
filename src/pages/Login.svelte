<script>
import CharInput from '../components/CharInput.svelte'
import Button from '../components/Button.svelte'
import Layout from './Layout.svelte'
import {User} from '../services.js'
import { onDestroy } from 'svelte'
let user = {}

function logIn()
{
   User(user)
   router.route("/")
}



</script>

<Layout>

<form class="username-select" on:submit|preventDefault={logIn}>
  <CharInput bind:value={user.username}>Nombre de usuario:</CharInput>
  <Button type={'submit'} >Aceptar</Button>
</form>


</Layout>


<style lang="scss">
@import "../assets/common";
form
{
  display:grid;
  grid-row-gap: 1rem;
}

</style>
