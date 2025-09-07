<script lang="ts">
	import { input, label, select, submitButton } from '$lib/global.svelte.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { SquarePen, Save, BadgeCheck } from '@lucide/svelte';
	import DialogClose from '$lib/components/ui/dialog/dialog-close.svelte';
	let { data } = $props();
	let showPermission = $state(false);
	let selected = $state("");
	let allRolePermissions = $state(data.allRolePermissions);

	function hasPermission(roleId: number, permissionId: number): boolean {
		return allRolePermissions.some(
			(rp) => rp.roleName === roleId && rp.permissionName === permissionId
		);
	}

	let customPerm = $state(false);


	import { superForm } from 'sveltekit-superforms';
	import type { Snapshot } from './$types.js';
	import Loadingbtn from '$lib/forms/Loadingbtn.svelte';

	const {
    form,
    errors,
    enhance,
    constraints,
    delayed,
    message,
    capture,
    restore
  } = superForm(data.form);

    export const snapshot: Snapshot = { capture, restore };

	 
</script>

<svelte:head>
	<title>Add User</title>
</svelte:head>

{#snippet fe(labeler = '', name = '', type = '', placeholder = '', required = true)}
	<div class="flex w-full flex-col justify-start">
		<label for={name} class={label}>{labeler} {required ? '' : '(optional)'}</label>
		<input
			{type}
			{name}
			{placeholder}
			class="{input} flex flex-row justify-between
    {$errors[name] ? '!border-red-500' : ''} "
			{required}
			bind:value={$form[name]}
			aria-invalid={$errors[name] ? 'true' : undefined}
			{...$constraints[name]}
		/>
		{#if $errors[name]}
			<span class="invalid text-red-500">{$errors[name]}</span>
		{/if}
	</div>
{/snippet}

<div class="flex min-h-screen items-center justify-center p-4 text-foreground">
	<div class="flex w-full max-w-full flex-col flex-wrap justify-start gap-4 lg:flex-row">
		<div
			class="w-xl rounded-lg bg-white dark:bg-black p-8"
		>
			<form method="POST" action="?/register" class="space-y-4" use:enhance>
				<div class="mb-6">
					<h1 class="text-center">Create User</h1>
				</div>
				<!-- Email Input -->
				<!-- <div>
					<label for="email" class={label}>Email Address</label>
					<input
						id="email"
						name="email"
						type="email"
						placeholder="Enter your email"
						required
						class={input}
					/>
				</div> -->

				{@render fe("Email Address", 'email', 'email', "Enter your email")}
				{@render fe("Full Name", 'name', 'text', "Enter User's Full Name")}

				<!-- Name Input -->
				<!-- <div>
					<label for="name" class={label}>Full Name</label>
					<input
						id="name"
						name="name"
						type="text"
						placeholder="Enter your full name"
						required
						class={input}
					/>
				</div> -->

				<!-- Role Select -->
				<div>
					<label for="role" class={label}>Role</label>
					<select
						id="role"
						name="role"
						required
						bind:value={selected}
						onchange={() => (showPermission = selected !== '')}
						class={select}
					>
						<option value="" class="text-gray-500" disabled>Select your role</option>
						{#each data.allroles as role}
							<option value={role.id} class="text-gray-900
							 dark:text-white hover:scale-110
							  transition-all duration-300 hover:bg-black hover:text-white">{role.name}</option>
						{/each}
					</select>
					<input type="hidden" value={customPerm} name="customPerm" />
				</div>
				{#if customPerm}
					<p
						class="w-auto animate-pulse justify-self-center rounded-lg bg-green-400 p-2 text-center text-white"
					>
						Using Custom Permissions
					</p>
				{/if}

				{#if showPermission}
					<Dialog.Root>
						<Dialog.Trigger class="{submitButton} flex w-full flex-row gap-2" type="button"
							><SquarePen class="h-4 w-4" /> Customize User Permission</Dialog.Trigger
						>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title class="text-center text-2xl"
									>Give New User custom permissions</Dialog.Title
								>
								<Dialog.Description>
									<div class="h-[95%] overflow-y-auto">
										{#each data.allPermissions as perm}
											<label>
												<input
													type="checkbox"
													name="permissions[]"
													value={perm.id}
													checked={hasPermission(+selected, perm.id)}
												/>
												{perm.description}
											</label>
											<br />
										{/each}
									</div>
								</Dialog.Description>
							</Dialog.Header>
							<Dialog.DialogFooter>
								<div class="items-between flex w-full flex-row justify-between">
									<DialogClose  class="{submitButton} px-4" type="button" onclick={() => (customPerm = false)}
										>Use Default Permissions</DialogClose
									>
									<DialogClose>
										<button
										   type="button"
											class="{submitButton} flex flex-row gap-2 px-4 {customPerm
												? '!bg-green-400 !text-white'
												: ''}"
											onclick={() => (customPerm = true)}
										>
											{#if customPerm}
												<BadgeCheck class="h-6 w-6" />
												Permissions Saved
											{:else}
												<Save class="h-4 w-4" />
												Save Custom Permissions
											{/if}
										</button>
									</DialogClose>
								</div>
							</Dialog.DialogFooter>
						</Dialog.Content>
					</Dialog.Root>
				{:else}
					<Popover.Root>
						<Popover.Trigger
						type="button"
							class="{submitButton} flex w-full cursor-not-allowed flex-row gap-2 !bg-gray-400 !text-white opacity-50"
							><SquarePen class="h-4 w-4" />Customize user permission</Popover.Trigger
						>
						<Popover.Content class="bg-dark text-xl text-white dark:bg-white dark:text-black"
							>Please Choose a role first to customize permissions.</Popover.Content
						>
					</Popover.Root>
				{/if}
				<button type="submit" class="{submitButton} w-full flex flex-row gap-2">
					{#if $delayed}
					<Loadingbtn name="Creating User" />
					{:else}
					Create User
				{/if}</button>
			</form>

			<!-- Additional Info -->
		</div>
	</div>
</div>
