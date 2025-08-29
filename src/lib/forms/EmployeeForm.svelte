<script lang="ts">
    import { input, label, submitButton} from '$lib/global.svelte.js';
    import * as Select from "$lib/components/ui/select/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

 
  let value = $state<string | undefined>();
 
	import { superForm } from 'sveltekit-superforms';
	import { LoaderCircle } from '@lucide/svelte';

	let { data } = $props();

	const { form, errors, enhance,  constraints, message, delayed } = superForm(data.form, {
        taintedMessage: 'You have unsaved changes – are you sure you want to leave?'

    });

</script>
{#if $message}<h3>{$message}</h3>{/if}

{#snippet fe(labeler, name, type)}
 <div class="flex justify-start flex-col w-full">
 <label for={name} class={label}>{labeler}</label>
 <input type={type} name={name} class={input} required bind:value={$form[name]}     aria-invalid={$errors[name] ? 'true' : undefined}
  
 {...$constraints[name]}
 />
    {#if $errors[name]}<span class="invalid">{$errors[name]}</span>{/if}

 </div>
{/snippet}
<ScrollArea class="h-screen pb-12" orientation = "vertical" >
<form use:enhance action="?/createEmployee" class="rounded-lg w-full bg-white dark:bg-black flex flex-col gap-4 p-6" method="POST">
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
    {@render fe("Date of Birth", "dateOfBirth", "date")}

    {@render fe("Position", "position", "text")}
    {@render fe("Salary", "salary", "number")}
    {@render fe("Hire Date", "hireDate", "date")}


    <button type="submit" class="{submitButton} w-full">
          {#if $delayed}<LoaderCircle class="h-4 w-4 animate-spin" /> {/if}
Submit</button>
</form>
</ScrollArea>

