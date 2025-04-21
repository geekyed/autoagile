<script lang='ts'>
	import { Button } from '../lib/components/ui/button';
	import { Card, CardContent, CardHeader } from '../lib/components/ui/card';
	import Input from '../lib/components/ui/input/input.svelte';
	import { Label } from '../lib/components/ui/label';
  import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';

  const { data } = $props()
  const {userProfile} = data;

  let name = $state('');
  let email = $state('');
  let octopusAccountID = $state('');
  let octopusAPIKey = $state('');
  let octopusTariff = $state('');

  $effect(() => {
    if (userProfile) {
      name = userProfile.name;
      email = userProfile.email;
      octopusAccountID = userProfile.octopusAccountId;
      octopusAPIKey = userProfile.octopusAPIKey;
      octopusTariff = userProfile.octopusTariff || '';
    }
  });

</script>

{#if userProfile}
<Button variant='secondary' href="/auth/logout">Logout</Button>
<Card>
  <CardHeader>
    Manage your profile
  </CardHeader>
  <CardContent>
    <form method="post" use:enhance={({formData}) => {
      formData.set('name', name);
      formData.set('email', email);
      formData.set('octopusAccountId', octopusAccountID);
      formData.set('octopusAPIKey', octopusAPIKey);
      return ({result}) => {
        if (result.type === 'success') {
          invalidate('/')
          alert('Profile updated successfully');
        } else {
          alert('Failed to update profile');
        }
      };
    }}>
        <div>    
          <Label>Email</Label>
          <Input bind:value={email}></Input>
        </div>
        <div>    
          <Label>Name</Label>
          <Input bind:value={name}></Input>
        </div>
        <div>    
          <Label>Octopus Account Id</Label>
          <Input bind:value={octopusAccountID}></Input>
        </div>
        <div>    
          <Label>Octopus API Key</Label>
          <Input bind:value={octopusAPIKey}></Input>
        </div>
        <div>
          <p>
            <Label>Octopus Tariff Code</Label>
            <Input value={octopusTariff} disabled></Input>
          </p>
        </div>
        <div>
          <Button type='submit'>Update</Button>
        </div>
    </form>
  </CardContent>
</Card>
{:else}
  <h1>Welcome to the site!</h1>
  <Button href="/auth/login/github">Sign in with GitHub</Button>
{/if}