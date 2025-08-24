 <script>
  import { submitButton } from "$lib/global.svelte";

  let {children} = $props()
 </script>

    <div class="flex flex-row justify-start items-center gap-4">
        <a href="/dashboard/payments/tutors" class="{submitButton} px-4">Tutors</a>
        <a href="/dashboard/payments/students" class="{submitButton} px-4">Students</a>
        
    </div>

    {@render children()}
