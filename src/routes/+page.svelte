<script lang='ts'>
	import { Button } from '../lib/components/ui/button';

  const { data } = $props()

  $inspect(data.profiles);
</script>

<Button href='/auth/login'>Login</Button>