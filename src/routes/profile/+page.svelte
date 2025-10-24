<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
  import Input from '$lib/components/ui/input/input.svelte';
  import { Label } from '$lib/components/ui/label';
  import { enhance } from '$app/forms';

  const { data } = $props();
  const { userProfile, session } = data;

  let name = $state('');
  let email = $state('');
  let groupName = $state('');
  let octopusAccountId = $state('');
  let octopusAPIKey = $state('');
  let inviteEmail = $state('');

  let editGroup = $state(false);

  $effect(() => {
    if (userProfile) {
      name = userProfile.name;
      email = userProfile.email;
      groupName = userProfile.group.name;
    }
    email = session?.user?.email || '';
  });
</script>

<div class="flex flex-col items-center gap-5">
  <Card class="w-full max-w-xl">
    <CardHeader>
      <h2 class="text-lg font-semibold">User Profile</h2>
    </CardHeader>
    <CardContent>
      <form
        class="flex flex-col gap-2"
        method="post"
        action="?/saveProfile"
        use:enhance={({ formData }) => {
          formData.set('name', name);
          formData.set('email', email);
          return ({ result }) => {
            if (result.type === 'success') {
              alert('profile updated');
              window.location.reload();
            } else {
              alert(`Failed to update profile: ${result.status}`);
              console.error(JSON.stringify(result));
            }
          };
        }}
      >
        <div>
          <Label>Email</Label>
          <Input bind:value={email} />
        </div>
        <div>
          <Label>Name</Label>
          <Input bind:value={name} />
        </div>
        <div class="flex flex-row gap-5 text-sm text-muted-foreground">
          <Button type="submit">{userProfile ? 'Update Profile' : 'Create Profile'}</Button>
        </div>
      </form>
    </CardContent>
  </Card>
  {#if userProfile?.group}
    <Card class="w-full max-w-xl">
      <CardHeader>
        <h2 class="text-lg font-semibold">Group Settings</h2>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <div class="flex flex-row items-center justify-center gap-5 text-sm text-muted-foreground">
          <Label>Name: {userProfile?.group.name}</Label>
          <Label>Tariff: {userProfile?.group.octopusTariff}</Label>
          {#if userProfile?.group.ownerId && userProfile?.group.ownerId === session?.user?.id}
            <Button variant="secondary" onclick={() => (editGroup = !editGroup)}
              >{editGroup ? 'Hide Group' : 'Edit Group'}</Button
            >
          {/if}
        </div>
        {#if editGroup}
          <form
            class="flex flex-col gap-2"
            method="post"
            action="?/saveGroup"
            use:enhance={({ formData }) => {
              formData.set('groupId', userProfile?.group.id || '');
              formData.set('groupName', groupName);
              formData.set('octopusAccountId', octopusAccountId);
              formData.set('octopusAPIKey', octopusAPIKey);
              return ({ result }) => {
                if (result.type === 'success') {
                  window.location.reload();
                  alert('Group updated!');
                } else {
                  alert('Failed to update group');
                }
              };
            }}
          >
            <div>
              <Label>Group Name</Label>
              <Input bind:value={groupName} />
            </div>
            <div class="flex flex-col gap-2 text-sm text-muted-foreground">
              <Label>Octopus Account ID</Label>
              <Input bind:value={octopusAccountId} />
              <Label>Octopus API Key</Label>
              <Input bind:value={octopusAPIKey} />
            </div>
            <div>
              <Button type="submit">{userProfile?.group ? 'Update Group' : 'Create Group'}</Button>
            </div>
          </form>
          <form
            class="flex flex-col gap-2"
            method="post"
            action="?/sendInvite"
            use:enhance={({ formData }) => {
              formData.set('email', inviteEmail);
              return ({ result }) => {
                if (result.type === 'success') {
                  alert('Invite sent!');
                } else {
                  alert('Failed to send invite');
                }
              };
            }}
          >
            <div class="flex flex-row items-center justify-center gap-2">
              <Label class="w-52">Invite Email</Label>
              <Input bind:value={inviteEmail} />
              <Button variant="secondary" type="submit">Send Invite</Button>
            </div>
          </form>
        {/if}
      </CardContent>
    </Card>
  {/if}
</div>
