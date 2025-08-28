<script lang="ts">
	import { enhance } from "$app/forms";
    import { input, label, submitButton} from '$lib/global.svelte.js';
    import * as Select from "$lib/components/ui/select/index.js";

 
  let value = $state<string | undefined>();
 

    let {form} = $props();
 
</script>
{#snippet fe(labeler, name, type)}
 <div class="flex justify-start flex-col w-full">
 <label for={name} class={label}>{labeler}</label>
 <input type={type} name={name} class={input} required />
 </div>
{/snippet}

<form use:enhance action="?/createEmployee" class="rounded-lg w-xl bg-white dark:bg-black flex flex-col gap-4 p-6" method="POST">
    <h2>Add New Employee</h2>
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
    </div>

    {@render fe("Address", "address", "text")}
    {@render fe("Phone", "phone", "tel")}
    {@render fe("Date of Birth", "dateOfBirth", "date")}

    {@render fe("Position", "position", "text")}
    {@render fe("Salary", "salary", "number")}
    {@render fe("Hire Date", "hireDate", "date")}


    <button type="submit" class="{submitButton} w-full">Submit</button>
</form>


