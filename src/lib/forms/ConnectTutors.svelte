<script lang="ts">
  import type { SuperValidated, Infer } from 'sveltekit-superforms';
  import { superForm } from 'sveltekit-superforms'
  import type { ConnectTutorSchema} from '$lib/server/zodschema';
  import { input, label, submitButton } from '$lib/global.svelte';
  import SelectComp from '$lib/formComponents/SelectComp.svelte';
  import Loadingbtn from '$lib/formComponents/Loadingbtn.svelte';
  import { Plus } from '@lucide/svelte';
 import ComboboxComp from '$lib/formComponents/ComboboxComp.svelte';

  let { data, id, action="?/addTutor", subjects, items } : { data : SuperValidated<Infer<ConnectTutorSchema>> } = $props();

  const { form, errors, enhance, delayed } = superForm(data);

</script>

{#snippet fe(labeler = '', name = '', type = '', placeholder = '', required = true)}
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

     <div class="flex w-full flex-col justify-start">
		<label for="parentId" class={label}>Choose from a list of Tutorss:</label>

     <ComboboxComp bind:value={$form.tutor} name="tutor" {items} />
    
		{#if $errors.tutor}<span class="text-red-500">{$errors.tutor}</span>{/if}
	</div>

	{@render selects('subject', subjects)}


    <div class="flex w-full flex-col justify-start">
		<label for="notes" class={label}>Notes:</label>

        <textarea name="notes" 
         rows="4"
         placeholder="Enter added notes about why you chose this match"
         
         class="{input} flex flex-row justify-between
    {$errors.notes ? '!border-red-500' : ''} "
			
			bind:value={$form.notes}
			aria-invalid={$errors.notes ? 'true' : undefined}

         
         ></textarea>

		{#if $errors.notes}<span class="text-red-500">{$errors.notes}</span>{/if}
	</div>

	<input type="hidden" name="id" value={id}>

	 <button type="submit" class="{submitButton} w-full" >
		{#if $delayed}
		 <Loadingbtn name="Adding Tutor" />
		{:else}
		<Plus />
		Add Tutor
		{/if}
	</button>
</form>