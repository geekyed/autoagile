<script lang="ts">
	import { Button } from "../lib/components/ui/button";

  const { session } = $props();
</script>

<div class="flex flex-col items-center justify-center">
  {#if session === null}
      <Button variant='secondary' href="/auth/login/github">Sign in with GitHub</Button>
  {:else}
      <Button variant='secondary' href="/auth/logout">Logout</Button>
  {/if}
  <nav>
    <ul  class="flex flex-row m-2 gap-5">
      <li>
        <a href="/">
          <span class="flex-auto">Devices</span>
        </a>
      </li>

      <li>
        <a href="/profile">
          <span class="flex-auto">Profile</span>
        </a>
      </li>
    </ul>
  </nav>
</div>