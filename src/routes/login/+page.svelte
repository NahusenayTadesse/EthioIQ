<script lang="ts">
	import { enhance } from '$app/forms';
	import { formContainer, formContainerInner, input, submitButton } from '$lib/global.svelte';
	import type { ActionData } from './$types';
		import { Eye,  EyeOff, LoaderCircle, MoonIcon, SunIcon } from "@lucide/svelte";
	import { toggleMode } from "mode-watcher";
	let submitted = $state(false)
	// function onsubmit(){
	// 	 submitted = true;
	// }

	let { form }: { form: ActionData } = $props();
    let types = $state("password");
	function toggle(){
    if(types === 'password'){
      types = 'text';
    } else {
      types = 'password';
    }
  }
	 let EyeIcon = $derived(types === 'password' ? Eye : EyeOff);

</script>

<div class={formContainer}> 
      
    <div class={formContainerInner}>
        <div class="mb-8 text-center">
            <div class="flex flex-row relative justify-center items-center">
           <img src="/ethioiq.png" class="w-1/2" alt="Ethio Iq Logo">
             <div class="flex flex-row gap-2 absolute right-0 top-0">
      <button onclick={toggleMode}>
  <SunIcon
    class="h-[1.2rem] w-[1.2rem] scale-100 !transition-all dark:scale-0"
  />
  <MoonIcon
    class="h-[1.2rem] w-[1.2rem] scale-0 !transition-all dark:scale-100"
  />
  <span class="sr-only">Toggle theme</span>
</button>
</div>
  </div>
    <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Sign in to your account</h2>
            <p class="text-gray-500 dark:text-gray-400">
                Enter your email below to login to your account
            </p>
        </div>
<form method="post" action="?/login" use:enhance={() => {
	   submitted=true
      return async ({ update }) => {
		
		submitted=false
		update()
      };
    }} class="flex flex-col justify-center space-y-6" >
    
<h4 class="text-red-500 text-center">{form?.message ?? ''}</h4>
	


	<label>
		Email
		<input
		   type="email"
			name="email"
			class={input}
			autocomplete="email"
		/>
	</label>
	<label class="relative">
		Password
				<input
					type={types}
					name="password"
					autocomplete="current-password"
					class={input}
				/>
				<button type="button" onclick={toggle} 
				title={types === 'password' ? 'Show password' : 'Hide password'} class="absolute right-3 top-[70%] transform -translate-y-1/2">
     <EyeIcon class="text-gray-600 dark:text-gray-200 z-10"  />
   </button>
   </label>
	<button type="submit" class="{submitButton} w-full flex flex-row gap-4"
		>{#if submitted}<LoaderCircle class="animate-spin" />{/if} Login</button
	>
	<!-- <button
		formaction="?/register"
		class="{submitButton} w-full"
		>Register</button
	> -->
</form>
    </div>

			</div>
<p style="color: red">{form?.message ?? ''}</p>
