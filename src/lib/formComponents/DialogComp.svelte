<script lang="ts">
 import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
    	import { submitButton } from "$lib/global.svelte";


 let { title, content} = $props();
</script>
 
<Dialog.Root>
 <Dialog.Trigger class="{submitButton} w-[140px]"
  >{title}</Dialog.Trigger
 >
 <Dialog.Content class="w-full">
  <Dialog.Header>
   <Dialog.Title>{title}</Dialog.Title>
  </Dialog.Header>
  <ScrollArea class="h-128 rounded-md border p-2">

  {@render content()}
  </ScrollArea>
 </Dialog.Content>
</Dialog.Root>
