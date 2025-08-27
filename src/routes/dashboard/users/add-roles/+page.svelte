<script>
    import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

	import { enhance } from "$app/forms";
    import ChildrenTable from "$lib/ChildrenTable.svelte";
	import { input, label, submitButton } from "$lib/global.svelte.js";
    let {data, form} = $props();



    let tableHeaders = [
         {name: 'Id', key: 'id'},
         {name: 'Name', key: 'name'},
         {name: 'Description', key: 'description'}
    ]

    let grid = "grid lg:grid-cols-2 grid-cols-1 gap";


</script>
 <div class={grid}>
  <div class="w-[90%]">

  
  <h1>Existing Roles</h1>

   <ChildrenTable mainlist={data.allRoles} {tableHeaders} />
   </div>

   <form method="POST" action = "?/addRole" class="space-y-4 w-xl p-4 shadow-lgm-4 rounded-lg bg-white dark:bg-black" use:enhance>
				<div class="mb-6">
				<h1 class="text-center">Create a Role</h1>
				<h1 class="text-center">{form?.message}</h1>
			</div>
				<div>
					<label for="name" class={label}>Role Name</label>
					<input  name="name" type="text"  placeholder="Enter your full name" required class={input} />
				</div>
                <div>
					<label for="description" class={label}>Role Description</label>
					<textarea  name="description"  placeholder="Enter your full name" required class={input} > </textarea>
				</div>
                <div class="">

        <label for="permission" class={label}>Add Permisssions</label>
        <!-- <div class="grid grid-cols-2 gap-2"> -->
     <ScrollArea class="h-[300px] w-full rounded-md border p-4"> 
      <div class="flex flex-col">

        {#each data?.allPermissions as perm}
    <label>
      <input 
        type="checkbox" 
        name="permissions[]"
        value={perm.id}

      />
       {perm.description}
    </label>
    
  {/each}
  </div>
     </ScrollArea>
  <!-- </div> -->
  </div>

                <button type="submit" class="{submitButton} w-full">Create Role</button>
        </form>
</div>

<br /><br />

<div class={grid}>

  <div class="w-[90%] flex flex-col gap-4">

  
  <h1>Existing Subjects</h1>
   <ScrollArea class="w-full h-[350px] rounded-md border" orientation='vertical'>

   <ChildrenTable mainlist={data.allSubjects} {tableHeaders} />

    </ScrollArea>
   </div>

 <div class="w-xl flex flex-col justify-center items-center gap-4">

   <form method="POST" action = "?/addSubject" 
   class="space-y-4 w-full p-4 py-8 shadow-lgm-4 rounded-lg bg-white dark:bg-black flex flex-col justify-center items-center" use:enhance>
            <h1 class="">Create a Subject</h1>
    
    <div class="mb-6">
        <h1 class="text-center">{form?.message}</h1>
      </div>
        <div class="w-full">
          <label for="name" class={label}>Subject Name</label>
          <input  name="name" type="text"  placeholder="Enter Subject name" required class={input} />
        </div>
                <div class="w-full">
          <label for="description" class={label}>Subject Description</label>
          <textarea  name="description"  placeholder="Enter Subject description" required class="{input} w-full" > </textarea>
        </div>
                

                <button type="submit" class="{submitButton} w-full">Create Subject</button>
        </form>
        </div>

</div>

<br /><br />

<div class={grid}>
   
   <div class="w-[90%] flex flex-col gap-4">
  <h1>Existing Locations</h1> 
    <ScrollArea class="w-full h-[350px] rounded-md border" orientation='vertical'>
  
    <ChildrenTable mainlist={data.allLocations} {tableHeaders} />
  
      </ScrollArea>
    </div>

  <div class="w-xl flex flex-col justify-center items-center gap-4 mt-4">
    <form method="POST" action = "?/addLocation" 
    class="space-y-4 w-full p-4 py-8 shadow-lgm-4 rounded-lg bg-white dark:bg-black flex flex-col justify-center items-center" use:enhance>
             <h1 class="">Create a Location</h1>
     
     <div class="mb-6">
         <h1 class="text-center">{form?.message}</h1>
       </div>
         <div class="w-full">
           <label for="name" class={label}>Location Name</label>
           <input  name="name" type="text"  placeholder="Enter Location name" required class={input} />
         </div>
                 <div class="w-full">
           <label for="description" class={label}>Location Description</label>
           <textarea  name="description"  placeholder="Enter Location description" required class="{input} w-full" > </textarea>
         </div>
                 
 
                 <button type="submit" class="{submitButton} w-full">Create Location</button>
         </form>
         </div>
</div>
