<script lang="ts">
 import { Skeleton } from "$lib/components/ui/skeleton/index.js";
 import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
   const headers = Array.from({ length: 5 });

 let {tableHeaders = headers } = $props();


  const rows = Array.from({ length: 10 });

</script>
<ScrollArea class="w-[90%]" >

<table class="w-full divide-y divide-gray-200 dark:divide-gray-200 animate-pulse">
  <thead class="bg-gray-200 dark:bg-black">
    <tr>
      {#each tableHeaders as _}
        <th scope="col"
            class="">
          <Skeleton class="px-3 py-3 text-left text-xs font-semibold text-gray-700
             dark:text-gray-300 uppercase tracking-wider relative" />
        </th>
      {/each}
    </tr>
  </thead>

  <tbody class="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-200">
    {#each rows as _}
      <tr>
        {#each tableHeaders as _}
          <td colspan="5" class="">
            <Skeleton class="px-6 py-4 bg-gray-200 text-center text-sm text-gray-500" />
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

</ScrollArea>
