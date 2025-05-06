<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import Navigation from '$lib/components/custom/navigation.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { ModeWatcher, toggleMode } from "mode-watcher";
	import DarkMode from '$lib/components/custom/darkMode.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { BatteryCharging, Github, LogOut, Menu, Moon, Settings, Sun, User } from '@lucide/svelte';
	import DarkModeInDropdown from '../lib/components/custom/darkModeInDropdown.svelte';

	let { data: propsData, children } = $props();
	let { session, supabase, userProfile } = $derived(propsData);

	let windowInnerWidth = $state(0)

	$effect(() => {
		windowInnerWidth = window.innerWidth
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<div class="flex items-center justify-between p-4 gap-4">
  <div class="w-10 sm:w-24"></div>
  <h1 class="flex-grow text-center text-4xl font-semibold">Octomiser</h1>
	{#if windowInnerWidth > 768}
		<div class="flex gap-2 items-center">
			{#if userProfile === null}
				<Button variant="secondary" href="/auth/login/github">Sign in with GitHub</Button>
			{:else}
				<Button variant="secondary" href="/auth/logout">Logout</Button>
			{/if}
			<DarkMode />
		</div>
	{:else}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class={buttonVariants({ variant: "outline" })}><Menu/></DropdownMenu.Trigger>
				<DropdownMenu.Content class='w-72 top-10px'>
					<DropdownMenu.Group>
						<DropdownMenu.Item><a class='flex flex-row justify-center items-center w-22 h-6' href='/'><BatteryCharging class="mr-2 size-6"/> Charge</a></DropdownMenu.Item>
						<DropdownMenu.Item><a class='flex flex-row justify-center items-center w-22 h-6' href='profile'><User class="mr-2 size-6"/> Profile</a></DropdownMenu.Item>
						<DropdownMenu.Item><a class='flex flex-row justify-center items-center w-22 h-6'  href='car-charging'><Settings class="mr-2 size-6"/> Car Config</a></DropdownMenu.Item>
						<DropdownMenu.Separator />
					</DropdownMenu.Group>
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<DarkModeInDropdown />
					</DropdownMenu.Item>
				{#if userProfile === null}
					<DropdownMenu.Item>
						<a class='flex flex-row justify-center items-center w-22 h-6' href='/auth/login/github'><Github class="mr-2 size-6"/> Sign in with GitHub</a>
					</DropdownMenu.Item>	
				{:else}
					<DropdownMenu.Item>
						<a class='flex flex-row justify-center items-center w-22 h-6' href="/auth/logout"><LogOut class="mr-2 size-6"/> Logout</a>
					</DropdownMenu.Item>
				{/if}
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	{/if}

</div>

{#if userProfile && windowInnerWidth>768}
	<Navigation/>
{/if}

<ModeWatcher />

{@render children()}

