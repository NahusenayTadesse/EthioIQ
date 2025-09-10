
<script lang='ts'>
	import ChildrenTable from "$lib/ChildrenTable.svelte";
	import Loadingbtn from "$lib/formComponents/Loadingbtn.svelte";
	import RadioComp from "$lib/formComponents/RadioComp.svelte";
	import SingleTable from "$lib/SingleTable.svelte";
	import { Plus } from "@lucide/svelte";
  import { superForm } from 'sveltekit-superforms';
	import type { Snapshot } from './$types.js';
	import { createForm, input, label, submitButton } from "$lib/global.svelte.js";
	import SelectComp from "$lib/formComponents/SelectComp.svelte";
  let { data } = $props();
  let employee = $state(data.employee);

let singleTable = [
    { name: 'Name', value: employee.firstName + ' ' + employee.lastName },
    { name: 'Gender', value: employee.gender },
    { name: 'Phone', value: employee.phone }, 
    { name: 'Hired Date', value: employee.joined },
    { name: 'Salary', value: employee.salary },
    { name: 'Date of Birth', value: employee.birthday },
    { name: 'Address', value: employee.address },
    { name: 'Position', value: employee.position },
    { name: 'Active Status', value: employee.isActive ? 'Active' : 'Inactive' }
];
  let bankHeader = $state([
     { name: 'Id', key: 'id'},
     { name: 'Payment Method', key: 'name'},
     { name: 'Account Number', key: 'bankAccount'},
     { name: 'Default Account', key: 'idDefault'},
     
  ]);

      let value = $state<string | undefined>();

    const {
    form,
    errors,
    enhance,
    constraints,
    delayed,
    message: bankMessage,
    capture,
    restore
  } = superForm(data.form);

    export const snapshot: Snapshot = { capture, restore };




</script>
<svelte:head>
   <title> {data.employee.firstName} {data.employee.lastName}</title>
</svelte:head>
    <!-- <div class="fixed right-4 top-24">
    <JSPDF {fileName} tableId="#employeedetail" {buttonName} />

</div> -->


<div class="min-h-screen py-10 flex flex-start flex-col gap-4">
  <div class="bg-white dark:bg-dark shadow-lg dark:shadow-md dark:shadow-gray-600 rounded-md min-w-3xl w-md">
    <div class="bg-gradient-to-r from-dark to-black text-white py-6 px-8 rounded-lg flex flex-col justify-center items-center">
      <img src={data.employee.image} alt="" class="w-[150px]" loading="lazy">
      <h1 class="text-center">Employee Details</h1>
    </div>
      <SingleTable {singleTable}/>
    </div>
     <div class="flex flex-col flex-start gap-4">
      <h1>Bank Accounts</h1>

<ChildrenTable mainlist = {data.bankAccounts} tableHeaders = {bankHeader} />
</div>

</div>
<div id="bank">

{#if data.permList?.some(p => p.name === "can_edit_employees")}

<form id="bank" method="post" action="?/addBank" use:enhance class="mt-10 {createForm} !grid-cols-1 !w-1/2 gap-4">
    
    <h3 class="text-center m-4">Add Bank Details for Employee</h3>
    <div class="flex justify-start flex-col w-full gap-2">

        <label for="bank" class={label} >Bank Name</label>
        <SelectComp {value} items={data.banks} name="name" />
            {#if $errors.name}
        <span class="invalid text-red-500">{$errors.name}</span>
        {/if}
       

        </div>

    <div class="flex justify-start flex-col w-full gap-2">
    <label for="accountNumber" class={label} >Account Number</label>
    <input type="text" name="accountNumber" placeholder="Enter the Bank Account Here" 
    class="{input} flex flex-row justify-between
    {$errors.accountNumber ? '!border-red-500' : ''} " required bind:value={$form.accountNumber} 
    aria-invalid={$errors.accountNumber ? 'true' : undefined}
    {...$constraints.accountNumber}
    />
        {#if $errors.accountNumber}
        <span class="invalid text-red-500">{$errors.accountNumber}</span>
        {/if}
    </div>

  



<RadioComp
  name="isDefault"
  btnName= "Is the Account the Default Account for the Employee?"
  items={[
    { value: true,  name: 'Yes, it is Default' },
    { value: false, name: 'No, it is not Default' }
  ]}
/>
<input type="hidden" name="personId" value={data.employee.personId} >

<button type="submit"  class="{submitButton} w-1/2 gap-2">

    {#if $delayed}

      <Loadingbtn name="Adding Bank Details" />
    {:else}
        <Plus class="h-4 w-4" />

    Add Bank Details
   {/if}
</button>

 

</form>

{/if}

</div>