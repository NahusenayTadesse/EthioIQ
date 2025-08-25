<script>
	import { enhance } from "$app/forms";
	import { LogOut, MoonIcon, Settings, SunIcon } from "@lucide/svelte";
	import { toggleMode } from "mode-watcher";
	import { fly } from "svelte/transition";
      import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

  let submitting = $state(false);

    function onsubmit() {
        submitting = true;
    }
      
</script>
<DropdownMenu.Root>
  <DropdownMenu.Trigger> <div title="Change Site Settings"> <Settings class="text-dark w-6 h-6 dark:text-white" /></div>
</DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Settings</DropdownMenu.Label>
      <DropdownMenu.Separator />
      <DropdownMenu.Item></DropdownMenu.Item>
      <DropdownMenu.Item><button onclick={toggleMode} class="w-32" title="Change Theme">
  <div class="flex dark:hidden flex-row gap-2 text-sm text-dark dark:text-white">
    <MoonIcon
    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 !transition-all dark:-rotate-90 dark:scale-0"
  />
   Dark Theme
  </div>
    <div class="dark:flex hidden flex-row gap-2 text-sm text-dark dark:text-white ">
  
  <SunIcon
    class="h-[1.2rem] text-white w-[1.2rem] rotate-90 scale-0 !transition-all dark:rotate-0 dark:scale-100"
  />
   Light Theme
  </div>
  <span class="sr-only">Toggle theme</span>
</button></DropdownMenu.Item>
      <DropdownMenu.Item> <form method="post" action="/dashboard/?/logout" use:enhance {onsubmit} >
    <button type="submit" name="logout" title="Logout" class="flex flex-row gap-2 items-center justify-start text-sm w-32" disabled={submitting}>

         <LogOut class="{submitting ? 'animate-spin': ''} text-dark dark:text-white w-4 h-4" />
                          {submitting ? "Logging out..." : "Log Out"}

    </button>
</form></DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>


