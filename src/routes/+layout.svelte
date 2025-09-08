<script lang="ts">
	import '../app.css';
	import { getFlash } from 'sveltekit-flash-message';
  import { navigating, page } from '$app/state';
  import { toastmsg, errormsg } from '$lib/global.svelte';

  const flash = getFlash(page, { clearAfterMs: 5000 });

	  import { ModeWatcher } from "mode-watcher";
	import { fly } from 'svelte/transition';
	import { CircleCheckBig, Loader, CircleX } from '@lucide/svelte';


	let { children } = $props();

   let iconify = $state("h-6 w-6 animate-ping")

</script>
<ModeWatcher />
{#if $flash}
 
  <div class="flex flex-row gap-2 
  {$flash.type==='success' ? toastmsg: errormsg}" 
  transition:fly={{x:20, duration: 300  }}>
  {#if $flash.type==='success'}
    <CircleCheckBig class={iconify} />
   {:else}
   <CircleX class={iconify} />
  {/if}
    {$flash.message}

  </div>


{/if}


	{#if navigating.to}
  <div class="fixed z-100 h-screen w-screen flex flex-col justify-center items-center">
    <div class="flex flex-row gap-2 items-center">
		<Loader class="h-16 w-16 animate-spin"/> <h1 class="animate-pulse">Loading {navigating.to.url.pathname}...		 </h1>
    </div>
    </div>
	{/if}

{@render children()}
