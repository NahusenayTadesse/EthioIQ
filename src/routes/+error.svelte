

 <script>
    import { page } from '$app/state'
	import { submitButton } from '$lib/global.svelte';
 </script>
<div class="h-screen w-screen flex flex-col justify-center items-center">
    <h1 class="text-red-600 text-9xl text-center">{page.status}</h1>

 <h3 class="text-red-600  font-head text-center">{@html page.error?.message}</h3>

 <a href="/dashboard" class="{submitButton} my-2 w-[250px]">Back to Dashboard</a>
 </div> 
