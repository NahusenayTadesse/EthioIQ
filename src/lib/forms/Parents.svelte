<script lang="ts">
  import type { SuperValidated, Infer } from 'sveltekit-superforms';
  import { superForm } from 'sveltekit-superforms'
  import type { ParentSchema } from '$lib/zodschema';
	import { input, label, submitButton } from '$lib/global.svelte';
	import SelectComp from '$lib/formComponents/SelectComp.svelte';
	import Loadingbtn from '$lib/formComponents/Loadingbtn.svelte';
	import { Plus } from '@lucide/svelte';

  let { data, id, action="?/addParent" } : { data : SuperValidated<Infer<ParentSchema>> } = $props();

  const { form, errors, enhance, delayed } = superForm(data);

  let items = [
		{ name: 'Male', value: 'male' },
		{ name: 'Female', value: 'female' }
	];
  let isPirmary = [
		{ name: 'Yes, this is a primary parent', value: true },
		{ name: 'No, this is not a primary parent', value: false }
	];
  let livingTogehter = [
		{ name: 'Yes, the student is living with this parent', value: true },
		{ name: 'No, the student is living with this parent', value: false }
	];
  let type = [
		{ name: 'Mother', value: "Mother" },
		{ name: 'Father', value: "Father" },
		{ name: 'Brother', value: "Brother" },
		{ name: 'Sister', value: "Sister" },
		{ name: 'Uncle', value: "Uncle" },
		{ name: 'Aunt', value: "Aunt" },
		{ name: 'Grandfather', value: "Grandfather" },
		{ name: 'Grandmother', value: "Grandmother" },
		{ name: 'Stepfather', value: "Stepfather" },
		{ name: 'Stepmother', value: "Stepmother" },
		{ name: 'Guardian', value: "Guardian" },
		{ name: 'Cousin', value: "Cousin" },
		{ name: 'Family Friend', value: "Family Friend" },
		{ name: 'Other', value: "Other" }
	];
</script>

{#snippet fe(labeler = '', name = '', type = '', placeholder = '', required = true, min = '', max='')}
	<div class="flex w-full flex-col justify-start">
		<label for={name} class={label}>{labeler} {required ? '' : '(optional)'}</label>
		<input
			{type}
			{name}
			{placeholder}
			class="{input} flex flex-row justify-between
    {$errors[name] ? '!border-red-500' : ''} "
			
			bind:value={$form[name]}
			aria-invalid={$errors[name] ? 'true' : undefined}
		
		/>
		{#if $errors[name]}
			<span class="text-red-500">{$errors[name]}</span>
		{/if}
	</div>
{/snippet}
{#snippet selects(name, items)}

<div class="flex w-full flex-col justify-start">
		<label for={name} class={label}>{name.replace(/([a-z])([A-Z])/g, '$1 $2')}:</label>

		<SelectComp {name} bind:value={$form[name]} {items} />
		{#if $errors[name]}<span class="text-red-500">{$errors[name]}</span>{/if}
	</div>
	
{/snippet}



 <form {action} method="post" class="w-full p-2 flex flex-col gap-4" use:enhance>

    {@render fe("First Name", "firstName", 'text', "Enter Parent First Name", true)}
    {@render fe("Last Name", "lastName", 'text', "Enter Parent Last Name", true)}
    {@render selects('gender', items)}
    {@render fe("Phone Number", "phone", 'tel', "Enter Parent's Phone Number", true)}
    {@render fe("Specific Address", "specificLocation", 'text', "Enter Parent's specific address", true)}
	{@render selects('type', type)}
	{@render selects('livingTogether', livingTogehter)}
	{@render selects('isPrimary', isPirmary)}

    <div class="flex w-full flex-col justify-start">
		<label for="notes" class={label}>Notes about Parent:</label>

        <textarea name="notes" 
         rows="3"
         placeholder="Enter added notes about Parent"
         
         class="{input} flex flex-row justify-between
    {$errors.notes ? '!border-red-500' : ''} "
			
			bind:value={$form.notes}
			aria-invalid={$errors.notes ? 'true' : undefined}

         
         ></textarea>

		{#if $errors.notes}<span class="text-red-500">{$errors.notes}</span>{/if}
	</div>

	  <div class="flex w-full flex-col justify-start">
		<label for="notes" class={label}>Added Notes about the relationship between student:</label>

        <textarea name="addedNotes" 
         rows="3"
         placeholder="Enter added notes about Parent"
         
         class="{input} flex flex-row justify-between
    {$errors.notes ? '!border-red-500' : ''} "
			
			bind:value={$form.addeNotes}
			aria-invalid={$errors.addNotes ? 'true' : undefined}

         
         ></textarea>

		{#if $errors.addedNotes}<span class="text-red-500">{$errors.addedNotes}</span>{/if}
	</div>

	<input type="hidden" name="id" value={id}>

	 <button type="submit" class="{submitButton} w-full" >
		{#if $delayed}
		 <Loadingbtn name="Adding Parent" />
		{:else}
		<Plus />
		Add Parent
		{/if}
	</button>
</form>