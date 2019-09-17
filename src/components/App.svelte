<svelte:component this={ Route } { params } />

{#if notifications.length > 0}
<div class="notifications">
  {#each notifications as notification (notification.text)}
  <div class="notification"
	in:fly="{{ y: 200, duration: 500 }}"
	out:fly="{{ y: 200, duration: 500 }}"
	class:success={notification.className == 'success'}
	class:error={notification.className == 'error'}
	class:warning={notification.className == 'warning'}
	>
    <p>{notification.text}</p>
  </div>
  {/each}
</div>
{/if}

<script>
	import { fly } from 'svelte/transition';
	import Navaid from 'navaid';
	import { onMount, setContext } from 'svelte';
	import {checkUnathenticated,checkAuthorization} from '../services.js'
	import { User } from '../services.js'

	let notifications=[]
	setContext("layout", {
			popupNotification: (text,className,timeout) => {
	      notifications.push({text,className})
        notifications = notifications
	      setTimeout(()=>{
	        let idx = notifications.findIndex((el)=>{ return el.text == text })
	        notifications.splice(idx,1)
	        notifications = notifications
	      },timeout)
	    }
	});

	let Route, params={};

	function draw(m, params) {
		params = params || {};
		Route = m.default || m;
	}

	function track(obj) {
		if (window.ga) {
			ga.send('pageview', { dp:obj.uri });
		}
	}

	window.router = (
		Navaid('/')
			.on('/', () => {
				if(!User())
				{
					router.route('/login')
					return false
				}
				return import('@pages/Room').then(draw)
			})
			.on('/login', () => {
				if(User())
				{
					router.route('/')
					return false
				}

				return import('@pages/Login').then(draw)
			})

	);

	onMount(() => {
		router.listen();
		addEventListener('replacestate', track);
		addEventListener('pushstate', track);
		addEventListener('popstate', track);

		return () => {
			removeEventListener('replacestate', track);
			removeEventListener('pushstate', track);
			removeEventListener('popstate', track);
			router.unlisten();
		};
	});
</script>

<style lang="scss">
.notifications
{
  position: fixed;
  right: 1rem;
  bottom: 1rem;
	width: 200px;
	@media all and (max-width: 600px)
	{
	 	width:calc(100% - 2rem);
		left:1rem;
	}
  .notification
  {
		text-align: center;
    background: #757575;
    padding: 0.3rem;
    font-size: 1.2rem;
    font-weight: 600;
    color: white;
		&:not(:last-child)
		{
			margin-bottom: 0.5rem;
		}
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  }
  .notification.success
  {
    background:#43a047;
  }
  .notification.error
  {
    background:#c62828;
  }
  .notification.warning
  {
    background: #f57f17;
  }
}
</style>
