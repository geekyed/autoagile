<script lang="ts">
  import { toggleMode, mode } from "mode-watcher";

  import Sun from "@lucide/svelte/icons/sun";
  import Moon from "@lucide/svelte/icons/moon";
	import { Button } from "../ui/button";

  let currentMode = $state("dark")

  $effect(() => {
    mode.subscribe((modeChangedTo) => {
      currentMode = modeChangedTo || 'dark' 
    })
  })
</script>

<Button variant="ghost" class='flex flex-row justify-center items-center p-0 gap-0 h-6' onclick={toggleMode}>
  {#if currentMode=== 'light'}
    <Moon class="mr-2 size-6"/> Dark
  {:else}
    <Sun class="mr-2 size-6"/> Light
  {/if}
</Button>