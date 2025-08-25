<script lang="ts">
    let { data, children } = $props();
    import {page} from '$app/state';
    import Settings from '$lib/Settings.svelte';

    import { LayoutDashboard, IdCardLanyard, GraduationCap, Users, CircleDollarSign, BookOpenText, HeartHandshake, SunIcon, MoonIcon, LogOut } from '@lucide/svelte';
	import { onMount } from 'svelte';

let currentPage = $state(page.url.pathname.charAt(1).toUpperCase() + page.url.pathname.slice(2));
let permList: Array<{ name: string }> = $state(data.permList);
let forEmp = ["can_view_employees"];
let forPar = ["can_view_parents"];
let forStu = ["can_view_students"];
let forPay = ["can_view_payments"];
let forUser = ["can_view_users"];




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
  fileteredItems = navItems;
  const foundEmp = $state(forEmp.some(item =>
  permList.some(obj => obj.name === item)));
  const foundPar = $state(forPar.some(item =>
  permList.some(obj => obj.name === item)));
  const foundStu = $state(forStu.some(item =>
  permList.some(obj => obj.name === item)));
  const foundPay = $state(forPay.some(item =>
  permList.some(obj => obj.name === item)));
  const foundUser = $state(forUser.some(item =>
  permList.some(obj => obj.name === item)));

fileteredItems = navItems.filter(item => {
  if (item.name === 'Employees'  && !foundEmp)  return false;
  if (item.name === 'Parents'    && !foundPar)  return false;
  if (item.name === 'Students'   && !foundStu)  return false;
  if (item.name === 'Payments'   && !foundPay)  return false;
  if (item.name === 'Users'      && !foundUser) return false;
  return true;
});



  // if(data.roleDetails.roleId === 1) {
  //    fileteredItems = navItems;   
  // }
  // else if(data.roleDetails.roleId === 2){
  //   fileteredItems = navItems.filter(item => !['Payments', 'Employees', 'Users'].includes(item.name));
  // }
  // else if(data.roleDetails.roleId === 3){
  //       fileteredItems = navItems.filter(item => !['Users', 'Students'].includes(item.name));
  // }
  // else if(data.roleDetails.roleId === 4){
  //       fileteredItems = navItems.filter(item => !['Payments'].includes(item.name));
  // }
  // else if(data.roleDetails.roleId === 5){
  //       fileteredItems = navItems.filter(item => !['Users'].includes(item.name));
  // }
  
  let sidebar = $state(true);
  
  let showbanner =  $state(true)
onMount(() => {
    const timer = setTimeout(() => {
      showbanner = false;
    }, 10000); // 10 seconds

    // Optional: cleanup if the component unmounts before 30s
    return () => clearTimeout(timer);
  });
   
</script> 

{#await data} 
   
   <div class="h-screeen w-screen flex flex-col justify-center items-center">
      <img src="/ethioiq.png" alt="Ethio Iq Logo" class="w-lg animate-spin">
       <h4 class="animate-pulse">Loading Ethio IQ Office Management System</h4>
   </div>
  
{:then permList} 
  


<div class="flex h-screen">

  <!-- Sidebar -->
  <aside class="{sidebar ? 'w-[250px]': 'w-[70px]'} 
  {sidebar ? 'min-w-[250px]': 'min-w-[70px]'} 
  h-[100vh] inset-y-0 fixed hidden lg:block
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
        class="w-full flex flex-row items-center text-left px-4 py-2 duration-300 gap-2 dark:text-white
             rounded-lg hover:bg-gray-200 hover:dark:bg-gray-200/60 hover:scale-110
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
    shadow-md p-4 flex-row items-center justify-between dark:shadow-gray-300/70 rounded-lg 
    transition-all duration-300 ease-in-out hidden lg:flex">
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
  
   <Settings />

  </div>


    </header>

<main class="flex flex-col p-2 flex-1 w-screen {sidebar ? 'lg:ml-[250px]' : 'lg:ml-[80px]'} pb-16 transition-all duration-300 ease-in-out">
            {@render children()}
    </main>
  </div>
</div>
{/await}


 

    


