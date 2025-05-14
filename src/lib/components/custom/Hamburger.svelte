
<script lang='ts'>
  import { BatteryCharging, Github, LogOut, Menu, Settings, User } from '@lucide/svelte';
  
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import DarkModeInDropdown from '$lib/components/custom/darkModeInDropdown.svelte';
	import { Button, buttonVariants } from '../ui/button';

  interface PropsType {
    userProfile: {
    id: string;
    name: string;
    email: string;
    octopusAccountId: string;
    octopusAPIKey: string;
    octopusTariff: string | null;
    } | null | undefined
  }

  const { userProfile }: PropsType = $props()
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class={buttonVariants({ variant: "outline" }) + 'focus:border-none'}><Menu/></DropdownMenu.Trigger>
  <DropdownMenu.Content class='w-72 top-10px'>
    <DropdownMenu.Group>
      <DropdownMenu.Item>
        <Button variant='ghost' class='flex flex-row w-full justify-start text-lg focus:border-none focus:outline-none' href='/'><BatteryCharging class="mr-2 size-6"/> 
          Charge
        </Button>
      </DropdownMenu.Item>
      <DropdownMenu.Item><Button variant='ghost' class='flex flex-row w-full justify-start text-lg focus:border-none focus:outline-none' href='profile'><User class="mr-2 size-6"/> Profile</Button></DropdownMenu.Item>
      <DropdownMenu.Item><Button variant='ghost' class='flex flex-row w-full justify-start text-lg focus:border-none focus:outline-none'  href='car-charging'><Settings class="mr-2 size-6"/> Car Config</Button></DropdownMenu.Item>
      <DropdownMenu.Separator />
    </DropdownMenu.Group>
    <DropdownMenu.Group>
      <DropdownMenu.Item>
        <DarkModeInDropdown />
      </DropdownMenu.Item>
    {#if userProfile === null}
      <DropdownMenu.Item>
        <Button variant='ghost' class='flex flex-row w-full justify-start text-lg focus:border-none focus:outline-none' href='/auth/login/github'><Github class="mr-2 size-6"/> Sign in with GitHub</Button>
      </DropdownMenu.Item>	
    {:else}
      <DropdownMenu.Item>
        <Button variant='ghost' class='flex flex-row w-full justify-start text-lg focus:border-none focus:outline-none' href="/auth/logout"><LogOut class="mr-2 size-6"/> Logout</Button>
      </DropdownMenu.Item>
    {/if}
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>