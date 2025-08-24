<script lang='ts'>
	import ChildrenTable from '$lib/ChildrenTable.svelte';




   let { data } = $props();

   let pendingPayments = $state(data.pendingPayments);

   let tableHeaders = $state([
    
   
   {name:'Id', key: 'id'},
   {name:'First Name', key: 'firstName'},
   {name:'Last Name', key: 'lastName'},
   {name:' Phone', key: 'phone'},
   {name:'Amount', key: 'amount'},
   {name:'Month', key: 'month'},
   {name:'Status', key: 'status'},
   {name:'Bank Account', key: 'bankAccount'},
   {name:'Payment Method', key: 'paymentMethod'},

  ]);

 
 
 


</script>

 <svelte:head>
   <title> Employee Payments</title>
 </svelte:head>

 <h1>Employee Pending Salaries</h1>
 <div class= "flex flex-col flex-start overflow-x-auto">
<ChildrenTable mainlist= {pendingPayments} {tableHeaders} link="employees" search=true />
</div>


