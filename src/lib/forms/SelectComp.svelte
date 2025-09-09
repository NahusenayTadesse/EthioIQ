 <script lang="ts">
     import * as Select from "$lib/components/ui/select/index.js";
	import { input } from "$lib/global.svelte";
	// import { fly } from "svelte/transition";

    let { value = $bindable(), items, name } = $props();
    function getItemNameById(items: any, value: any) {
  const item = items.find(i=> i.value === value);
  return item ? item.name : null; // returns null if not found
}
 </script>
 <Select.Root type="single" {name} bind:value >
            <Select.Trigger class="w-full capitalize {input}">
                {value === '' ? 'Select '+ name.replace(/([a-z])([A-Z])/g, '$1 $2'): typeof value === 'number'? getItemNameById(items, value) : value} 
            </Select.Trigger>
            <Select.Content>
                 {#each items as item}
                <Select.Item value={item.value} class="hover:bg-gray-100 hover:shadow-md hover:scale-101 duration-300 transition-all ease-in-out dark:hover:bg-gray-900">{item.name}</Select.Item>
                {/each}
                
            </Select.Content>
            
        </Select.Root>

         <!-- {#if value === 'other'}
                 <input type="text" {name} {value} class="{input} mt-4" transition:fly={{y:-20, duration:300}}>
                 {/if} -->
   