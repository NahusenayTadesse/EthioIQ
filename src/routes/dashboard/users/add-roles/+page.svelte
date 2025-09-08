<script lang="ts">
    import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

    import ChildrenTable from "$lib/ChildrenTable.svelte";
	import { input, label, submitButton } from "$lib/global.svelte.js";
    let {data} = $props();
    


    let tableHeaders = [
         {name: 'Id', key: 'id'},
         {name: 'Name', key: 'name'},
         {name: 'Description', key: 'description'}
    ]

    let grid = "grid lg:grid-cols-2 grid-cols-1 gap";

   import { superForm } from 'sveltekit-superforms';
	import type { Snapshot } from './$types.js';
	import Loadingbtn from '$lib/forms/Loadingbtn.svelte';
    const {
    form: subjectForm,
    errors: subjectErrors,
    enhance: subjectEnhance,
    constraints: subjectConstraints,
    delayed: subjectDelayed,
    message: subjectMessage,
    capture: subjectCapture,
    restore: subjectRestore
  } = superForm(data?.subjectForm);


     const {
    form:  roleForm,
    errors: roleErrors, 
    enhance: roleEnhance,
    constraints: roleConstraints,
    delayed: roleDelayed,
    message: roleMessage,
    capture,
    restore
  } = superForm(data.roleForm);

    export const snapshot: Snapshot = { capture, restore, subjectCapture, subjectRestore };



</script>
{#snippet fe(labeler="", type="text", name='', placeholder="", form, error, constraints)}

        <div class="w-full">
					<label for={name} class={label} >{labeler}</label>
          
					<input {name} {type}  {placeholder} class={input} 
          bind:value={form[name]}
          aria-invalid={error[name] ? 'true' : undefined}
				{...constraints[name]} />
				</div>

        {#if error[name]}
				<span class="text-red-500">{error[name]}</span>
			{/if}
  
{/snippet}
 <div class={grid}>
  <div class="w-[90%]">

  
  <h1>Existing Roles</h1>

   <ChildrenTable mainlist={data.allRoles} {tableHeaders} />
   </div>

   <form method="POST" action = "?/addRole" 
   class="space-y-4 w-xl p-4 shadow-lgm-4 rounded-lg bg-white dark:bg-black" 
   use:roleEnhance>
				<div class="mb-6">
				<h1 class="text-center">Create a Role</h1>
			</div>
			
        {@render fe("Role Name", "text", 'name', "Enter your full name", $roleForm, $roleErrors, $roleConstraints)}
                <div>
					<label for="description" class={label}>Role Description</label>
					<textarea  
          name="description" placeholder="Enter your full name" 
           class={input} 
          bind:value={$roleForm.description}
          aria-invalid={$roleErrors.name ? 'true' : undefined}
				{...$roleConstraints.description}> </textarea>
         {#if $roleErrors.description}
				<span class="text-red-500">{$roleErrors.description}</span>
			{/if}
				</div>
                <div class="">

        <label for="permissions" class={label}>Add Permisssions</label>
        <!-- <div class="grid grid-cols-2 gap-2"> -->
     <ScrollArea class="h-[300px] w-full rounded-md border {$roleErrors.permissions} p-4"> 
      <div class="flex flex-col">

        {#each data?.allPermissions as perm}
    <label>
      <input 
        type="checkbox" 
        name="permissions"
        value={perm.id}
        bind:group={$roleForm.permissions}
      />
       {perm.description}
    </label>
    
  {/each}
      
  </div>
     </ScrollArea>
     {#if $roleErrors.permissions}
				<span class="text-red-500">{$roleErrors.permissions._errors}</span>
			{/if}
  <!-- </div> -->
  </div>

                <button type="submit" class="{submitButton} w-full">

                  {#if $roleDelayed}
                  <Loadingbtn name="Creating Role" />
                  {:else}
                  Create Role
                {/if}
              </button>
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
   class="space-y-4 w-full p-4 py-8 shadow-lg m-4 rounded-lg bg-white dark:bg-black flex flex-col justify-center items-center" 
   
   use:subjectEnhance>
            <h1 class="">Create a Subject</h1>


        {@render fe("Subject Name", "text", 'name', "Enter Subject Name",  $subjectForm, $subjectErrors, $subjectConstraints)}

                <div class="w-full">
          <label for="description" class={label}>Subject Description</label>
          <textarea  name="description" 
           placeholder="Enter Subject description" 
            class="{input} w-full" 
            aria-invalid={$subjectErrors.description ? 'true' : undefined}
				{...$subjectConstraints.description} 
         bind:value={$subjectForm.description}> </textarea>
        {#if $subjectErrors.description}
				<span class="text-red-500">{$subjectErrors.description}</span>
			{/if}
         
        </div>
                

                <button type="submit" class="{submitButton} w-full">

                  {#if $subjectDelayed}
                  <Loadingbtn name="Creating Subject" />
                  {:else}
                  Create Subject
                {/if}</button>
        </form>
        </div>

</div>

<br /><br />
<!-- 
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
</div> -->
