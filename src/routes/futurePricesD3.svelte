<script lang="ts">
  import * as d3 from "d3";

  const { prices, carChargeTimespans }: { prices: Price[]; carChargeTimespans: AndersenChargeTimespan[] } = $props();

  const width = 280;
  const rowHeight = 25;
  const rowSpacing = 2;
  const barWidth = 5;

  function getColor(value: number): string {
    if (value === 999) return "#ffffff";
    if (value < 0) return "#d1b3ff";
    if (value < 5) return "#a8c6f1";
    if (value < 10) return "#a0d8d1";
    if (value < 15) return "#d3f0d7";
    if (value < 20) return "#ffffe0";
    if (value < 25) return "#ffd8b1";
    return "#ffb6b6";
  }

  let svgEl: SVGSVGElement;

  $effect(() => {
    if (!svgEl || prices.length === 0) return;

    const sorted = [...prices].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    const totalHeight = sorted.length * (rowHeight + rowSpacing);

    const svg = d3.select(svgEl)
      .attr("width", width)
      .attr("height", totalHeight);

    svg.selectAll("*").remove();

    const group = svg.append("g").attr("transform", "translate(0,0)");

    const cells = group.selectAll("g.cell")
      .data(sorted)
      .enter()
      .append("g")
      .attr("class", "cell")
      .attr("transform", (_, i) => `translate(0,${i * (rowHeight + rowSpacing)})`);

    cells.each(function (d) {
      const g = d3.select(this);

      const priceStart = new Date(d.start).getTime();

      // Background rectangle
      g.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", rowHeight)
        .attr("fill", getColor(d.price))
        .attr("stroke", "#fff")
        .attr("stroke-width", 1);

      // Green bar if charging
      const isCharging = carChargeTimespans.some(span => {
        const spanStart = new Date(span.startTime).getTime();
        const spanEnd = new Date(span.endTime).getTime();
        return priceStart >= spanStart && priceStart < spanEnd;
      });

      if (isCharging) {
        g.append("rect")
          .attr("x", 0)
          .attr("y", -rowHeight)
          .attr("width", barWidth)
          .attr("height", rowHeight)
          .attr("fill", "#ff0000")

      }

      // Time label (LEFT)
      const timeText = new Date(d.start).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
      g.append("text")
        .text(timeText)
        .attr("x", 8)
        .attr("y", rowHeight / 2 + 5)
        .attr("text-anchor", "start")
        .attr("font-size", "12px")
        .attr("fill", "#333");

      // Price label (CENTER)
      g.append("text")
        .text(`${d.price.toFixed(1)}p`)
        .attr("x", width / 2)
        .attr("y", rowHeight / 2 + 5)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "#333");
    });
  });
</script>

<div style="text-align: center;">
  <svg bind:this={svgEl}></svg>
</div>

<style>
  svg {
    display: block;
    margin: auto;
    background: #f8f8f8;
  }
</style>
