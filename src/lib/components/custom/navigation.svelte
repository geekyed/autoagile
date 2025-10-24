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
        class="group relative pb-1 text-gray-700 transition-colors duration-300 hover:text-purple-700 dark:text-gray-300"
      >
        Home
        {#if path === '/'}
          <span
            class="absolute bottom-0 left-0 h-[2px] w-full bg-[rgb(109,40,217)] transition-all duration-300"
          ></span>
        {/if}
        <span
          class="absolute bottom-0 left-0 h-[2px] w-0 bg-[rgb(109,40,217)] transition-all duration-300 group-hover:w-full"
        ></span>
      </a>
    </li>

    <li>
      <a
        href="/profile"
        class="group relative pb-1 text-gray-700 transition-colors duration-300 hover:text-purple-700 dark:text-gray-300"
      >
        Profile
        {#if path === '/profile'}
          <span
            class="absolute bottom-0 left-0 h-[2px] w-full bg-[rgb(109,40,217)] transition-all duration-300"
          ></span>
        {/if}
        <span
          class="absolute bottom-0 left-0 h-[2px] w-0 bg-[rgb(109,40,217)] transition-all duration-300 group-hover:w-full"
        ></span>
      </a>
    </li>

    <li>
      <a
        href="/car-charging"
        class="group relative pb-1 text-gray-700 transition-colors duration-300 hover:text-purple-700 dark:text-gray-300"
      >
        Car Config
        {#if path === '/car-charging'}
          <span
            class="absolute bottom-0 left-0 h-[2px] w-full bg-[rgb(109,40,217)] transition-all duration-300"
          ></span>
        {/if}
        <span
          class="absolute bottom-0 left-0 h-[2px] w-0 bg-[rgb(109,40,217)] transition-all duration-300 group-hover:w-full"
        ></span>
      </a>
    </li>
  </ul>
</nav>
