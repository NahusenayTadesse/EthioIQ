<script lang='ts'>
	import { submitButton } from '$lib/global.svelte.js';
  import Table from '$lib/Table.svelte';
	import { BrushCleaning, Mars, RotateCcw, SlidersHorizontal, Venus } from '@lucide/svelte';
	import { fly } from 'svelte/transition';


   let { data } = $props();

   let students = $state(data.allStudents);

   let tableHeaders = $state([
    
   
   {name:'Id', key: 'id'},
   {name:'First Name', key: 'firstName'},
   {name:'Last Name', key: 'lastName'},
   {name:'Gender', key: 'gender'},
   {name: 'Age', key: 'age'},
   {name: 'Phone', key: 'phone'},
   {name: 'Grade', key: 'grade'},   
   {name:'Natural or Social', key: 'naturalOrSocial'},
   {name: 'Location', key: 'location'},
   {name: 'School', key: 'school' },
   {name: 'Fee', key: 'fee'},   
   {name: 'Notes', key: 'notes'},
   {name: 'Active', key: 'isActive'}
  
  ]);
  let componentKey = $state(0);

  function reloadComponent() {
        componentKey++;
        students = data.allStudents;
 } 

  let openFilter = $state(false)

  let fileName = 'Ethio IQ Parents List';


   
type Parent = {
  [key: string]: any;
};

function filter(key: string, value: any): void {
  students = students.filter((person: Parent) => person[key] === value);
}


   let genders = $derived([...new Set(students.map(student => student.gender))]);
   let naturalOrSocial = $derived([...new Set(students.map(student => student.naturalOrSocial))]);
   let locations = $derived([...new Set(students.map(student => student.location))]);
   let schools = $derived([...new Set(students.map(student => student.school))]);
   let grades= $derived([...new Set(students.map(student => student.grade))]);
   let fees = $derived([...new Set(students.map(student => student.fee))]);
   let ages = $derived([...new Set(students.map(parent => parent.age))]);
   let active = $derived([...new Set(students.map(parent => parent.isActive))]);
  

   let filterNames = $derived([ 
    
   {key: genders, name: 'Gender', query: 'gender'},
   {key: grades, name: 'Grade', query: 'grade'},
   {key: naturalOrSocial, name: 'Natural or Social', query: 'naturalOrSocial'},
   {key: ages, name: 'Age', query: 'age'},
   {key: schools, name: 'School', query: 'school'},
   {key: fees, name: 'Fee', query: 'fee'},
   {key: locations, name: 'Locations', query: 'location'},
   {key: active, name: 'Active Status', query: 'isActive'},
  
  ]);


</script>

 <svelte:head>
   <title> Students </title>
 </svelte:head>





<button onclick={()=> openFilter = !openFilter} aria-label="Advanced Filter" title="Filter Table"><SlidersHorizontal  /> </button><br/>

  {#if openFilter}
<div class="flex flex-col gap-2" transition:fly={{x:-200, duration: 600}}>
  
  <button onclick={()=> students = data.allStudents} class="{submitButton} !w-[120px] flex flex-row gap-2 justify-center items-center" title="Clear Filter">
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
    : filterKey}  </button>
  {/each}
 
</div>
 {/each}
 </div>
{/if}
<br />
{#key componentKey}

<button onclick={reloadComponent} class="aboslute right-0 top-0" aria-label="Relaod Table" title="Reload Table" > <RotateCcw  /></button>
 <div class= "w-3/4 overflow-auto p-2">
 <Table mainlist = {students} {tableHeaders}  />
</div>
{/key}

