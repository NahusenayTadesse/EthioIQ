<script>
          import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
	import { label } from "$lib/global.svelte";

    let { name, items, required=true} = $props();

</script>

<RadioGroup.Root value="true" required={required}> 
        <label for="" class={label}> Is the Account the Default Account for the Employee?</label>

        {#each items as item}

  <div class="flex items-center  space-x-2">
    <RadioGroup.Item value={item.value} id="option-one" />
    <label class={label} for="true">{item.name}</label>
  </div>
  {/each}

</RadioGroup.Root>