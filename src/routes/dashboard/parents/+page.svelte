<script lang='ts'>
	import { submitButton } from '$lib/global.svelte.js';
  import Table from '$lib/Table.svelte';
	import { BrushCleaning, Mars, RotateCcw, SlidersHorizontal, Venus } from '@lucide/svelte';
	import { fly } from 'svelte/transition';


   let { data } = $props();

   let parents = $state(data.allParents);

   let tableHeaders = $state([
    
   
   {name:'Id', key: 'id'},
   {name:'First Name', key: 'firstName'},
   {name:'Last Name', key: 'lastName'},
   {name:'Gender', key: 'gender'},
   {name: 'Phone', key: 'phone'},
   {name:'Student Count', key: 'studentCount'},
   {name: 'Active', key: 'isActive'}
  
  ]);
  let componentKey = $state(0);

  function reloadComponent() {
        componentKey++;
        parents = data.allParents;
 } 

  let openFilter = $state(false)

  let fileName = 'Ethio IQ Parents List';


   
type Parent = {
  [key: string]: any;
};

function filter(key: string, value: any): void {
  parents = parents.filter((person: Parent) => person[key] === value);
}

   let firstNames = $derived([...new Set(parents.map(parent => parent.firstName))]);
   let lastNames = $derived([...new Set(parents.map(parent => parent.lastName))]);
   let genders = $derived([...new Set(parents.map(parent => parent.gender))]);
   let count= $derived([...new Set(parents.map(parent => parent.studentCount))]);
   let active = $derived([...new Set(parents.map(parent => parent.isActive))]);
  

   let filterNames = $derived([ 
    
   {key: genders, name: 'Gender', query: 'gender'},
   {key: active, name: 'Active Status', query: 'isActive'},
   {key: firstNames, name: 'First Name', query: 'firstName'},
   {key: lastNames, name: 'Last Name', query: 'lastName'},
   {key: count, name: 'Student Counts', query: 'studentCount'}
  
  ]);


</script>

 <svelte:head>
   <title> Parents </title>
 </svelte:head>





<button onclick={()=> openFilter = !openFilter} aria-label="Advanced Filter" title="Filter Table"><SlidersHorizontal  /> </button><br/>

  {#if openFilter}
<div class="flex flex-col gap-2" transition:fly={{x:-200, duration: 600}}>
  
  <button onclick={()=> parents = data.allParents} class="{submitButton} !w-[120px] flex flex-row gap-2 justify-center items-center" title="Clear Filter">
    <BrushCleaning size=18 /> Clear</button>
  

  {#each filterNames as filterName}
  <h1 class="cap">{filterName.name}</h1>
  <div class="flex flex-row gap-2 flex-wrap"> 
  {#each filterName.key as filterKey}
 <button onclick={()=> filter(filterName.query, filterKey)} 
  
  class="{submitButton} p-4 capitalize flex flex-row gap-2 
  {
  filterName.name === 'Active Status'
    ? filterKey
      ? '!bg-green-500'
      : '!bg-red-500'
    : ''
}
}" title="Only include Data where {filterName.name} is {filterKey}">{#if filterKey === "male"}
  <Mars /> {/if}
  {#if filterKey === 'female'} 
   <Venus />  
  {/if}
  {filterName.name === 'Active Status'
    ? filterKey
      ? 'Active'
      : 'In Active'
    : filterKey}</button>
  {/each}
 
</div>
 {/each}
 </div>
{/if}
<br />
{#key componentKey}

<button onclick={reloadComponent} class="aboslute right-0 top-0" aria-label="Relaod Table" title="Reload Table" > <RotateCcw  /></button>
<Table mainlist={parents} {tableHeaders} {fileName} />
{/key}
