<script>
	import Button from "../../../lib/components/ui/button/button.svelte";


	import { Card } from "../../../lib/components/ui/card";
	import CardContent from "../../../lib/components/ui/card/card-content.svelte";
	import CardHeader from "../../../lib/components/ui/card/card-header.svelte";
</script>

<Card>
  <CardHeader>
    Login to the site!
  </CardHeader>
  <CardContent>
    <Button href="/auth/login/github">sign in with github</Button>
  </CardContent>
</Card>