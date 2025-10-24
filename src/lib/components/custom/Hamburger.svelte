<script lang="ts">
  import { BatteryCharging, Github, LogOut, Menu, Settings, User, Chrome } from '@lucide/svelte';

  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import DarkModeInDropdown from '$lib/components/custom/darkModeInDropdown.svelte';
  import { Button, buttonVariants } from '../ui/button';
  import type { Session } from '@supabase/supabase-js';

  interface PropsType {
    session: Session | null | undefined;
  }

  const { session }: PropsType = $props();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class={buttonVariants({ variant: 'outline' })}
    ><Menu /></DropdownMenu.Trigger
  >
  <DropdownMenu.Content class="top-10px w-72">
    <DropdownMenu.Group>
      <DropdownMenu.Item>
        <Button variant="ghost" class="flex w-full flex-row justify-start text-lg" href="/"
          ><BatteryCharging class="mr-2 size-6" />
          Charge
        </Button>
      </DropdownMenu.Item>
      <DropdownMenu.Item
        ><Button variant="ghost" class="flex w-full flex-row justify-start text-lg" href="profile"
          ><User class="mr-2 size-6" /> Profile</Button
        ></DropdownMenu.Item
      >
      <DropdownMenu.Item
        ><Button
          variant="ghost"
          class="flex w-full flex-row justify-start text-lg"
          href="car-charging"><Settings class="mr-2 size-6" /> Car Config</Button
        ></DropdownMenu.Item
      >
      <DropdownMenu.Separator />
    </DropdownMenu.Group>
    <DropdownMenu.Group>
      <DropdownMenu.Item>
        <DarkModeInDropdown />
      </DropdownMenu.Item>
      {#if !session}
        <DropdownMenu.Item>
          <Button
            variant="ghost"
            class="flex w-full flex-row justify-start text-lg"
            href="/auth/login/github"><Github class="mr-2 size-6" /> Sign in with GitHub</Button
          >
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Button
            variant="ghost"
            class="flex w-full flex-row justify-start text-lg"
            href="/auth/login/google"><Chrome class="mr-2 size-6" /> Sign in with Google</Button
          >
        </DropdownMenu.Item>
      {:else}
        <DropdownMenu.Item>
          <Button
            variant="ghost"
            class="flex w-full flex-row justify-start text-lg"
            href="/auth/logout"><LogOut class="mr-2 size-6" /> Logout</Button
          >
        </DropdownMenu.Item>
      {/if}
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
