<script lang="ts">
import { page } from '$app/state';

let path = $state(page.url.pathname);

$effect(() => {
  path = page.url.pathname;
});
</script>

<nav class="w-full">
  <ul class="flex justify-center gap-8 py-4">
    <li>
      <a
        href="/"
        class="group relative pb-1 text-gray-700 dark:text-gray-300 hover:text-purple-700 transition-colors duration-300"
      >
        Home
        {#if path === '/'}
          <span class="absolute left-0 bottom-0 w-full h-[2px] bg-[rgb(109,40,217)] transition-all duration-300"></span>
        {/if}
        <span
          class="absolute left-0 bottom-0 w-0 h-[2px] bg-[rgb(109,40,217)] group-hover:w-full transition-all duration-300"
        ></span>
      </a>
    </li>

    <li>
      <a
        href="/profile"
        class="group relative pb-1 text-gray-700 dark:text-gray-300 hover:text-purple-700 transition-colors duration-300"
      >
        Profile
        {#if path === '/profile'}
          <span class="absolute left-0 bottom-0 w-full h-[2px] bg-[rgb(109,40,217)] transition-all duration-300"></span>
        {/if}
        <span
          class="absolute left-0 bottom-0 w-0 h-[2px] bg-[rgb(109,40,217)] group-hover:w-full transition-all duration-300"
        ></span>
      </a>
    </li>

    <li>
      <a
        href="/car-charging"
        class="group relative pb-1 text-gray-700 dark:text-gray-300 hover:text-purple-700 transition-colors duration-300"
      >
        Car Config
        {#if path === '/car-charging'}
          <span class="absolute left-0 bottom-0 w-full h-[2px] bg-[rgb(109,40,217)] transition-all duration-300"></span>
        {/if}
        <span
          class="absolute left-0 bottom-0 w-0 h-[2px] bg-[rgb(109,40,217)] group-hover:w-full transition-all duration-300"
        ></span>
      </a>
    </li>
  </ul>
</nav>
