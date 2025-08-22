<script>
	import { enhance } from "$app/forms";
    import ChildrenTable from "$lib/ChildrenTable.svelte";
	import { input, label, submitButton } from "$lib/global.svelte.js";
    let {data, form} = $props();
    let roles = $state(data.allRoles);


    let tableHeaders = [
         {name: 'Id', key: 'id'},
         {name: 'Name', key: 'name'},
         {name: 'Description', key: 'description'}
    ]

</script>

  <h1>Existing Roles</h1>
   <ChildrenTable mainlist={data.allRoles} {tableHeaders} />

   <form method="POST"  class="space-y-4 w-2xl p-4 shadow-lg bg-white m-4 rounded-lg" use:enhance>
				<div class="mb-6">
				<h1 class="text-center">Create Role</h1>
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
        <div class="grid grid-cols-2 gap-2">
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
  </div>

                <button type="submit" class="{submitButton} w-full">Create Role</button>
        </form>

