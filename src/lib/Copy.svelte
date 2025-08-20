<script lang='ts'>


    let message = $state('');
    async function copyPhoneNumber(copied: string) {
    try {
      await navigator.clipboard.writeText(copied);
      message = 'Copied!';
      setTimeout(() => (message = ''), 2000);

    } catch (err) {
      message = 'Failed to copy!';
      console.error(err);
      setTimeout(() => (message = ''), 2000);

    }
  }

    let { data } = $props();
</script> 

  <button onclick = {()=> copyPhoneNumber(data)} title= 'Copy {data}'> {data} <span class="text-blue-500 dark:text-blue-400">{message}</span> </button> 
 