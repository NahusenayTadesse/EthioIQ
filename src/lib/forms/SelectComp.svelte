 <script lang="ts">
     import * as Select from "$lib/components/ui/select/index.js";
	import { input } from "$lib/global.svelte";

    let { value, items, name, required=true } = $props();
    function getItemNameById(items: any, value: any) {
  const item = items.find(i=> i.value === value);
  return item ? item.name : null; // returns null if not found
}
 </script>
 <Select.Root type="single" {name} required={required} bind:value>
            <Select.Trigger class="w-full capitalize {input}">
                {value === '' ? 'Select '+ name: typeof value === 'number'? getItemNameById(items, value) : value}
            </Select.Trigger>
            <Select.Content>
                 {#each items as item}
                <Select.Item value={item.value}>{item.name}</Select.Item>
                {/each}
            </Select.Content>
            
        </Select.Root>
   