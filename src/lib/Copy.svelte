<script lang='ts'>
  import { Copy, CopyCheck } from '@lucide/svelte'

    let message = $state('');
    let copied = $state(false)
    
        let  Menuicon = $derived (copied ? CopyCheck : Copy);

    async function copyPhoneNumber(copiedText: string) {
  try {
    await navigator.clipboard.writeText(copiedText);
    message = 'Copied!';
    copied = true;

    setTimeout(() => {
      message = '';
      copied = false;
    }, 2000);

  } catch (err) {
    message = 'Failed to copy!';
    copied = false;
    console.error(err);

    setTimeout(() => {
      message = '';
      copied = false;
    }, 2000);
  }
}


    let { data } = $props();
</script> 

  <button onclick = {()=> copyPhoneNumber(data)} title= 'Copy {data}'> {data} <span class="relative p-4">
    <Menuicon class ="w-4 h-4  absolute right-0 top-2  text-black dark:text-white" /> </span> </button> 
 