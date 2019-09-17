<script>
import CharInput from '../components/CharInput.svelte'
import Button from '../components/Button.svelte'
import Peer from 'peerjs';

let username
let status = "disconnected"
let peer
let users = []
let connections = {}
let peerOptions = {host: '192.168.0.6', port: 9000, path: '/'}
let call
import Notifications from '@beyonk/svelte-notifications'
import {onMount} from 'svelte'
let notifications

/*
peerOptions = {host: 'd8ccb719.ngrok.io',  path: '/', config:{ 'iceServers': [
  {url:'stun:stun01.sipphone.com'},
{url:'stun:stun.ekiga.net'},
{url:'stun:stun.fwdnet.net'},
{url:'stun:stun.ideasip.com'},
{url:'stun:stun.iptel.org'},
{url:'stun:stun.rixtelecom.se'},
{url:'stun:stun.schlund.de'},
{url:'stun:stun.l.google.com:19302'},
{url:'stun:stun1.l.google.com:19302'},
{url:'stun:stun2.l.google.com:19302'},
{url:'stun:stun3.l.google.com:19302'},
{url:'stun:stun4.l.google.com:19302'},
{url:'stun:stunserver.org'},
{url:'stun:stun.softjoys.com'},
{url:'stun:stun.voiparound.com'},
{url:'stun:stun.voipbuster.com'},
{url:'stun:stun.voipstunt.com'},
{url:'stun:stun.voxgratia.org'},
{url:'stun:stun.xten.com'},
{
	url: 'turn:numb.viagenie.ca',
	credential: 'muazkh',
	username: 'webrtc@live.com'
},
{
	url: 'turn:192.158.29.39:3478?transport=udp',
	credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
	username: '28224511:1379330808'
},
{
	url: 'turn:192.158.29.39:3478?transport=tcp',
	credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
	username: '28224511:1379330808'
}

] }}
*/

let audioStream
 //navigator.mediaDevices.getUserMedia({audio:true,video:false}).then((devices)=>{console.log(devices)})

onMount(()=>{

  navigator.mediaDevices.getUserMedia({video: false, audio: true})
  .then((stream)=>{
    audioStream = stream
  })
  .catch((error)=>{
    console.log(error)
    notifications.warning("Error al obtener el dispositivo de grabación", 3000)
  })

})





function makeConnections()
{
  users.forEach((user)=>{
    if(!connections[user] && audioStream)
    {
      /*
      let call = peer.call(user,audioStream)
      call.on('stream', (remoteAudioStream) => {
        document.querySelector(`[data-audio='${user}']`).srcObject =  remoteAudioStream
      });

      let connection = peer.connect(user)
      connection.on('error',()=>{
        if(connections[user]) delete connections[user]
      })
      connection.on('disconnect',()=>{
        if(connections[user]) delete connections[user]
      })
      connection.on('open',()=>{
        connections[user] = connection
      })*/
      /*
      connection.on('data',(data)=>{
        console.log(data)
      })*/
    }
  })

}
function loadUsers()
{
  peer.listAllPeers((peers)=>{
    let idx = peers.findIndex((el)=>{return el == username})
    if (idx > -1) peers.splice(idx,1);
    users = peers
    makeConnections()
  })
}
function connect() {
  status = 'connecting'
  peer = new Peer(username, peerOptions)
  peer.on('open', (evt)=>{
    status = 'connected'
    setInterval(loadUsers,1000)
    loadUsers()
  })
  /*
  peer.on('connection', (connection) => {
    connection.on("data",(data)=>{
      console.log(data)
    })
  })*/
  peer.on('call', (call) => {
    call.answer(audioStream);
    call.on('stream', (remoteAudioStream) => {
      document.querySelector(`[data-audio='${call.peer}']`).srcObject = remoteAudioStream
    });
  });
  peer.on('error', function(err) {
    console.log(err)
    let errorMsg = "Se ha producido un error. Inténte conectarse nuevamente."
    switch (err.type) {
      case "unavailable-id":
        errorMsg = "El nombre de usuario ya está ocupado."
      break
      case "invalid-id":
        errorMsg = "El nombre de usuario es inválido."
      break
      case "disconnected":
        status = 'disconnected'
      break
    }
    //alert(err.type)
  });


}
function talk()
{
  let user = this
  call = peer.call(user,audioStream)
  status = `calling:${user}`
  /*
  let i  = setInterval(()=>{
    if(call.open)
    {
      status = `talking:${user}`
      clearInterval(i)
    }
  },10)*/

  call.on('stream', (remoteAudioStream) => {
    status = `talking:${user}`
    //document.querySelector(`[data-audio='${user}']`).srcObject =  remoteAudioStream
  });
  call.on('close', ()=>{
    status = `connected`
    //clearInterval(i)
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

<div class="container">
<Notifications bind:this={notifications} />


{#if status == 'disconnected' || status == 'connecting'}
<div class="status-disconnected">
  <form class="username-select" on:submit|preventDefault={connect}>
    <CharInput bind:value={username}>Nombre de usuario:</CharInput>
    <Button loading={status == 'connecting'} type={'submit'} >Aceptar</Button>
  </form>
</div>
{:else}
<header>
  <h2>Bienvenido <span class="username">{username}</span></h2>
</header>
<div class="status-connected">
  <h3>Usuarios conectados</h3>
  {#if users.length > 0}
  <div class="user-list">
    {#each users as user (user)}
    <div class="user" class:calling={status == `calling:${user}`} class:talking={status == `talking:${user}`}>
    <span class="username">{user}</span>
    <span class="actions">
      <Button on:touchstart={talk.bind(user)} on:mousedown={talk.bind(user)} on:touchend={hang} on:mouseup={hang}>Hablar</Button>
      <audio data-audio={user} autoplay hidden></audio>
    </span>
    </div>
    {/each}
  </div>
  {:else}
  <p class="no-users">No hay usuarios conectados</p>
  {/if}

</div>
{/if}

</div>

<style lang="scss">
@import "../assets/common";
.container
{
  max-width: 90%;
  width:400px;
  :global(input)
  {
    margin-bottom: 1rem;
  }
  header
  {
    margin-bottom: 1rem;
    margin-bottom: 0.5rem;
    h2{
      font-size: 1.3rem;
      .username{
        color:theme-color('primary')
      }
    }
  }
  & > [class^="status"]
  {
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    background: theme-color('primary','dark-contrast');
    padding: 1rem;
  }
  margin: auto;
}
@keyframes color_change_calling {
	from { background-color: #039be5; }
	to { background-color: #01579b; }
}
@keyframes color_change_talking {
	from { background-color: #69f0ae; }
	to { background-color: #00c853; }
}
.status-connected
{

  .user{
    transition:all 0.3s;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.5rem;
    padding-top: 0.5rem;
    &.calling
    {
      padding:0.5rem;
      color:white;
      animation: color_change_calling 0.5s infinite alternate;
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

<!--
<h1>{id}</h1>
<div>
<label>Connect to:</label>
<input bind:value={connectTo}>
<button on:click={connectToPeer}>Connect</button>
</div>

<div>
<textarea bind:value={textToSend}></textarea>
<button on:click={send}>Send</button>
</div>-->
