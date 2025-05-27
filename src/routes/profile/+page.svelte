<script lang='ts'>
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Label } from '$lib/components/ui/label';
  import { enhance } from '$app/forms';

  const { data } = $props()
  const {userProfile, session } = data;

  let name = $state('');
  let email = $state('');
  let groupName = $state('');
  let octopusAccountId = $state('');
  let octopusAPIKey = $state('');
  let octopusTariff = $state('');

  $effect(() => {
    if (userProfile) {
      name = userProfile.name;
      email = userProfile.email;
      groupName = userProfile.group.name;
      octopusTariff = userProfile.group.octopusTariff || 'none found';
    }
    email = session?.user?.email || '';
  });

</script>
<div class='flex flex-col items-center gap-5'>
  <Card class='w-full max-w-xl'>
    <CardContent>
      <form class='flex flex-col gap-2' method="post" action="?/saveProfile" use:enhance={({formData}) => {
        formData.set('name', name);
        formData.set('email', email);
        return ({result}) => {
          if (result.type === 'success') {
            alert('profile updated');
            window.location.reload();
          } else {
            alert(`Failed to update profile: ${result.status}`);
            console.error(JSON.stringify(result));
          }
        };
      }}>
          <div>    
            <Label>Email</Label>
            <Input bind:value={email}/>
          </div>
          <div>    
            <Label>Name</Label>
            <Input bind:value={name}/>
          </div>
          <div>
          <Button type='submit'>{userProfile ? 'Update Profile' : 'Create Profile'}</Button>
          </div>
      </form>
    </CardContent>
  </Card>
  {#if userProfile?.group}
  <Card class='w-full max-w-xl'>
    <CardContent>
      <form class='flex flex-col gap-2' method="post" action="?/saveGroup" use:enhance={({formData}) => {
        formData.set('groupId', userProfile?.group.id || '');
        formData.set('groupName', groupName);
        formData.set('octopusAccountId', octopusAccountId);
        formData.set('octopusAPIKey', octopusAPIKey);
        return ({result}) => {
          if (result.type === 'success') {
            window.location.reload();
          } else {
            alert('Failed to update group');
          }
        };
      }}>
      <div>
        <Label>Group Name</Label>
        <Input bind:value={groupName} />
      </div>
      <div>
        <Label>Octopus Account ID</Label>
        <Input bind:value={octopusAccountId} />
      </div>
      <div>    
        <Label>Octopus API Key</Label>
        <Input type='password' bind:value={octopusAPIKey} />
      </div>
      <div>
        <Label>Octopus Tariff Code</Label>
        <Input bind:value={octopusTariff} disabled />
      </div>
      <div>
      <Button type='submit'>{userProfile?.group ? 'Update Group' : 'Create Group'}</Button>
      </div>
      </form>
    </CardContent>
  </Card>
  {/if}
</div>