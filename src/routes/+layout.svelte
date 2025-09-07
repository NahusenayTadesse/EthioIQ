<script lang="ts">
	import '../app.css';
	import { getFlash } from 'sveltekit-flash-message';
  import { page } from '$app/state';
  import { toastmsg, errormsg } from '$lib/global.svelte';

  const flash = getFlash(page, { clearAfterMs: 5_000 });

	  import { ModeWatcher } from "mode-watcher";


	let { children } = $props();
</script>
<ModeWatcher />
{#if $flash}
  {@const bg = $flash.type == 'success' ? toastmsg: errormsg}
  <div class={bg} >{$flash.message}</div>
{/if}

{@render children()}
