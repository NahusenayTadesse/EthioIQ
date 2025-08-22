<script>
    import SingleTable from "$lib/SingleTable.svelte";
    import ChildrenTable from "$lib/ChildrenTable.svelte";
    import {LoaderCircle } from "@lucide/svelte"
    let {data}= $props();
    let user = $state(data.singleUser);
    let permissions = $state(data.userRolePermissions);
    let specialpermissions = $state(data.userSpecialPermissions);
 let singleTable = [
    {name: "Name", value: user.name },
    {name: "Email", value: user.email },
    {name: "Role", value: user.role},
    {name: "Active Status", value: user?.isActive },
    {name: "Became a User", value: user?.created },
    {name: "Session Expires", value: user?.sessionExpiry },
 ]

 let tableHeaders = [ 
     {name: "Id", key: 'id'},
     {name: "Name", key: 'name'},
     {name: "Description", key: 'description'}
 ]

</script> 


<div class="min-h-screen py-10">
  <div class="bg-white dark:bg-dark shadow-lg dark:shadow-md dark:shadow-gray-600 rounded-md overflow-hidden max-w-3xl">
    <div class="bg-gradient-to-r from-dark to-black text-white py-6 px-8">
      <h1 class="text-3xl font-bold text-center shadow-sm">User Details</h1>
    </div>
    <div class="py-8 px-6">
      {#await data}
           <h1 class="flex flex-row m-2">     Loading Parent Data <LoaderCircle class="animate-spin" /></h1>

        
      {:then user} 
       
          <SingleTable {singleTable} />

        {/await}
    </div>
  </div>
</div>

<h1 class="text-4xl font-head">Permissions</h1>

 <br /> <br />
  
 <div class="flex flex-col flex-start">
    <ChildrenTable mainlist={permissions} {tableHeaders} />
    <ChildrenTable mainlist={specialpermissions} {tableHeaders} />
</div>

