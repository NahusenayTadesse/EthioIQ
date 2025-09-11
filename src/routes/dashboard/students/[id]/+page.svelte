
<script lang='ts'>

  import { LoaderCircle } from "@lucide/svelte";
  import { submitButton } from "$lib/global.svelte.js";
  import ChildrenTable from "$lib/ChildrenTable.svelte";
	import SingleTable from "$lib/SingleTable.svelte";
  import Parents from "$lib/forms/Parents.svelte"
  import Subjects from "$lib/forms/Subjects.svelte"

    let { data } = $props();
    let parents = $state(data.parent);
    let student =  $state(data.student);
    let tutors = $state(data.matches);
    let subjects = $state(data.subjectforStudent);

    let tableHeaders = $state([
    
   
   {name:'Id', key: 'id'},
   {name:'First Name', key: 'firstName'},
   {name:'Last Name', key: 'lastName'},
   {name: 'Phone', key: 'phone'},
   {name:'Gender', key: 'gender'},
   {name: 'Notes', key: 'notes'},
   {name: 'Primary', key: 'isPrimary'},

   {name: 'Active', key: 'isActive'}
  
  ]); 

  let subjectHeaders = $state([
    
   
   {name:'Id', key: 'id'},
   {name:'Name', key: 'name'},
   {name:'Profieciency Level', key: 'ProfieciencyLevel'},
   {name:'Started At', key: 'startedAt'},
   {name:'Assesement Results', key: 'assessmentResult'},

   {name:'Stopped At', key: 'stoppedAt'},

   {name:'Cancel Reason', key: 'cancelReason'},
    {name:'Notes', key: 'notes'}, 
   {name: 'Active', key: 'isActive'}
  
  ]); 

let singleTable = [
    { name: 'Name', value: student.firstName + ' ' + student.lastName },
    { name: 'Gender', value: student.gender },
    { name: 'Age', value: student.age },
    { name: 'Grade', value: student.grade },
    { name: 'Phone', value: student.phone }, // Assuming this is like "Natural" or "Social"
    { name: 'Natural or Social', value: student.naturalOrSocial }, // Assuming this is like "Natural" or "Social"
    { name: 'School', value: student.school },
    { name: 'Fee', value: student.fee },
    { name: 'Location', value: student.location },
    { name: 'Specific Location', value: student.specificLocation },
    { name: 'Notes', value: student.notes },
    { name: 'Active Status', value: student.isActive ? 'Active' : 'Inactive' }
];

let tutorHeaders = $state([
    
   
   {name:'Id', key: 'id'},
   {name:'First Name', key: 'firstName'},
   {name:'Last Name', key: 'lastName'},
   {name: 'Phone', key: 'phone'},
   {name:'Gender', key: 'gender'},
   {name:'Subject', key: 'subject'},
   {name:'Qualification', key: 'qualification'},
   {name:'Hourly Rate', key: 'hourlyRate'},
   {name:'Experience', key: 'Experience'},
   {name: 'Matchdate', key: 'matchDate'},
   {name: 'Notes', key: 'notes'},
   {name: 'Active', key: 'isActive'}
  
  ]); 
import DialogComp from "$lib/formComponents/DialogComp.svelte";

 

</script>
<svelte:head>
   <title> {data.student.firstName} {data.student.lastName}</title>
</svelte:head>
{#snippet content()}
  <Parents data={data.form} id={data.student.id} />
{/snippet}
{#snippet content2()}
  <Subjects data={data.subjectForm} id={data.student.id} subjects={data.allSubjects} action="?/addSubject" />
{/snippet}


  <div class="flex lg:flex-row flex-col sticky top-2 backdrop-blur-lg bg-white/30 dark:bg-dark/30 z-10 gap-4 flex-wrap justify-start items-center">
       <a href="/dashboard/students/{data.student.id}/sessions" class="{submitButton} w-[250px]">Sessions</a>
       <a href="#studentDetials" class="{submitButton} w-[250px]">Student Details</a>
       <a href="#parents" class="{submitButton} w-[250px]">Parents</a>
       <a href="#tutors" class="{submitButton} w-[250px]">Tutors</a>
       <a href="#subjects" class="{submitButton} w-[250px]">Subjects</a>


  </div>


<div class="min-h-screen py-10">
  <div class="bg-white dark:bg-dark shadow-lg dark:shadow-md dark:shadow-gray-600 rounded-md overflow-hidden max-w-3xl">
    <div class="bg-gradient-to-r from-dark to-black text-white py-6 px-8 flex flex-col justify-center items-center">
            <img src={data.student.image} alt="" class="w-[150px]" loading="lazy">

      <h1 class="text-3xl font-bold text-center shadow-sm">Student Details</h1>
    </div>
    <div class="py-8 px-6" id="parents">
      {#await data}
           <h1 class="flex flex-row m-2">     Loading Parent Data <LoaderCircle class="animate-spin" /></h1>

        
      {:then parent} 
       
          <SingleTable {singleTable} />

        {/await}
    </div>
  </div>
</div>

<h1 class="text-4xl font-head">Parents</h1>

 <br /> <br />
 <div class="flex flex-col flex-start gap-4">
<ChildrenTable mainlist = {data.parent} {tableHeaders}link='parents' />
<DialogComp title="Add New Parent" {content} />

</div>

<h1 class="text-4xl font-head" id='tutors'>Tutors</h1>

 <br /> <br />
 <div class="flex flex-col flex-start overflow-x-auto w-[1150px] pr-2">
<ChildrenTable mainlist = {data.matches} tableHeaders = {tutorHeaders} link='tutors'/>
</div>

<h1 class="text-4xl font-head my-6" id="subjects">Subjects</h1>

 <div class="flex flex-col flex-start gap-4">
<ChildrenTable mainlist = {data.subjectforStudent} tableHeaders = {subjectHeaders} />
<DialogComp title="Add New Subject" content={content2} />

</div>




