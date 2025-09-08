<script>
  import { submitButton, menubtn } from "$lib/global.svelte";
  import {page} from '$app/state'
	import { Plus } from "@lucide/svelte";

  let {children, data} = $props();
  let forEmp = ["can_view_employee_payments"];

 </script>

    <div class="flex flex-row justify-start items-center gap-4 py-4">
        <a href="/dashboard/students" class="{page.url.pathname === '/dashboard/students' ? submitButton: menubtn} px-4">Students</a>
        {#if forEmp.some(item =>
  data.permList.some(obj => obj.name === item))}
                   <a href="/dashboard/students/add-student" class="{page.url.pathname === '/dashboard/students/add-student' ? submitButton: menubtn} px-4"><Plus /> Add Student</a>

            
        {/if}
        
    </div>

    {@render children()}