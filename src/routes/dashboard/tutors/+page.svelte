


<script lang='ts'>
	import { submitButton } from '$lib/global.svelte.js';
  import Table from '$lib/Table.svelte';
	import { BrushCleaning, Mars, RotateCcw, SlidersHorizontal, Venus } from '@lucide/svelte';
	import { fly } from 'svelte/transition';


   let { data } = $props();

   let tutors = $state(data.alltutors);

   let tableHeaders = $state([
    
   
   {name:'Id', key: 'id'},
   {name:'First Name', key: 'firstName'},
   {name:'Last Name', key: 'lastName'},
   {name:'Gender', key: 'gender'},
   {name: 'Age', key: 'age'},
   {name:'Natural or Social', key: 'naturalOrSocial'},
   {name: 'Qualification', key: 'qualification'},   
   {name: 'Location', key: 'location'},
   {name: 'Hourly Rate', key: 'hourlyRate' },
   {name: 'Number of Students', key: 'studentCount'},
   {name: 'Experience', key: 'experience'},   
   {name: 'Grade Preference', key: 'gradePreference'},   
   {name: 'Notes', key: 'notes'},
   {name: 'Active', key: 'isActive'}
  
  ]);
  let componentKey = $state(0);

  function reloadComponent() {
        componentKey++;
        tutors = data.alltutors;
 } 

  let openFilter = $state(false)

  let fileName = 'Ethio IQ Parents List';


   
type Parent = {
  [key: string]: any;
};

function filter(key: string, value: any): void {
  tutors = tutors.filter((person: Parent) => person[key] === value);
}


   let genders = $derived([...new Set(tutors.map(tutor => tutor.gender))]);
   let naturalOrSocial = $derived([...new Set(tutors.map(tutor => tutor.naturalOrSocial))]);
   let locations = $derived([...new Set(tutors.map(tutor => tutor.location))]);
   let hourlyRates = $derived([...new Set(tutors.map(tutor => tutor.hourlyRate))]);
   let qualifications= $derived([...new Set(tutors.map(tutor => tutor.qualification))]);
   let experiences = $derived([...new Set(tutors.map(tutor => tutor.experience))]);
   let ages = $derived([...new Set(tutors.map(tutor => tutor.age))]);
   let active = $derived([...new Set(tutors.map(tutor => tutor.isActive))]);
   let studentCounts = $derived([...new Set(tutors.map(tutor => tutor.studentCount))]);
   let preferences = $derived([...new Set(tutors.map(tutor => tutor.gradePreference))]);


  

   let filterNames = $derived([ 
    
   {key: genders, name: 'Gender', query: 'gender'},
   {key: naturalOrSocial, name: 'Natural or Social', query: 'naturalOrSocial'},
   {key: ages, name: 'Age', query: 'age'},
   {key: qualifications, name: 'Qualification', query: 'qualification'},
   {key: hourlyRates, name: 'Hourly Rate', query: 'hourlyRate'},
   {key: experiences, name: 'Experience', query: 'experience'},
   {key: studentCounts, name: 'Student Count', query: 'studentCounts'},
   {key: preferences, name: 'Grade Preference', query: 'gradePreference'},
   {key: locations, name: 'Locations', query: 'location'},
   {key: active, name: 'Active Status', query: 'isActive'},
  
  ]);


</script>

 <svelte:head>
   <title> Tutors </title>
 </svelte:head>

<a href="/dashboard/tutors/add-tutors">Add Tutors</a>


<button onclick={()=> openFilter = !openFilter} aria-label="Advanced Filter" title="Filter Table"><SlidersHorizontal  /> </button><br/>

  {#if openFilter}
<div class="flex flex-col gap-2" transition:fly={{x:-200, duration: 600}}>
  
  <button onclick={()=> tutors = data.alltutors} class="{submitButton} !w-[120px] flex flex-row gap-2 justify-center items-center" title="Clear Filter">
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
 <div class= "w-[85%] pr-4">
 <Table mainlist = {tutors} {tableHeaders} {fileName}  />
</div>
{/key}

