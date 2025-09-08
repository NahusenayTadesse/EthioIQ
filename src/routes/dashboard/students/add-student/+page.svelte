<script lang="ts">
	import { createbtn, createForm, errormsg, input, label, toastmsg } from '$lib/global.svelte.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import SelectComp from '$lib/forms/SelectComp.svelte';
	import { UserPlus } from '@lucide/svelte';

	import { superForm } from 'sveltekit-superforms';
	import type { Snapshot } from './$types.js';
	import Loadingbtn from '$lib/forms/Loadingbtn.svelte';

	let value = $state<string | undefined>();
	let items = [
		{ name: 'Male', value: 'male' },
		{ name: 'Female', value: 'female' }
	];
    let ns = [
        { name: 'Neither', value: '' },
		{ name: 'Natural', value: 'Natural' },
		{ name: 'Social', value: 'Social' },
		
	];

	let { data } = $props();

	const { form, errors, enhance, constraints, delayed, capture, restore } = superForm(
		data.form,
		{
			taintedMessage: () => {
				return new Promise((resolve) => {
					resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
				});
			},
		}
	);

	export const snapshot: Snapshot = { capture, restore };

</script>
    
{#snippet fe(labeler = '', name = '', type = '', placeholder = '')}
	<div class="flex w-full flex-col justify-start">
		<Label for={name} class={label}>{labeler}</Label>
		<input
			{type}
			{name}
			{placeholder}
			class="{input} flex flex-row justify-between
    {$errors[name] ? '!border-red-500' : ''} "
			
			bind:value={$form[name]}
			aria-invalid={$errors[name] ? 'true' : undefined}
			{...$constraints[name]}
		/>
		{#if $errors[name]}
			<span class="text-red-500">{$errors[name]}</span>
		{/if}
	</div>
{/snippet}

{#snippet selects(name, items)}

<div class="flex w-full flex-col justify-start">
		<label for={name} class={label}>{name.replace(/([a-z])([A-Z])/g, '$1 $2')}:</label>

		<SelectComp {value} {items} {name} />
		{#if $errors[name]}<span class="text-red-500">{$errors[name]}</span>{/if}
	</div>
    
{/snippet}

<form use:enhance action="?/createStudent" id="main" class={createForm} method="POST">
	{@render fe('First Name', 'firstName', 'text', "Enter Student First Name")}
	{@render fe('Last Name', 'lastName', 'text',  "Enter Student Last Name")}
	{@render fe("Grandfather's Name", 'grandFatherName', 'text',  "Enter Grand Father's Name")}
    {@render selects('gender', items)}
    {@render selects('grade', data.grade)}
    {@render selects ('naturalOrSocial', ns)}
    {@render selects('school', data?.school)}
    {@render fe('Telegram Username', 'telegram', 'text', "Enter Telegram Username of Student")}
    {@render selects('fee', data?.fee)}
    {@render selects('location', data?.location)}	
	{@render fe('Specific Address', 'specificAddress', 'text', "Enter specific address of student")}
	{@render fe('Phone', 'phone', 'tel', 'Enter Phone of Student')}    
	{@render fe('Date of Birth', 'dateOfBirth', 'date', 'Select Date of Birth')}
    {@render selects('lead', data?.lead)}

    <div class="flex w-full flex-col justify-start">
		<label for="notes" class={label}>Notes:</label>

        <textarea name="notes" 
         rows="4"
         placeholder="Enter added notes about Student"
         
         class="{input} flex flex-row justify-between
    {$errors.notes ? '!border-red-500' : ''} "
			
			bind:value={$form.notes}
			aria-invalid={$errors.notes ? 'true' : undefined}
			{...$constraints.notes}

         
         ></textarea>

		{#if $errors.notes}<span class="text-red-500">{$errors.notes}</span>{/if}
	</div>

    
    
</form>

<button type="submit" form="main" class={createbtn}>
	{#if $delayed}
		<!-- <Loader class="h-4 w-4 animate-spin" /> 
            <span class="animate-pulse">Creating Employee...</span> -->

		<Loadingbtn name="Creating Student" />
	{:else}
		<UserPlus class="h-4 w-4" />

		Create Student
	{/if}
</button>
