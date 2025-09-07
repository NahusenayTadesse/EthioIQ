<script lang="ts">
	import '../app.css';
	import { getFlash } from 'sveltekit-flash-message';
  import { page } from '$app/state';
  import { toastmsg, errormsg } from '$lib/global.svelte';

  const flash = getFlash(page, { clearAfterMs: 5000 });

	  import { ModeWatcher } from "mode-watcher";


	let { children } = $props();
</script>
<ModeWatcher />
{#if $flash}
 
  <div class={$flash.type==='success' ? toastmsg: errormsg} >{$flash.message}</div>
{/if}

{@render children()}
