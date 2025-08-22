<script lang='ts'>
	import { enhance } from "$app/forms";
	import { input, label, select, submitButton } from "$lib/global.svelte.js";
	import ChildrenTable from "$lib/ChildrenTable.svelte";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import { SquarePen, Save, BadgeCheck } from "@lucide/svelte";
	import DialogClose from "$lib/components/ui/dialog/dialog-close.svelte";

	




	let tableHeaders= $state(
		 [
			{name: 'Id', key: 'id'},
			{name: 'Role Name', key: 'roleName'},
			{name: 'Permission Name', key: 'permissionName'}
			
		 ])
    let {data, form} = $props();

	let showPermission = $state(false)

	let selected = $state();

	let allRolePermissions = $state(data.allRolePermissions);

function hasPermission(
  roleId: number,
  permissionId: number
): boolean {
  return allRolePermissions.some(
    (rp) => rp.roleName === roleId && rp.permissionName === permissionId
  );
} 


 let customPerm = $state(false)

</script>
<svelt:head>
	<title>Add User</title>
</svelt:head>

<h1>{form?.message}</h1>
<div class="bg-background text-foreground min-h-screen flex items-center justify-center p-4">
	<div class="w-full max-w-full flex lg:flex-row flex-col gap-4 flex-wrap justify-center">
		<div class="w-xl bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-800">
			

			<form method="POST" action="?/register" class="space-y-4" use:enhance>
				<div class="mb-6">
				<h1 class="text-center">Create User</h1>
			</div>
				<!-- Email Input -->
				<div>
					<label for="email" class={label}>Email Address</label>
					<input id="email" name="email" type="email" placeholder="Enter your email" required class={input} />
				</div>

				<!-- Name Input -->
				<div>
					<label for="name" class={label}>Full Name</label>
					<input id="name" name="name" type="text" placeholder="Enter your full name" required class={input} />
				</div>

				<!-- Password Input -->
				<!-- <div>
					<label for="password" class={label}>Password</label>
					<input id="password" name="password" type="password" placeholder="Create a password" required class={input} />
				</div> -->

				<!-- Role Select -->
				<div>
					<label for="role" class={label}>Role</label>
					<select id="role" name="role" required bind:value={selected} 
                     onchange={() => showPermission = selected !== ""}					class={select}>
						<option value="" class="text-gray-500">Select your role</option>
						{#each data.allroles as role}
						<option value={role.id} class="text-gray-900 dark:text-white">{role.name}</option>
						{/each}
					</select>
					<input type="hidden" value={customPerm} name="customPerm">
				</div>
				{#if customPerm}
				<p class="bg-green-400 p-2 w-auto rounded-lg animate-pulse justify-self-center text-white text-center">Using Custom Permissions</p>
				{/if}
				

{#if showPermission}
<Dialog.Root>
  <Dialog.Trigger  class="{submitButton} w-full flex flex-row gap-2"><SquarePen class="w-4 h-4" /> Customize User Permission</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title class="text-center text-2xl">Give New User custom permissions</Dialog.Title>
      <Dialog.Description>
<div class="h-[95%] overflow-y-auto">
        {#each data.allPermissions as perm}
    <label>
      <input 
        type="checkbox" 
        name="permissions[]"
        value={perm.id}

    checked={hasPermission(+selected, perm.id)}
      />
       {perm.description}
    </label>
    <br>
  {/each}
  
  </div>      </Dialog.Description>
    </Dialog.Header>
	 <Dialog.DialogFooter>
	 <div class="w-full flex flex-row justify-between items-between">
		<DialogClose class="{submitButton} px-4" onclick={()=> customPerm = false}>Use Default Permissions</DialogClose>
		<DialogClose >
		 <button 
		 class="{submitButton} px-4 flex flex-row gap-2 {customPerm ? '!bg-green-400 !text-white': ''}"
		  onclick={()=> customPerm = true} >
			{#if customPerm}
			<BadgeCheck class="w-6 h-6" />
			 Permissions Saved
			{:else}
			<Save class="w-4 h-4" />
			 Save Custom Permissions
			 {/if}
		 </button>
		 </DialogClose>
		 
	 </div>
   </Dialog.DialogFooter>
  </Dialog.Content>
  
</Dialog.Root>
{:else}
<Popover.Root >
  <Popover.Trigger class="{submitButton} !bg-gray-400 !text-white cursor-not-allowed opacity-50 w-full flex flex-row gap-2"><SquarePen class="w-4 h-4" />Customize user permission</Popover.Trigger>
  <Popover.Content class="bg-dark dark:bg-white dark:text-black text-white text-xl">Please Choose a role first to customize permissions.</Popover.Content>
</Popover.Root>
{/if}
				<button type="submit" class="{submitButton} w-full">Create User</button>
          

			</form>



			


			<!-- Additional Info -->
			
		</div>
	</div>
</div>


<ChildrenTable mainlist={data.allRolePermissions} {tableHeaders} search=true />
