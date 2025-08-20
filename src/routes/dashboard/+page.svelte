




  <script >
	import Copy from '$lib/Copy.svelte';

  let { data } = $props();
</script>
<svelte:head>
   <title> Dashboard </title>
 </svelte:head>
 <h1>Welcome {data.role.name}</h1>

<div class="p-4 w-[550px] rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  {#if data.birthdayPerson.length}
  {#each data.birthdayPerson as people}
    
      <div>
        <h2 class="text-xl font-semibold border-b pb-2 mb-4 capitalize border-gray-300 dark:border-gray-700">
          {people.type}
        </h2>
        <ul class="space-y-2">
            <li class="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow-sm">
              <p class="font-medium">Name: {people.firstName} {people.lastName}</p> 
              <p class="font-medium"> Phone Number: <Copy data={people.phone} /> </p>
              <p class="font-medium"> Age: {people.age} </p>

               
            </li>
        </ul>
      </div>
   
  {/each}
  {:else}

     <h2 class="text-xl font-semibold border-b pb-2 mb-4 capitalize border-gray-300 dark:border-gray-700">
          No Birthdays Today
        </h2>
   {/if}
</div>




