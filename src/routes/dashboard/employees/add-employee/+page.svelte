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
      import * as RadioGroup from "$lib/components/ui/radio-group/index.js";


    

 let { data } = $props();
  let toastTimer = $state();
    let visible = $state(false);

const { form, errors, enhance, constraints, message, delayed, capture, restore } =
    superForm(data.form,  {
taintedMessage: () => { 
    return new Promise((resolve) => {
        // alert('Do you want to leave?\nChanges you made may not be saved.');
        // Simulate confirm dialog: resolve true if OK, false if Cancel
        // Replace alert with confirm for actual response
        resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));

    }); },
    onUpdate({ form }) {
    if (form.message) {
      visible = true;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => visible = false, 5000);
    }
  }
    });

  export const snapshot: Snapshot = { capture, restore };


 


   

  

    
   


    </script>
    {#if visible}
    <p  class="{$message.success ? toastmsg: errormsg}" transition:fly={{x:20, duration:300}}>{$message.message}</p>{/if}

    {#snippet fe(labeler="", name="", type="", placeholder="",)}
    <div class="flex justify-start flex-col w-full">
    <Label for={name} class={label} >{labeler}</Label>
    <input type={type} name={name} placeholder={placeholder} 
    class="{input} flex flex-row justify-between
    {$errors[name] ? '!border-red-500' : ''} " required bind:value={$form[name]} 
    aria-invalid={$errors[name] ? 'true' : undefined}
    {...$constraints[name]}
    />
        {#if $errors[name]}
        <span class="invalid text-red-500">{$errors[name]}</span>
        {/if}
    </div>
    {/snippet}
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


<form id="bank" class="mt-10 ">
  
   {@render fe('Payment Method', 'name', 'text', 'Enter the Payment Method(Bank Name or Telebirr) Here')}
   {@render fe('Account Number', 'accountNumber', 'number', 'Enter the Bank Name here')}

<RadioGroup.Root value="true">
        <label for="" class={label}> Is the Account the Default Account for the Employee?</label>

  <div class="flex items-center  space-x-2">
    <RadioGroup.Item value="true" id="option-one" />
    <Label for="true">Yes, it is the Default</Label>
  </div>
  <div class="flex items-center space-x-2">
    <RadioGroup.Item value="false" id="option-two" />
    <Label for="false">No, it is not the Defaulte</Label>
  </div>
</RadioGroup.Root>

</form>

