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

</script>
 <div class="grid lg:grid-cols-2 grid-cols-1 gap">
  <div class="w-[90%]">

  
  <h1>Existing Roles</h1>

   <ChildrenTable mainlist={data.allRoles} {tableHeaders} />
   </div>

   <form method="POST"  class="space-y-4 w-lg p-2 shadow-lgm-4 rounded-lg" use:enhance>
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
