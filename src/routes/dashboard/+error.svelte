

 <script>
    import { page } from '$app/state'
	import { submitButton } from '$lib/global.svelte';
 </script>

 <h1 class="text-red-600">{page.status}</h1>

 <h3 class="text-red-600 font-head">{page.error?.message}</h3>

 <a href="/dashboard" class="{submitButton} my-2 w-[250px]">Back to Dashboard</a>