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
    let grades = [
		{ name: 'LKG', value: 'LKG' },
		{ name: 'UKG', value: 'UKG' },
        { name: '1', value: '1' },
        { name: '2', value: '2' },
        { name: '3', value: '3' },
        { name: '4', value: '4' },
        { name: '5', value: '5' },
        { name: '6', value: '6' },
        { name: '7', value: '7' },
        { name: '8', value: '8' },
        { name: '9', value: '9' },
        { name: '10', value: '10' },
        { name: '11', value: '11' },
        { name: '12', value: '12' },
        { name: 'University', value: 'University' },
        { name: 'College', value: 'College' },
        { name: 'Other', value: 'other' } 
	];

	let { data } = $props();
	let toastTimer = $state();
	let visible = $state(false);

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

<form use:enhance action="?/createStudent" id="main" class={createForm} method="POST">
	{@render fe('First Name', 'firstName', 'text', "Enter Student First Name")}
	{@render fe('Last Name', 'lastName', 'text',  "Enter Student Last Name")}
	{@render fe("Grandfather's Name", 'grandFatherName', 'text',  "Enter Grand Father's Name")}
	<div class="flex w-full flex-col justify-start">
		<label for="gender" class={label}>Gender:</label>

		<SelectComp {value} {items} name="gender" />
		{#if $errors.gender}<span class="invalid">{$errors.gender}</span>{/if}
	</div>

    <div class="flex w-full flex-col justify-start">
		<label for="gender" class={label}>Grade:</label>

		<SelectComp {value} items={grades} name="grade" />
		{#if $errors.grade}<span class="invalid">{$errors.grade}</span>{/if}
	</div>

    

    {@render fe('Telegram Username', 'telegram', 'text', "Enter Telegram Username of Student")}

	{@render fe('Address', 'address', 'text')}
	{@render fe('Specific Address', 'specificAddress', 'text', "Enter specific address of student")}
	{@render fe('Phone', 'phone', 'tel', 'Enter Phone of Student')}
    
	{@render fe('Date of Birth', 'dateOfBirth', 'date', 'Select Date of Birth')}
    <div class="flex w-full flex-col justify-start">
		<label for="Lead" class={label}>Lead:</label>

		<SelectComp {value} items={data?.lead} name="Lead" />
		{#if $errors.lead}<span class="text-red-500">{$errors.lead}</span>{/if}
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
