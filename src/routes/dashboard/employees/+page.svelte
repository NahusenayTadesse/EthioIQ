<script lang="ts">
	import { submitButton } from '$lib/global.svelte.js';
	import Table from '$lib/Table.svelte';
	import { BrushCleaning, Mars, RotateCcw, SlidersHorizontal, Venus } from '@lucide/svelte';
	import { fly } from 'svelte/transition';

	let { data } = $props();

	let employeeList = $state(data.employeeList);

	let tableHeaders = $state([
		{ name: 'Id', key: 'id' },
		{ name: 'First Name', key: 'firstName' },
		{ name: 'Last Name', key: 'lastName' },
		{ name: 'Gender', key: 'gender' },
		{ name: 'Phone', key: 'phone' },
		{ name: 'Position', key: 'position' },
		{ name: 'Active', key: 'isActive' }
	]);
	let componentKey = $state(0);

	function reloadComponent() {
		componentKey++;
		employeeList = data.employeeList;
	}

	let openFilter = $state(false);

	let fileName = 'Ethio IQ Employee List';

	type Employee = {
		[key: string]: any;
	};

	function filter(key: string, value: any): void {
		employeeList = employeeList.filter((person: Employee) => person[key] === value);
	}

	let firstNames = $derived([...new Set(employeeList.map((person) => person.firstName))]);
	let lastNames = $derived([...new Set(employeeList.map((person) => person.lastName))]);
	let genders = $derived([...new Set(employeeList.map((person) => person.gender))]);
	let position = $derived([...new Set(employeeList.map((person) => person.position))]);
	let active = $derived([...new Set(employeeList.map((person) => person.isActive))]);

	let filterNames = $derived([
		{ key: genders, name: 'Gender', query: 'gender' },
		{ key: active, name: 'Active Status', query: 'isActive' },
		{ key: firstNames, name: 'First Name', query: 'firstName' },
		{ key: lastNames, name: 'Last Name', query: 'lastName' },
		{ key: position, name: 'Position', query: 'position' }
	]);
</script>

<svelte:head>
	<title>Employees</title>
</svelte:head>

<button onclick={() => (openFilter = !openFilter)} aria-label="Advanced Filter" title="Filter Table"
	><SlidersHorizontal />
</button><br />

{#if openFilter}
	<div class="flex flex-col gap-2" transition:fly={{ x: -200, duration: 600 }}>
		<button
			onclick={() => (employeeList = data.employeeList)}
			class="{submitButton} flex !w-[120px] flex-row items-center justify-center gap-2"
			title="Clear Filter"
		>
			<BrushCleaning size="18" /> Clear</button
		>

		{#each filterNames as filterName}
			<h1 class="cap">{filterName.name}</h1>
			<div class="flex flex-row flex-wrap gap-2">
				{#each filterName.key as filterKey}
					<button
						onclick={() => filter(filterName.query, filterKey)}
						class="{submitButton} flex flex-row gap-2 p-4 capitalize
  {filterName.name === 'Active Status' ? (filterKey ? '!bg-green-500' : '!bg-red-500') : ''}
}"
						title="Only include Data where {filterName.name} is {filterKey}"
						>{#if filterKey === 'male'}
							<Mars />
						{/if}
						{#if filterKey === 'female'}
							<Venus />
						{/if}
						{filterName.name === 'Active Status'
							? filterKey
								? 'Active'
								: 'In Active'
							: filterKey}</button
					>
				{/each}
			</div>
		{/each}
	</div>
{/if}
<br />

{#key componentKey}
	<button
		onclick={reloadComponent}
		class="aboslute top-0 right-0"
		aria-label="Relaod Table"
		title="Reload Table"
	>
		<RotateCcw /></button
	>
	<Table mainlist={employeeList} {tableHeaders} {fileName} />
{/key}
