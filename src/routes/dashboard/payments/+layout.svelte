 <script>
  import { submitButton } from "$lib/global.svelte";

  let {children, data} = $props();
  let forEmp = ["can_view_employee_payments"];

 </script>

    <div class="flex flex-row justify-start items-center gap-4">
        <a href="/dashboard/payments/tutors" class="{submitButton} px-4">Tutors</a>
        <a href="/dashboard/payments/students" class="{submitButton} px-4">Students</a>
        {#if forEmp.some(item =>
  data.permList.some(obj => obj.name === item))}
                   <a href="/dashboard/payments/employees" class="{submitButton} px-4">Employees</a>

            
        {/if}
        
    </div>

    {@render children()}
