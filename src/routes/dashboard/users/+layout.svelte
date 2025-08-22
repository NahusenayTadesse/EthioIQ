<script>
	import { submitButton } from "$lib/global.svelte";
    let {children} = $props();

</script>
<div class="flex flex-row gap-4">

<a href="/dashboard/users" class="{submitButton} w-[150px]">Users List</a>
<a href="/dashboard/users/add-user" class="{submitButton} w-[150px]">Add New User</a>
<a href="/dashboard/users/add-roles" class="{submitButton} w-[150px]">Add New Role</a>
</div>

{@render children()}