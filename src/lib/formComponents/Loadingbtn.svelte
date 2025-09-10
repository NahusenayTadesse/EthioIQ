
<script>

//  import  { Loader } from "@lucide/svelte";
  let { name } = $props()
</script>
<div class="flex flex-row gap-2 align-self-center justify-self-center-safe items-center">
<img src="/loader.svg" class="animate-spin w-6 h-6 dark:hidden" alt="">
<img src="/loader2.svg" class="animate-spin w-6 h-6 hidden dark:block" alt="">

<span class="animate-pulse">{name}...</span>
</div>
