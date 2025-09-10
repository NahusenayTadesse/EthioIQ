<script lang="ts">
	import { createbtn, createForm, errormsg, input, label, toastmsg } from '$lib/global.svelte.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import SelectComp from '$lib/formComponents/SelectComp.svelte';
	import { UserPlus } from '@lucide/svelte';

	import { superForm } from 'sveltekit-superforms';
	import type { Snapshot } from './$types.js';
	import Loadingbtn from '$lib/formComponents/Loadingbtn.svelte';

	let value = $state<string | undefined>();
	let items = [
		{ name: 'Male', value: 'male' },
		{ name: 'Female', value: 'female' }
	];

	let { data } = $props();
	let toastTimer = $state();
	let visible = $state(false);

	const { form, errors, enhance, constraints, message, delayed, capture, restore } = superForm(
		data.form,
		{
			taintedMessage: () => {
				return new Promise((resolve) => {
					// alert('Do you want to leave?\nChanges you made may not be saved.');
					// Simulate confirm dialog: resolve true if OK, false if Cancel
					// Replace alert with confirm for actual response
					resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
				});
			},
			onUpdate({ form }) {
				if (form.message) {
					visible = true;
					clearTimeout(toastTimer);
					toastTimer = setTimeout(() => (visible = false), 5000);
				}
			}
		}
	);

	export const snapshot: Snapshot = { capture, restore };

</script>
    
{#snippet fe(labeler = '', name = '', type = '', placeholder = '', required = true)}
	<div class="flex w-full flex-col justify-start">
		<Label for={name} class={label}>{labeler} {required ? '' : '(optional)'}</Label>
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

<form use:enhance action="?/createEmployee" id="main" class={createForm} method="POST">
	{@render fe('First Name', 'firstName', 'text')}
	{@render fe('Last Name', 'lastName', 'text')}
	{@render fe("Grandfather's Name", 'grandFatherName', 'text')}
	{@render fe('Email', 'email', 'email')}

	<div class="flex w-full flex-col justify-start">
		<label for="gender" class={label}>Gender:</label>

		<SelectComp {value} {items} name="gender" />
		{#if $errors.gender}<span class="invalid">{$errors.gender}</span>{/if}
	</div>

	{@render fe('Address', 'address', 'text')}
	{@render fe('Phone', 'phone', 'tel')}
	{@render fe('Date of Birth', 'dateOfBirth', 'date', 'Select Date of Birth')}
	{@render fe('Position', 'position', 'text')}
	{@render fe('Salary', 'salary', 'number')}
	{@render fe('Hire Date', 'hireDate', 'date')}
</form>

<button type="submit" form="main" class={createbtn}>
	{#if $delayed}
		<!-- <Loader class="h-4 w-4 animate-spin" /> 
            <span class="animate-pulse">Creating Employee...</span> -->

		<Loadingbtn name="Creating Employee" />
	{:else}
		<UserPlus class="h-4 w-4" />

		Create Employee
	{/if}
</button>
