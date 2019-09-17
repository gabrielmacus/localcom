<script>
import Navaid from 'navaid';
import Peer from 'peerjs';
import { ENV } from '../stores.js';
import { User } from '../services.js'
import Layout from './Layout.svelte'
import Button from '../components/Button.svelte'
import { fade } from 'svelte/transition';
import { onDestroy, onMount, getContext } from 'svelte'

const { popupNotification } = getContext("layout")
let user = User()
let users = []
let status = "connecting"
let call
let peer = new Peer(user.username,ENV.peerOptions)
let interval
let localStream

onMount(()=>{
  navigator.mediaDevices.getUserMedia({audio:true,video:false})
  .then((stream)=>{
    localStream = stream
  })
  .catch((error)=>{
    popupNotification('Debe aceptar compartir su micrófono','error',3000)
    User(false)
    router.route("/login")
  })
})

onDestroy(()=>{
  if(interval)
  {
    clearInterval(interval)
  }
})
peer.on('open',(evt)=>{
  status = "connected"
  loadUsers()
  interval = setInterval(loadUsers,1500)
})
peer.on('call', (call) => {
  call.answer(localStream);
  status = `user-talking:${call.peer}`
  call.on('stream', (remoteStream) => {
    document.querySelector(`[data-audio='${call.peer}']`).srcObject = remoteStream
  });
  call.on('close',()=>{
    status = `connected`
  })

});
peer.on('error',(evt)=>{

  let msg
  switch(evt.type)
  {
    case "server-error":
    case "disconnected":
    case "network":
    case "invalid-id":
    case "unavailable-id":

      if(evt.type == "invalid-id")
      {
        msg = "Nombre de usuario no válido"
      }
      else if(evt.type == "unavailable-id")
      {
        msg = "Nombre de usuario no disponible"
      }
      else
      {
        msg = "Error en la conexión. Inténtelo de nuevo o contacte un administrador"
      }
      User(false)
      router.route("/login")
    break
  }
  if(msg){
    popupNotification(msg,'error',3000)
  }

})
function loadUsers() {
  if(status == 'disconnected')
  {
    return
  }

  peer.listAllPeers((peers)=>{
    console.log(peers)
    users = peers.filter((peer)=>{
      return peer != user.username
    })

  })
}
function talk()
{
  let user = this
  call = peer.call(user,localStream)
  status = `calling:${user}`

  let i  = setInterval(()=>{
    if(call.open)
    {
      status = `talking:${user}`
      clearInterval(i)
    }
  },10)

  call.on('close', ()=>{
    status = `connected`
    clearInterval(i)
  })
}
function hang()
{
  status = 'connected'
  if(call)
  {
    call.close()
  }
}

</script>

<Layout>

{#if status == 'connecting'}
<div class="loading"  >
  <i class="icon-spinner"></i>
</div>
{/if}

<span slot="title">Bienvenido <span class="username">{user.username}</span></span>

<div class="container">
  <h3>Usuarios conectados</h3>
  {#if users.length > 0}
  <div class="user-list">
    {#each users as user (user)}
    <div class="user" class:calling={status == `calling:${user}`} class:user-talking={status == `user-talking:${user}`}  class:talking={status == `talking:${user}`}>
    <span class="username">{user}</span>
    <!--
    <i class="icon-user-talking icon-volume-medium"></i>-->
    <span class="actions">
      <Button on:touchstart={talk.bind(user)} on:mousedown={talk.bind(user)} on:touchend={hang} on:mouseup={hang}><i class="icon-mic"></i></Button>
      <audio data-audio={user}   autoplay hidden></audio>
    </span>
    </div>
    {/each}
  </div>
  {:else}
  <p class="no-users">No hay usuarios conectados</p>
  {/if}

</div>

</Layout>

<style lang="scss">
@import "../assets/common";
@keyframes color_change_calling {
	from { background-color: #039be5; }
	to { background-color: #01579b; }
}
@keyframes color_change_talking {
	from { background-color: #69f0ae; }
	to { background-color: #00c853; }
}
@keyframes rotation {
		from {
				-webkit-transform: rotate(0deg);
		}
		to {
				-webkit-transform: rotate(360deg);
		}
}
.actions
{
  :global(button)
  {
        font-size: 1rem;
  }
}
.loading
{
  i
  {
    animation-name: rotation;
    animation-duration: 1200ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
  z-index: 5;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  background: rgba(0,0,0,0.75);
  color: white;
}
.user-list
{
  max-height: 60vh;
  overflow: auto;
}
.container
{

  .user{
    transition:all 0.3s;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.5rem;
    padding-top: 0.5rem;
    padding: 0.5rem;
    .username
    {
      overflow: hidden;
      margin-right: 0.5rem;
      text-overflow: ellipsis;
    }
    &.calling
    {
      padding:0.5rem;
      color:white;
      animation: color_change_calling 0.5s infinite alternate;
    }
    .icon-user-talking
    {
      display: none;
      margin-right: auto;
    }
    &.user-talking
    {
      .icon-user-talking
      {
        display:block;
      }
    }
    &.talking
    {
      padding:0.5rem;
      color:black;
      animation: color_change_talking 0.5s infinite alternate;

    }
    &:not(:last-child)
    {
      border-bottom: 1px solid lightgrey;

    }
  }
  h3{
    position: sticky;
    top: 0;
    font-size: 1.1rem;
    text-align: center;
    padding: 0.3rem;
    background: #e0e0e0;
    color: black;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
}
</style>
