<script lang="ts">
 import CalendarIcon from "@lucide/svelte/icons/calendar";
 import {
	CalendarDate,
  DateFormatter,
  type DateValue,
  getLocalTimeZone,

  today

 } from "@internationalized/date";
 import { cn } from "$lib/utils.js";
 import { buttonVariants } from "$lib/components/ui/button/index.js";
 import { Calendar } from "$lib/components/ui/calendar/index.js";
 import * as Popover from "$lib/components/ui/popover/index.js";
 
 const df = new DateFormatter("en-US", {
  dateStyle: "long"
 });

 let { value= $bindable(), name} = $props();
 
 let contentRef = $state<HTMLElement | null>(null);

 const minValue: DateValue = new CalendarDate(1995, 1, 1); 

</script>
 
<Popover.Root>
 <Popover.Trigger
  class={cn(
   buttonVariants({
    variant: "outline",
    class: "w-full justify-start text-left font-normal capitalize"
   }),
   !value && "text-muted-foreground"
  )}
 >
  <CalendarIcon />
  {value ? df.format(value.toDate(getLocalTimeZone())) : name.replace(/([a-z])([A-Z])/g, '$1 $2')}
 </Popover.Trigger>
 <Popover.Content bind:ref={contentRef} class="w-auto p-0">
  <Calendar type="single" captionLayout="dropdown" bind:value
   {minValue}
    maxValue={today(getLocalTimeZone())}
     />
 </Popover.Content>
</Popover.Root>

<input type="hidden" {name} bind:value>
