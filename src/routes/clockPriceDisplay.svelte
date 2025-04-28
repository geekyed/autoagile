<script lang="ts">
  import * as d3 from 'd3';

  const { displayPrices }: { displayPrices: { key: string, value: number }[] } = $props();

  const width = 800;
  const height = 600;
  const columns = 8; // 8 columns → 6 rows
  const boxWidth = width / columns;
  const boxHeight = 70; // fixed height

  const colorScale = d3.scaleSequential()
    .domain([-10, 50])
    .interpolator(d3.interpolateTurbo);

  let svgEl: SVGSVGElement;

  $effect(() => {
    if (!svgEl || displayPrices.length !== 48) return;

    const svg = d3.select(svgEl)
      .attr("width", width)
      .attr("height", boxHeight * Math.ceil(displayPrices.length / columns));

    svg.selectAll("*").remove();

    const group = svg.append("g");

    group.selectAll("g.cell")
      .data(displayPrices)
      .enter()
      .append("g")
      .attr("class", "cell")
      .attr("transform", (_, i) => {
        const x = (i % columns) * boxWidth;
        const y = Math.floor(i / columns) * boxHeight;
        return `translate(${x},${y})`;
      })
      .each(function(d) {
        const cell = d3.select(this);

        // Box rectangle
        cell.append("rect")
          .attr("width", boxWidth)
          .attr("height", boxHeight)
          .attr("fill", colorScale(d.value))
          .attr("stroke", "#fff")
          .attr("stroke-width", 1);

        // Time text (on top)
        cell.append("text")
          .text(d.key)
          .attr("x", boxWidth / 2)
          .attr("y", 18)  // 👈 move near the top
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("fill", "#000");

        // Value text (big, centered)
        cell.append("text")
          .text(`${d.value.toFixed(1)}p`)
          .attr("x", boxWidth / 2)
          .attr("y", boxHeight / 2 + 10)  // 👈 center a bit lower to leave room for the label
          .attr("text-anchor", "middle")
          .attr("font-size", "16px")
          .attr("font-weight", "bold")
          .attr("fill", "#000");
      });
  });
</script>

<svg bind:this={svgEl}></svg>

<style>
  svg {
    display: block;
    margin: auto;
    background: #f8f8f8;
  }
</style>
