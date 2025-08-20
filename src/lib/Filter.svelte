<script>
    let { objects = [], key = '', value = ''} = $props();

    let filteredObjects = $derived(() => {
        if (!key || value === undefined) return objects;
        return objects.filter(obj => 
            obj[key] !== undefined && 
            String(obj[key]).toLowerCase().includes(String(value).toLowerCase())
        );
    });
</script>

Filter

{#each objects as object}
    <div>
        {JSON.stringify(object)}
    </div>
{/each}