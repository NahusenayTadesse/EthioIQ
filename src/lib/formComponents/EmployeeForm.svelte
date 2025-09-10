    <script lang="ts">
        import { input, label, submitButton} from '$lib/global.svelte.js';
        import * as Select from "$lib/components/ui/select/index.js";

        import { Label } from "$lib/components/ui/label/index.js";


    import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

    

    
    let value = $state<string | undefined>();
    
        import { LoaderCircle } from '@lucide/svelte';


        import type { SuperForm } from 'sveltekit-superforms';
  import type { EmployeeSchema } from '$lib/server/zodschema';

  interface Props {
    form: SuperForm<EmployeeSchema>['form'];
    errors: SuperForm<EmployeeSchema>['errors'];
    enhance: SuperForm<EmployeeSchema>['enhance'];
    constraints: SuperForm<EmployeeSchema>['constraints'];
    message: SuperForm<EmployeeSchema>['message'];
    delayed: SuperForm<EmployeeSchema>['delayed'];
  }

  let { form, errors, enhance, constraints, message, delayed
   } = $props();


        


    </script>
    {#if $message}<h3>{$message}</h3>{/if}

    {#snippet fe(labeler, name, type, placeholder="")}
    <div class="flex justify-start flex-col w-full">
    <Label for={name} class={label} >{labeler}</Label>
    <input type={type} name={name} placeholder={placeholder} 
    class="{input} flex flex-row justify-between
    {$errors[name] ? '!border-red-500' : ''}" required bind:value={$form[name]} 
    aria-invalid={$errors[name] ? 'true' : undefined}
    {...$constraints[name]}
    />
        {#if $errors[name]}<span class="invalid text-red-500">{$errors[name]}</span>{/if}

    </div>
    {/snippet}
    <ScrollArea class="h-screen pb-12" orientation = "vertical" >
    <form use:enhance action="?/createEmployee" 
    class="rounded-lg w-full bg-white dark:bg-black flex flex-col gap-4 p-6"
     method="POST">
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
            {#if $errors.gender}<span class="invalid">{$errors.gender}</span>{/if}

        </div>

        {@render fe("Address", "address", "text")}
        {@render fe("Phone", "phone", "tel")}
        {@render fe("Date of Birth", "dateOfBirth", "date", "Select Date of Birth")}

        {@render fe("Position", "position", "text")}
        {@render fe("Salary", "salary", "number")}
        {@render fe("Hire Date", "hireDate", "date")}

    


        <button type="submit"  class="{submitButton} w-full flex flex-row gap-2">
            {#if $delayed}<LoaderCircle class="h-4 w-4 animate-spin" /> {/if}
    Submit</button>
    {#if $message}<h3>{$message}</h3>{/if}

    </form>
    </ScrollArea>

