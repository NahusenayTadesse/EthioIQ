<script lang="ts">
	import { createbtn, createForm, errormsg, input, label, toastmsg } from '$lib/global.svelte.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import SelectComp from '$lib/formComponents/SelectComp.svelte';
	import DatePicker from '$lib/formComponents/DatePicker.svelte';
	import { UserPlus } from '@lucide/svelte';
	//  import * as Select from "$lib/components/ui/select/index.js";

	import { superForm } from 'sveltekit-superforms';
	import type { Snapshot } from './$types.js';
	import Loadingbtn from '$lib/formComponents/Loadingbtn.svelte';
	import { fly } from 'svelte/transition';

	let items = [
		{ name: 'Male', value: 'male' },
		{ name: 'Female', value: 'female' }
	];
    let ns = [
        { name: 'Neither', value: '' },
		{ name: 'Natural', value: 'Natural' },
		{ name: 'Social', value: 'Social' },
		
	];

    let gradePreferences = [
        { name: 'Grade 1-4', value: '1-4' },
        { name: 'Grade 5-8', value: '5-8' },
        { name: 'Grade 9-10', value: '9-10' },
        { name: 'Grade 9-12', value: '9-12' },
        { name: 'Grade 11', value: '11' },
        { name: 'Grade 12', value: '12' },
        { name: 'All Grades', value: 'all' },
		
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
	 function getItemNameById(items: any, value: any) {
  const item = items.find(i=> i.value === value);
  return item ? item.name : null; // returns null if not found
}


//   let dob = $derived($form.dateOfBirth.toDateString)

</script>
<svelte:head>
	<title>Add New Student </title>
</svelte:head>

    
{#snippet fe(labeler = '', name = '', type = '', placeholder = '', required=false)}
	<div class="flex w-full flex-col justify-start">
		<Label for={name} class={label}>{labeler}</Label>
		<input
			{type}
			{name}
			{placeholder}
			{required}
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

<form use:enhance action="?/createStudent" id="main" class={createForm} method="POST">
	{@render fe('First Name', 'firstName', 'text', "Enter Student First Name", true)}
	{@render fe('Last Name', 'lastName', 'text',  "Enter Student Last Name", true)}
	{@render fe("Grandfather's Name", 'grandFatherName', 'text',  "Enter Grand Father's Name", false)}
    {@render selects('gender', items)}
    {@render selects('grade', data.grade)}
	{#if getItemNameById(data.grade,$form.grade) === 'Grade 11' || getItemNameById(data.grade,$form.grade) === 'Grade 12'}
	<div transition:fly={{x:-20, duration:300}}>
    {@render selects ('naturalOrSocial', ns) }
	</div>
	{/if}
	
    {@render selects('school', data?.school)}
    {@render fe('Telegram Username', 'telegram', 'text', "Enter Telegram Username of Student", true)}
    {@render selects('fee', data?.fee)}
    {@render selects('location', data?.location)}	
	{@render fe('Specific Address', 'specificLocation', 'text', "Enter specific address of student", true)}
	{@render fe('Phone', 'phone', 'tel', 'Enter Phone of Student', true)}    
    <div>
     <DatePicker name="dateOfBirth" bind:value={$form.dateOfBirth} />
	 {#if $errors.dateOfBirth}<span class="text-red-500">{$errors.dateOfBirth}</span>{/if}
	 <input type="text" name="dateOfBirth" bind:value={$form.dateOfBirth} /> 
	 </div>
     {@render fe("Experience in Years", 'experience', 'number', 'Enter the number of years tutor is experienced in', true)}
    {@render selects('lead', data?.lead)}
    {@render selects('gradePreference', gradePreferences)}
    


    <div class="flex w-full flex-col justify-start">
		<label for="notes" class={label}>Notes:</label>

        <textarea name="notes" 
         rows="4"
         placeholder="Enter added notes about Student"
         
         class="{input} flex flex-row justify-between
    {$errors.notes ? '!border-red-500' : ''} "
			
			bind:value={$form.notes}
			aria-invalid={$errors.notes ? 'true' : undefined}

         
         ></textarea>

		{#if $errors.notes}<span class="text-red-500">{$errors.notes}</span>{/if}
	</div>

    

</form>

<button type="submit" form="main" class={createbtn}>
	{#if $delayed}
		<!-- <Loader class="h-4 w-4 animate-spin" /> 
            <span class="animate-pulse">Creating Employee...</span> -->

		<Loadingbtn name="Creating Tutor" />
	{:else}
		<UserPlus class="h-4 w-4" />

		Create Tutor
	{/if}
</button>
