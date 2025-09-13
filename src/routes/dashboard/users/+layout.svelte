<script>
	import { submitButton, menubtn } from "$lib/global.svelte";
    import { page } from "$app/state";
    
    let {children} = $props();

</script>
<div class="flex flex-row gap-4">

<a href="/dashboard/users" class="w-[150px] {page.url.pathname==='/dashboard/users' ? submitButton: menubtn}"> Users List</a>
<a href="/dashboard/users/add-user" class="w-[150px] {page.url.pathname==='/dashboard/users/add-user' ? submitButton: menubtn}">Add New User</a>
<a href="/dashboard/users/add-roles" class="w-[150px] {page.url.pathname==='/dashboard/users/add-roles' ? submitButton: menubtn}">Add New Role</a>
</div>

 <div class="h-full">
    {@render children?.()}
   </div>
   