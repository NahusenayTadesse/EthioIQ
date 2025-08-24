<script lang='ts'>
	import ChildrenTable from '$lib/ChildrenTable.svelte';
	import { RotateCcw } from '@lucide/svelte';



   let { data } = $props();

   let users = $state(data.users);


  

   let tableHeaders = $state([
    
   
   {name:'Id', key: 'id'},
   {name:'Name', key: 'userName'},
   {name:'Email', key: 'email'},
   {name:'Role', key: 'role'},
   {name: 'Active', key: 'isActive'}

  
  ]);



  

  let componentKey = $state(0);

  function reloadComponent() {
        componentKey++;
        users = data.users;
 } 


let fileName = 'Ethio Iq System Users'





   let tableHeaders2 = $state([
    
   
   {name:'Id', key: 'id'},
   {name:'Name', key: 'name'},
   {name:'Description', key: 'description'},


  
  ]);

  




  let selected = $state([]);


  
function toggleSelection(id) {
    if (selected.includes(id)) {
      selected = selected.filter(item => item !== id);
    } else {
      selected = [...selected, id];
    }
  }




</script>

 <svelte:head>
   <title> Users </title>
 </svelte:head>




<br />
{#key componentKey}

<button onclick={reloadComponent} class="aboslute right-0 top-0" aria-label="Relaod Table" title="Reload Table" > <RotateCcw  /></button>
 <div class= "flex flex-start flex-col">
 <ChildrenTable mainlist = {users} {tableHeaders} search=true link="users" />
</div>
{/key}



