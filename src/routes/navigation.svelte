<script lang="ts">
  const { userProfile } = $props();
</script>

<div class="flex flex-col items-center justify-center">
  <nav>
    <ul  class="flex flex-row m-2 gap-5">
      <li>
        <a href="/">
          <span class="flex-auto">Home</span>
        </a>
      </li>
{#if userProfile}
      <li>
        <a href="/profile">
          <span class="flex-auto">Profile</span>
        </a>
      </li>
      <li>
        <a href="/car-charging">
          <span class="flex-auto">Car Charge</span>
        </a>
      </li>
      <li>
        <a href="/smart-devices">
          <span class="flex-auto">Smart Devices</span>
        </a>
      </li>
{/if}
    </ul>
  </nav>
</div>
