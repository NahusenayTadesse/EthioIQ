<script lang='ts'>
	import { enhance } from "$app/forms";
	import { input, label, select, submitButton } from "$lib/global.svelte.js";
	import ChildrenTable from "$lib/ChildrenTable.svelte";


	let tableHeaders= $state(
		 [
			{name: 'Id', key: 'id'},
			{name: 'Role Name', key: 'roleName'},
			{name: 'Permission Name', key: 'permissionName'}
			
		 ])
    let {data, form} = $props();

	let showPermission = $state(false)

	let selected = $state(0);

	let allRolePermissions = $state(data.allRolePermissions);

function hasPermission(
  roleId: number,
  permissionId: number
): boolean {
  return allRolePermissions.some(
    (rp) => rp.roleName === roleId && rp.permissionName === permissionId
  );
}

</script>
<svelt:head>
	<title>Add User</title>
</svelt:head>

<h1>{form?.message}</h1>
<div class="bg-background text-foreground min-h-screen flex items-center justify-start p-4">
	<div class="w-full max-w-full flex lg:flex-row flex-col gap-4 flex-wrap">
		<div class="w-md bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-800">
			

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
					<select id="role" name="role" required bind:value={selected} class={select}>
						<option value="" class="text-gray-500">Select your role</option>
						{#each data.allroles as role}
						<option value={role.id} class="text-gray-900 dark:text-white">{role.name}</option>
						{/each}
					</select>
				</div>

				<!-- Submit Button -->

						<button onclick={()=> showPermission = !showPermission  } class="{submitButton} w-full"> Customize User Permission</button>

				<button type="submit" class="{submitButton} w-full">Create User</button>
			</form>



			<form method="POST" action="/your-backend-endpoint">




</form>


			<!-- Additional Info -->
			
		</div>

		{#if showPermission}
<form method="POST" >
  {#each data.allPermissions as perm}
    <label>
      <input 
        type="checkbox" 
        name="permissions[]"
        value={perm.id}

    checked={hasPermission(+selected, perm.id)}
      />
      <strong>{perm.name}</strong> — {perm.description}
    </label>
    <br>
  {/each}


  <button type="submit" class="{submitButton} w-full">Save</button>
</form>
  {/if}
	</div>
</div>


<ChildrenTable mainlist={data.allRolePermissions} {tableHeaders} search=true />
