<script lang="ts">
    let { data, children } = $props();
    import {page} from '$app/state';

    import { toggleMode } from "mode-watcher";
    import { LayoutDashboard, IdCardLanyard, GraduationCap, Users, CircleDollarSign, BookOpenText, HeartHandshake, SunIcon, MoonIcon, LogOut } from '@lucide/svelte';
	import { enhance } from '$app/forms';
	import { X } from '@lucide/svelte';
	import { onMount } from 'svelte';

let currentPage = $state(page.url.pathname.charAt(1).toUpperCase() + page.url.pathname.slice(2));


  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Employees', href: '/dashboard/employees', icon: IdCardLanyard },
    { name: 'Parents', href: '/dashboard/parents', icon: HeartHandshake },
    { name: 'Students', href: '/dashboard/students', icon: GraduationCap },
    { name: 'Tutors', href: '/dashboard/tutors', icon: BookOpenText },
    { name: 'Payments', href: '/dashboard/payments', icon: CircleDollarSign },
    { name: 'Users', href: '/dashboard/users', icon: Users }
  ];


  let fileteredItems: typeof navItems = $state([]);

  if(data.roleDetails.roleId === 1) {
     fileteredItems = navItems;   
  }
  else if(data.roleDetails.roleId === 2){
    fileteredItems = navItems.filter(item => !['Payments', 'Employees', 'Users'].includes(item.name));
  }
  else if(data.roleDetails.roleId === 3){
        fileteredItems = navItems.filter(item => !['Users', 'Students'].includes(item.name));
  }
  else if(data.roleDetails.roleId === 4){
        fileteredItems = navItems.filter(item => !['Payments'].includes(item.name));
  }
  else if(data.roleDetails.roleId === 5){
        fileteredItems = navItems.filter(item => !['Users'].includes(item.name));
  }
  
  let sidebar = $state(true);
  let submitting = $state(false);

    function onsubmit() {
        submitting = true;
    }
  let showbanner =  $state(true)
onMount(() => {
    const timer = setTimeout(() => {
      showbanner = false;
    }, 10000); // 10 seconds

    // Optional: cleanup if the component unmounts before 30s
    return () => clearTimeout(timer);
  });
   
</script>

<div class="flex h-screen">
  <!-- Sidebar -->
  <aside class="{sidebar ? 'w-[250px]': 'w-[70px]'} 
  {sidebar ? 'min-w-[250px]': 'min-w-[70px]'} 
  h-[100vh] inset-y-0 fixed 
  top-0 bottom-0 shadow-md p-2 
  dark:shadow-gray-300/70 bg-gradient-to-bl
   from-white to-mentalBlue/80 dark:bg-gradient-to-r dark:from-dark dark:to-dark
   transition-all duration-300 ease-in-out"
  
  onmouseenter={() => sidebar = true}
  onmouseleave={() => sidebar = false}
  >
    <div class="p-4 text-2xl font-bold flex flex-row justify-between gap-8 mb-8 
    pb-8 border-b-1 border-gray-500 dark:border-white">

       <a href="/dashboard">
        <img class="transition-transform duration-300 ease-in-out" src={sidebar ? "/ethioiq.png" : "/favicon.png"} alt="Ethio IQ Logo" loading="lazy" >
        </a>
    </div>
    <nav class="mt-4 flex flex-col gap-4">
    {#each fileteredItems as item}
      <a
        class="w-full flex flex-row items-center text-left px-4 py-2  duration-300 gap-2 dark:text-white
             rounded-lg hover:bg-gray-200 hover:dark:bg-gray-200/60
            aria-[current=page]:bg-dark aria-[current=page]:text-white dark:aria-[current=page]:bg-gray-100 
            dark:aria-[current=page]:text-dark transition-all ease-in-out" 
             aria-current={page.url.pathname === item.href ? 'page' : undefined}
        class:selected={currentPage === item.name}
        href={item.href}
       title={item.name}> 
        <item.icon size="16" />

         {#if sidebar}
         <span> {item.name}</span>
        
         {/if}
      </a>
    {/each}
   </nav>
  </aside>

  <!-- Main Content -->
  <div class="flex-1 flex flex-col p-4">
    <!-- Header -->
    <header class="{sidebar ? 'ml-[250px] w-[1250px]' : 'ml-[80px] w-[1425px]'} 
    shadow-md p-4 flex flex-row items-center justify-between dark:shadow-gray-300/70 rounded-lg 
    transition-all duration-300 ease-in-out">
      <h1 class="text-xl font-semibold">
        {(navItems.find(item => item.href === page.url.pathname)?.name) || ''}
      </h1> 

  <div class="text-center mt-4 text-lg font-semibold text-gray-800">
  <div class="text-center mt-4 text-lg font-semibold text-gray-800">
    {#if data.birthdayPerson && showbanner}

    
  
    
     
   {#each data.birthdayPerson as birthdayPerson}
     {#if birthdayPerson.type === 'employee'} 
    
   <h1 class="text-4xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-center animate-bounce">
  🎉 Today is 
  <span class="text-white drop-shadow-lg text-5xl">
    { data.birthdayPerson[0].firstName } { data.birthdayPerson[0].lastName }'s
  </span> 
  Birthday! 🎂
</h1>
{/if}
{/each}
{/if}



  </div>
   

  </div>

<div class="flex flex-col items-center justify-center gap-2">
      <button onclick={toggleMode} title="Change Theme">
  <SunIcon
    class="h-[1.2rem] w-[1.2rem] scale-100 !transition-all dark:scale-0"
  />
  <MoonIcon
    class="h-[1.2rem] w-[1.2rem] scale-0 !transition-all dark:scale-100"
  />
       
  <span class="sr-only">Toggle theme</span>
</button>
 <form method="post" action="/dashboard/?/logout" use:enhance {onsubmit} >
    <button type="submit" name="logout" title="Logout" class="absolute right-4 top-4 flex flex-row gap-2 items-center justify-center" disabled={submitting}>
         <LogOut class="{submitting ? 'animate-spin': ''} w-4 h-4" />
        {submitting ? "Logging out..." : " "}
    </button>
</form>
</div>
    </header>

<main class="flex flex-col p-2 flex-1 w-full {sidebar ? 'ml-[250px]' : 'ml-[80px]'} pb-16 transition-all duration-300 ease-in-out">
            {@render children()}
    </main>
  </div>
</div>



 

    


