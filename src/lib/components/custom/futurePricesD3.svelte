<script lang="ts">
	import { Card, CardContent } from "../ui/card";
	import CardHeader from "../ui/card/card-header.svelte";
	import { Label } from "../ui/label";
	import { ScrollArea } from "../ui/scroll-area";

  const { prices, carChargeTimespans }: { prices: Price[]; carChargeTimespans: AndersenChargeTimespan[] } = $props();

  const getColor = (value: number): string => {
    if (value === 999) return "#ffffff"; 
    if (value < 0) return "#c084fc";
    if (value < 5) return "#60a5fa"; 
    if (value < 10) return "#4adec5";
    if (value < 15) return "#4ade5b";
    if (value < 20) return "#facc15";
    if (value < 25) return "#f97316";
     return "#f43f5e";
  }

  const isCharging = (start: Date, end: Date) => {
    return carChargeTimespans.some(span =>
      span.startTime <= start && span.endTime >= end
    );
  }
</script>

<Card class='w-full max-w-xl flex flex-col gap-2x items-center min-h-fit'>
  <CardHeader>
    {prices[0].start.toLocaleDateString()}
  </CardHeader>
  <CardContent>
    <ScrollArea class='min-w-[34rem]'>
      <div class="w-full max-w-4xl max-h-72">
        {#each prices as price}
          <div
            class="flex items-center border-spacing-2 border justify-between p-2 rounded text-sm relative overflow-hidden"
            style="background-color: {getColor(price.price)}"
          >
            <span class="text-gray-800 font-medium">
              {price.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span class="font-semibold text-gray-900">{price.price.toFixed(1)}p</span>

            {#if isCharging(price.start, price.end)}
              <div class="absolute top-0 bottom-0 right-14 w-1 bg-black/40 rounded-sm"></div>
            {/if}
          </div>
        {/each}
      </div>
    </ScrollArea>
  </CardContent>
</Card>



<style>
  /* Optional extra styling for mobile & aesthetics */
  div::-webkit-scrollbar {
    display: none;
  }
</style>
