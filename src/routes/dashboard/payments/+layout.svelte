 <script>
  import { submitButton, menubtn } from "$lib/global.svelte";
  import {page} from '$app/state'

  let {children, data} = $props();
  let forEmp = ["can_view_employee_payments"];

 </script>

    <div class="flex flex-row justify-start items-center gap-4">
        <a href="/dashboard/payments/tutors" class="{page.url.pathname === '/dashboard/payments/tutors' ? submitButton: menubtn} px-4">Tutors</a>
        <a href="/dashboard/payments/students" class="{page.url.pathname === '/dashboard/payments/students' ? submitButton: menubtn} px-4">Students</a>
        {#if forEmp.some(item =>
  data.permList.some(obj => obj.name === item))}
                   <a href="/dashboard/payments/employees" class="{page.url.pathname === '/dashboard/payments/employees' ? submitButton: menubtn}{submitButton} px-4">Employees</a>

            
        {/if}
        
    </div>

    {@render children()}
