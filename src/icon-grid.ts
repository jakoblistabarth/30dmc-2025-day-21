import "./style.css";
import { select } from "d3-selection";
import { icons, s } from "./icons";
import { range } from "d3-array";

const app = select("#app");

app.html(`
    <h1>Icons</h1>
    <div id="icon-grid"></div>
`);

const iconGrid = app.select<HTMLDivElement>("#icon-grid");

const iconCell = iconGrid
  .selectAll("div")
  .data(Object.entries(icons))
  .enter()
  .append("div");

const svg = iconCell
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("viewBox", "-20 -20 40 40");

iconCell
  .append("div")
  .style("text-align", "center")
  .style("margin-top", "0.5em")
  .text(([name, _]) => name);

const offset = 1;
const gridSize = s * (4 / 3);
svg
  .append("rect")
  .attr("x", -gridSize / 2 + offset / 2)
  .attr("y", -gridSize / 2 + offset / 2)
  .attr("rx", 2)
  .attr("width", gridSize - offset * 2)
  .attr("height", gridSize - offset * 2)
  .attr("fill", "none")
  .attr("stroke", "var(--color-secondary)")
  .attr("stroke-width", 0.25);

svg.append(([_, icon]) => icon().node());

const gridData = range(s).flatMap((x) => range(s).map((y) => ({ x, y })));

const grid = svg
  .append("g")
  .attr("id", "icon-grid")
  .attr(
    "transform",
    `translate(${-s / 2 + offset / 2}, ${-s / 2 + offset / 2})`
  );

grid
  .selectAll("circle")
  .data(gridData)
  .enter()
  .append("circle")
  .attr("r", 0.125)
  .attr("cx", (d) => d.x)
  .attr("cy", (d) => d.y)
  .attr("fill", "var(--color-primary)");
