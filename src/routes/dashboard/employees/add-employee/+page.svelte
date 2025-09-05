    <script lang="ts">
        import { createbtn, createForm, errormsg, input, label, submitButton, toastmsg} from '$lib/global.svelte.js';
        import * as Select from "$lib/components/ui/select/index.js";
        import { Label } from "$lib/components/ui/label/index.js";
    import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

    let value = $state<string | undefined>();
    
        import { Loader, UserPlus } from '@lucide/svelte';

import { superForm } from 'sveltekit-superforms';
	import type { Snapshot } from './$types.js';
	import { fly } from 'svelte/transition';

 let { data } = $props();

const { form, errors, enhance, constraints, message, delayed, capture, restore } =
    superForm(data.form,  {
taintedMessage: () => { 
    return new Promise((resolve) => {
        // alert('Do you want to leave?\nChanges you made may not be saved.');
        // Simulate confirm dialog: resolve true if OK, false if Cancel
        // Replace alert with confirm for actual response
        resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));

    }); }
    });

  export const snapshot: Snapshot = { capture, restore };

  let visible = $state(false)

  $effect(() => {
    if ($message) {
        visible=true
      const timer = setTimeout(() => {
        visible = false;
      }, 5000);

      return () => {
        clearTimeout(timer);
      }
    }


  });

    
   


    </script>
    {#if visible}
    <p  class="{$message.success ? toastmsg: errormsg}" transition:fly={{x:20, duration:300}}>{$message.message}</p>{/if}

    {#snippet fe(labeler="", name="", type="", placeholder="")}
    <div class="flex justify-start flex-col w-full">
    <Label for={name} class={label} >{labeler}</Label>
    <input type={type} name={name} placeholder={placeholder} 
    class="{input} flex flex-row justify-between
    {$errors[name] ? '!border-red-500' : ''}" required bind:value={$form[name]} 
    aria-invalid={$errors[name] ? 'true' : undefined}
    {...$constraints[name]}
    />
        {#if $errors[name]}
        <span class="invalid text-red-500">{$errors[name]}</span>
        {/if}
    </div>
    {/snippet}
    <ScrollArea class="h-full pb-12 flex flex-col justify-center items-center" orientation = "vertical" >
    <form use:enhance action="?/createEmployee"  id="main"
    class={createForm}
     method="POST">
        {@render fe("First Name", "firstName", "text")}
        {@render fe("Last Name", "lastName", "text")}
        {@render fe("Grandfather's Name", "grandFatherName", "text")}
        {@render fe("Email", "email", "email")}

    <div class="flex justify-start flex-col w-full">

        <label for="gender" class={label}>Gender:</label>
        <Select.Root type="single" name="gender" required bind:value>
            <Select.Trigger class="w-full {input}">
                {value ? (value === 'male' ? 'Male' : 'Female') : 'Select Gender'}
            </Select.Trigger>
            <Select.Content>
                <Select.Item value="male">Male</Select.Item>
                <Select.Item value="female">Female</Select.Item>
            </Select.Content>
        </Select.Root>
            {#if $errors.gender}<span class="invalid">{$errors.gender}</span>{/if}

        </div>

        {@render fe("Address", "address", "text")}
        {@render fe("Phone", "phone", "tel")}
        {@render fe("Date of Birth", "dateOfBirth", "date", "Select Date of Birth")}

        {@render fe("Position", "position", "text")}
        {@render fe("Salary", "salary", "number")}
        {@render fe("Hire Date", "hireDate", "date")}

    



    

    </form>

    
        <button type="submit" form="main" class={createbtn}>
            {#if $delayed}<Loader class="h-4 w-4 animate-spin" /> 
            <span class="animate-pulse">Creating Employee...</span>
    {:else}
    <UserPlus class="h-4 w-4" />

    Create Employee
{/if}


</button>
    </ScrollArea>

