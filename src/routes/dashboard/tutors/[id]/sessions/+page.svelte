<script>
    import ChildrenTable from "$lib/ChildrenTable.svelte";

    let {data} = $props();

    let tutorSessions = data.tutorSessions;

    let tableHeaders = [
        { name: "Session ID", key: "id" },
        { name: "Student First Name", key: "firstName" },
        { name: "Student Last Name", key: "lastName" },
        { name: "Phone", key: "phone" },
        { name: "Subject", key: "subject" },
        { name: "Scheduled Start", key: "scheduledStart" },
        { name: "Scheduled End", key: "scheduledEnd" },
        { name: "Actual Start", key: "actualStart" },
        { name: "Actual End", key: "actualEnd" },
        { name: "Status", key: "status" },
        { name: "Notes", key: "notes" }
    ];

</script>

<div class="flex flex-col justify-start items-start">
    <h1 class="text-2xl font-bold mb-4">Tutoring Sessions for {data.tutor.firstName} {data.tutor.lastName}</h1>
    
    {#if tutorSessions.length ===  0}
        <p class="text-gray-500 dark:text-gray-100">No sessions found for this tutor.</p>
    {:else}
       <div class="w-[90%] flex flex-start flex-col">
           <ChildrenTable mainlist={tutorSessions} {tableHeaders} link='students' search=true />
       </div>
    {/if}

</div>