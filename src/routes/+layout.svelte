<script lang='ts'>
  import { invalidate } from '$app/navigation'

  let { data: propsData, children } = $props()
  let { session, supabase } = $derived(propsData)

  $effect(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth')
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

<div>
	<h1>Hello From Layout</h1>
	{@render children()}
</div>