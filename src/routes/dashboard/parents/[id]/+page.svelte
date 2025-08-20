
<script lang='ts'>

  import { LoaderCircle } from "@lucide/svelte";
  import ChildrenTable from "$lib/ChildrenTable.svelte";
	import SingleTable from "$lib/SingleTable.svelte";

    let { data } = $props();


    let children = $state(data.children);
    let parent = $state(data.parent);

    let tableHeaders = $state([
    
   
   {name:'Id', key: 'id'},
   {name:'First Name', key: 'firstName'},
   {name:'Last Name', key: 'lastName'},
   {name: 'Birthday', key: 'dateOfBirth'},
   {name:'Gender', key: 'gender'},
   {name:'Grade', key: 'grade'},
   {name: 'Natural or Social', key: 'naturalOrSocial'},
   {name: 'School', key: 'school'},
   {name: 'Notes', key: 'notes'},
   {name: 'Active', key: 'isActive'}
  
  ]);


  
  
// const fileName = `${data.parent.firstName} ${data.parent.lastName} .pdf`;
// const buttonName = `Download ${data.parent.firstName} as PDF`;


let singleTable = [
    { name: 'Name', value: parent.firstName + ' ' + parent.lastName },
    { name: 'Gender', value: parent.gender },
    { name: 'Phone', value: parent.phone }, 
    { name: 'Address', value: parent.address },
    { name: 'Notes', value: parent.notes },
    { name: 'Active Status', value: parent.isActive ? 'Active' : 'Inactive' }
];
 

</script>
<svelte:head>
   <title> {data.parent.firstName} {parent.lastName}</title>
</svelte:head>



<div class="min-h-screen py-10">
  <div class="bg-white dark:bg-dark shadow-lg dark:shadow-md dark:shadow-gray-600 rounded-md overflow-hidden max-w-3xl">
    <div class="bg-gradient-to-r from-dark to-black text-white py-6 px-8">
      <h1 class="text-3xl font-bold text-center shadow-sm">Parent Details</h1>
    </div>
    <div class="py-8 px-6">
      {#await data}
           <h1 class="flex flex-row m-2">     Loading Parent Data <LoaderCircle class="animate-spin" /></h1>

        
      {:then parent} 
        
          <SingleTable {singleTable} />



       
      
        {/await}
    </div>
  </div>
</div>

<h1 class="text-4xl font-head">Students</h1>

 <br /> <br />
 <div class="flex flex-col flex-start">
<ChildrenTable mainlist = {children} {tableHeaders} link='students' />
</div>