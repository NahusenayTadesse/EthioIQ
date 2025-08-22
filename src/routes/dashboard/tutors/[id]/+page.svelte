
<script lang='ts'>

  import { LoaderCircle } from "@lucide/svelte";
  import ChildrenTable from "$lib/ChildrenTable.svelte";
	import SingleTable from "$lib/SingleTable.svelte";
	import { submitButton } from "$lib/global.svelte.js";

    let { data } = $props();
    let matches = $state(data.matches);

    let tutor= $state(data.tutor);

    let subjects = $state(data.subjectforTutor);
    let fields = $state(data.fields);
    let bankAccounts =  $state(data.bankAccounts);

    let tableHeaders = $state([ 
    
   
   {name:'Id', key: 'id'},
   {name:'First Name', key: 'firstName'},
   {name:'Last Name', key: 'lastName'},
   {name: 'Phone', key: 'phone'},
   {name:'Gender', key: 'gender'},
   {name:'Subject', key: 'subject'},
   {name:'Match Date', key: 'matchDate'},
   {name: 'Notes', key: 'notes'},
   {name: 'Active', key: 'isActive'}
  
  ]); 

let singleTable = [
    { name: 'Name', value: tutor.firstName + ' ' + tutor.lastName },
    { name: 'Gender', value: tutor.gender },
    { name: 'Age', value: tutor.age },
    { name: 'Phone', value: tutor.phone }, // Assuming this is like "Natural" or "Social"
    { name: 'Natural or Social', value: tutor.naturalOrSocial }, // Assuming this is like "Natural" or "Social"
    { name: 'Qualifications', value: tutor.qualification },
    { name: 'Location', value: tutor.location },
    { name: 'Specific Location', value: tutor.specificLocation },
    { name: 'Hourly Rate', value: tutor.hourlyRate },
    { name: 'Experience', value: tutor.experience },
    { name: 'Grade Preference', value: tutor.gradePreference },
    { name: 'Hired Date', value: tutor.hireDate },
    { name: 'Notes', value: tutor.notes },
    { name: 'Active Status', value: tutor.isActive ? 'Active' : 'Inactive' }
];


let subjectHeaders = $state([ 
    
   
   {name:'Id', key: 'id'},
   {name:'Name', key: 'name'},
   {name:'Experience', key: 'experience'},
   {name:'Profeciency Level', key: 'profeciencyLevel'},
   {name:'Grade Preference', key: 'gradePreference'},
   {name:'Active Status', key: 'isActive'}
   
   
  
  ]); 

  let fieldHeaders = $state([ 
    
   
   {name:'Id', key: 'id'},
   {name:'Name', key: 'name'},
   {name:'GPA', key: 'gpa'},
   {name:'Method of Study', key: 'methodOfStudy'},
   {name:'Graduation Year', key: 'graduationYear'},
   {name:'Degree Type', key: 'degreeType'},
   {name:'University', key: 'university'}
   
  
  ]); 


  let bankHeader = $state([
     { name: 'Id', key: 'id'},
     { name: 'Payment Method', key: 'name'},
     { name: 'Account Number', key: 'bankAccount'},
     { name: 'Default Account', key: 'idDefault'},
     
  ])
 
  
  
// const fileName = `${data.tutor.firstName} ${data.tutor.lastName} .pdf`;
// const buttonName = `Download ${data.tutor.firstName} as PDF`
 

</script>
<svelte:head>
   <title> {data.tutor.firstName} {data.tutor.lastName}</title>
</svelte:head>
  

   <a href="/dashboard/tutors/{data.tutor.id}/sessions" class="{submitButton} w-[250px]">Sessions</a>


<div class="min-h-screen py-10">
  <div class="bg-white dark:bg-dark shadow-lg dark:shadow-md dark:shadow-gray-600 rounded-md overflow-hidden max-w-3xl">
    <div class="bg-gradient-to-r from-dark to-black text-white py-6 px-8">
      <h1 class="text-3xl font-bold text-center shadow-sm">Tutors Details</h1>
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
<ChildrenTable mainlist = {matches} {tableHeaders} />
</div>




<h1 class="text-4xl font-head my-4">Subjects</h1>

 <div class="flex flex-col flex-start">
<ChildrenTable mainlist = {subjects} tableHeaders = {subjectHeaders} />
</div>

<h1 class="text-4xl font-head my-4">Fields</h1>

 <div class="flex flex-col flex-start">
<ChildrenTable mainlist = {fields} tableHeaders = {fieldHeaders} />
</div>

 <h1 class="text-4xl font-head my-4">Bank Accounts</h1>


 <div class="flex flex-col flex-start">

<ChildrenTable mainlist = {bankAccounts} tableHeaders = {bankHeader} />
</div>





