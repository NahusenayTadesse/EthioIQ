<script>
  import { submitButton, menubtn } from "$lib/global.svelte";
  import {page} from '$app/state'
	import { Plus } from "@lucide/svelte";

  let {children, data} = $props();
  let forEmp = ["can_view_employee_payments"];

 </script>

    <div class="flex flex-row justify-start items-center gap-4 py-4">
        <a href="/dashboard/employees" class="{page.url.pathname === '/dashboard/employees' ? submitButton: menubtn} px-4">Employees</a>
        {#if forEmp.some(item =>
  data.permList.some(obj => obj.name === item))}
                   <a href="/dashboard/employees/add-employee" class="{page.url.pathname === '/dashboard/employees/add-employee' ? submitButton: menubtn} px-4"><Plus /> Add Employees</a>

            
        {/if}
        
    </div>

    {@render children()}