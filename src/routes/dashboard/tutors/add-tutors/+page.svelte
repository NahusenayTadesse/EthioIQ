<script lang="ts">
	import { Upload } from '$lib/stores/upload.svelte.js';

	/** @type {{data: import('./$types').PageData}} */

	const upload = new Upload();

	/** @param {SubmitEvent} event */



	 import { Input } from "$lib/components/ui/input/index.js";
	

	import { createbtn, createForm, input, label, } from '$lib/global.svelte.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import SelectComp from '$lib/formComponents/SelectComp.svelte';
	import DatePicker from '$lib/formComponents/DatePicker.svelte';
	import { UserPlus } from '@lucide/svelte';
	import { superForm, fileProxy, dateProxy } from 'sveltekit-superforms';
	import type { Snapshot } from './$types.js';
	import Loadingbtn from '$lib/formComponents/Loadingbtn.svelte';
	import { CalendarDate, today } from '@internationalized/date';
	import type { DateValue } from '@internationalized/date';
	import { tutorSchema } from '$lib/zodschema.js'
	import { zod4Client } from 'sveltekit-superforms/adapters';



	let items = [
		{ name: 'Male', value: 'male' },
		{ name: 'Female', value: 'female' }
	];
    let ns = [
        { name: 'Neither', value: '' },
		{ name: 'Natural', value: 'Natural' },
		{ name: 'Social', value: 'Social' },
		
	];

	let gradePreference = [
		{ name: 'Grades 1-4', value: '1-4' },
		{ name: 'Grades 5-8', value: '5-8' },
		{ name: 'Grades 9-12', value: '9-12' },
		{ name: 'Grade 9', value: '9' },
		{ name: 'Grade 10', value: '10' },
		{ name: 'Grade 11', value: '11' },
		{ name: 'Grade 12', value: '12' },
		{ name: 'College', value: 'College'},
		{ name: 'University', value: 'Univerisity'},
		{ name: 'All', value: 'All'}
	]

	let { data } = $props();

	const { form, errors, enhance, delayed, capture, restore } = superForm(
		data.form,
		{
			taintedMessage: () => {
				return new Promise((resolve) => {
					resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
				});
			},

			validators: zod4Client(tutorSchema)

		}
	);

	export const snapshot: Snapshot = { capture, restore };
	 function getItemNameById(items: any, value: any) {
  const item = items.find(i=> i.value === value);
  return item ? item.name : null; // returns null if not found
}


//   let dob = $derived($form.dateOfBirth.toDateString)

function yearMinus(year: number) {
  const dater = new Date();
  dater.setFullYear(dater.getFullYear() - year); // go back N years

  // Format as YYYY-MM-DD
  const yyyy = dater.getFullYear();
  const mm = String(dater.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const dd = String(dater.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}

  const year18= yearMinus(18);
  
  const year65=yearMinus(65);

//   let dob = $derived($form.dateOfBirth.toDateString)
  const file = fileProxy(form, 'image'); 
  const proxyDate = dateProxy(form, 'dateOfBirth', { format: 'date' });

</script>
<svelte:head>
	<title>Add New Tutor </title>
</svelte:head>

{year18}
{year65}
    
{#snippet fe(labeler = '', name = '', type = '', placeholder = '', required=false, min="", max="")}
	<div class="flex w-full flex-col justify-start">
		<Label for={name} class={label}>{labeler}</Label>
		<Input
			{type}
			{name}
			{placeholder}
			{required}
			{min}
			{max}
			 lang="en-US"
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

<form use:enhance action="?/addTutor" id="main" class={createForm} method="POST" enctype="multipart/form-data">
	{@render fe('First Name', 'firstName', 'text', "Enter Tutor's First Name", true)}
	{@render fe('Last Name', 'lastName', 'text',  "Enter Tutor's Last Name", true)}
	{@render fe("Grandfather's Name", 'grandFatherName', 'text',  "Enter Grand Father's Name", false)}
    {@render selects('gender', items)}
    {@render selects('gradePreference', gradePreference)}
    {@render selects ('naturalOrSocial', ns) }
	{@render fe('Phone', 'phone', 'tel', 'Enter Phone of Tutor', true)}
    {@render fe('Telegram Username', 'telegram', 'text', "Enter Telegram Username of Tutor", true)}
    {@render fe('Experience', 'experience', 'number', "Enter Experience of Tutor in Number of Years", true)}
    {@render selects('hourly', data?.hourly)}
    {@render selects('location', data?.location)}	
	{@render fe('Specific Address', 'specificLocation', 'text', "Enter specific address of tutor", true)}
	{@render fe('Date of Birth', 'dateOfBirth', 'date', 'Select Date of Birth', true, year65, year18)}

   
    {@render selects('lead', data?.lead)}
	<!-- {@render fe('Upload Tutor Image', 'image', 'file', '', true)} -->


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
		<div>
			<label for="file" class={label}>Select a small file</label>
           <input type="file" name="image" bind:files={$file}  class={input} id="file" required />

		{#if $errors.image}<span class="text-red-500">{$errors.image}</span>{/if}

		</div>
		<button type="submit" form="main" class={createbtn}>
	{#if $delayed}
	
		<Loadingbtn name="Creating Tutor" />
	{:else}
		<UserPlus class="h-4 w-4" />

		Create Tutor
	{/if}
</button>
	</form>
