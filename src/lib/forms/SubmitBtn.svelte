<script>
	import { HardDriveUpload, Loader, UserPlus } from "@lucide/svelte";

    let {delayed, name, form, progressName="...", type="create", className } = $props()
</script>


<button type="submit" {form} class={className}>
    {#if delayed==='true'}<Loader class="h-4 w-4 animate-spin" /> 
            <span class="animate-pulse">{progressName}...</span>
    {:else}
     {#if type='create'}
    <UserPlus class="h-4 w-4" />
    {:else if type='edit'}
     <HardDriveUpload class="h-4 w-4"/>
     {/if}

    {name}
{/if}


</button>
