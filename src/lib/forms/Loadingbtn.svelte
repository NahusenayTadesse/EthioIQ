
<script>

 import  { Loader } from "@lucide/svelte";
  let { name } = $props()
</script>
<div class="flex flex-row gap-2">
<Loader class="h-4 w-4 animate-spin" /> 
<span class="animate-pulse">{name}...</span>
</div>
