
<script lang='ts'>
	import ChildrenTable from "$lib/ChildrenTable.svelte";
	import SingleTable from "$lib/SingleTable.svelte";
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

    
  
  let message = $state('');
  
// const fileName = `${data.employee.firstName} ${data.employee.lastName} .pdf`;
// const buttonName = `Download ${data.employee.firstName} as PDF`
  async function copyPhoneNumber(copied: string) {
    try {
      await navigator.clipboard.writeText(copied);
      message = 'Copied!';
      setTimeout(() => (message = ''), 2000);

    } catch (err) {
      message = 'Failed to copy!';
      console.error(err);
      setTimeout(() => (message = ''), 2000);

    }
  }
      let bankAccounts =  $state(data.bankAccounts);
  let bankHeader = $state([
     { name: 'Id', key: 'id'},
     { name: 'Payment Method', key: 'name'},
     { name: 'Account Number', key: 'bankAccount'},
     { name: 'Default Account', key: 'idDefault'},
     
  ])

</script>
<svelte:head>
   <title> {data.employee.firstName} {data.employee.lastName}</title>
</svelte:head>
    <!-- <div class="fixed right-4 top-24">
    <JSPDF {fileName} tableId="#employeedetail" {buttonName} />

</div> -->


<div class="min-h-screen py-10 flex flex-start flex-col gap-4">
  <div class="bg-white dark:bg-dark shadow-lg dark:shadow-md dark:shadow-gray-600 rounded-md min-w-3xl w-md">
    <div class="bg-gradient-to-r from-dark to-black text-white py-6 px-8 rounded-lg">
      <h1 class="text-center">Employee Details</h1>
    </div>
      <SingleTable {singleTable}/>
    </div>
     <div class="flex flex-col flex-start gap-4">
      <h1>Bank Accounts</h1>

<ChildrenTable mainlist = {bankAccounts} tableHeaders = {bankHeader} />
</div>

</div>
    <!-- <div class="py-8 px-6">
      {#await data}
           <h1 class="flex flex-row m-2">     Loading Employee Data <LoaderCircle class="animate-spin" /></h1>

        
      {:then employee} 
        




       
      <table id="employeedetail" class="w-full table-auto text-left">
        <thead class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wider">
          <tr>
            <th class="py-3 px-4">Detail</th>
            <th class="py-3 px-4">Value</th>
          </tr>
        </thead>
        <tbody class="text-gray-900 dark:text-gray-100">
          <tr>
            <td class="py-3 px-4 font-semibold">Name</td>
            <td class="py-3 px-4">{data.employee?.firstName} {data.employee?.lastName}</td>
          </tr>
          <tr>
            <td class="py-3 px-4 font-semibold">Gender</td>
            <td class="py-3 px-4 capitalize">{data.employee?.gender}</td>
          </tr>
          <tr>
            <td class="py-3 px-4 font-semibold">Date of Birth</td>
            <td class="py-3 px-4">{data.employee?.birthday}</td>
          </tr>
          <tr>
            <td class="py-3 px-4 font-semibold">Salary</td>
            <td class="py-3 px-4">{data.employee?.salary}</td>
          </tr>
          <tr>
            <td class="py-3 px-4 font-semibold">Position</td>
            <td class="py-3 px-4">{data.employee?.position}</td>
            
          </tr>
          <tr>
            <td class="py-3 px-4 font-semibold">Hired Date</td>
            <td class="py-3 px-4">{data.employee?.joined}</td>
          </tr>
          <tr>
             <td class="py-3 px-4 font-semibold">Phone</td>
            <td class="py-3 px-4"><button onclick={()=>copyPhoneNumber(data.employee?.phone)}>{data.employee?.phone}
              <p class="text-blue-500">{message}</p>
            </button> 
            </td>
          </tr>
          <tr>
            <td class="py-3 px-4 font-semibold">Address</td>
            <td class="py-3 px-4">{data.employee?.address}</td>
          </tr>
          <tr>
            <td class="py-3 px-4 font-semibold">Is Employee Active</td>
            <td class="py-3 px-4">{data.employee?.isActive ? 'Yes' : 'No'}</td>
          </tr>
        </tbody>
      </table>
        {/await}
    </div>
  </div>
</div> -->