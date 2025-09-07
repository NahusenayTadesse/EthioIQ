
<script>

 import  { Loader } from "@lucide/svelte";
  let { name } = $props()
</script>
<div class="flex flex-row gap-2 align-self-center justify-self-center-safe">
<Loader class="h-6 w-6  animate-spin" /> 
<span class="animate-pulse">{name}...</span>
</div>
