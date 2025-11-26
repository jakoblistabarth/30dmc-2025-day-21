import { create } from "d3-selection";

export const s = 30;

export const sunIcon = () => {
  const icon = create("svg:g");
  const rays = icon.append("g");
  const radius = s / 4.5;
  const raysArr = Array.from({ length: 10 }).map((_, i) => i);
  rays
    .selectAll("line")
    .data(raysArr)
    .enter()
    .append("line")
    .attr("transform", (d) => `rotate(${(d * 360) / raysArr.length})`)
    .attr("y1", -s / 2 + 4)
    .attr("y2", -radius - 2)
    .attr("stroke", "var(--color-primary)");
  icon
    .append("circle")
    .attr("r", radius)
    .attr("stroke", "var(--color-primary)")
    .attr("fill", "var(--color-background)");
  return icon;
};

export const pragerZeileIcon = () => {
  const icon = create("svg:g");
  icon
    .append("path")
    .attr(
      "d",
      `m ${-s / 2} ${s * 0.3} l ${s * 0.3} ${0} l 0 ${-s * 0.6} l ${
        s * 0.4
      } ${0} l 0 ${s * 0.6} l ${s * 0.3} 0`
    )
    .attr("stroke", "var(--color-primary)")
    .attr("fill", "none");
  return icon;
};

export const trafficLightsIcon = () => {
  const icon = create("svg:g");
  icon
    .selectAll("circle")
    .data(Array.from({ length: 3 }).map((_, i, arr) => i - (arr.length - 2)))
    .enter()
    .append("circle")
    .attr("cy", (d) => (d * s) / 4)
    .attr("r", s / 12)
    .attr("stroke", "var(--color-primary)")
    .attr("fill", "var(--color-background)");
  return icon;
};

export const stadiumIcon = () => {
  const icon = create("svg:g");
  icon
    .append("g")
    .append("rect")
    .attr("x", -s * 0.25)
    .attr("width", s * 0.5)
    .attr("height", s * 0.2)
    .attr("stroke", "var(--color-primary)")
    .attr("fill", "var(--color-background)");
  icon
    .append("path")
    .attr(
      "d",
      `M ${-s * 0.25} 0 L ${-s * 0.4} ${-s * 0.1} Q ${-s * 0.3} ${-s * 0.2} ${
        -s * 0.2
      } ${-s * 0.2} l ${s * 0.4} 0 Q ${s * 0.3} ${-s * 0.2} ${s * 0.4} ${
        -s * 0.1
      } L ${s * 0.25} 0 Z`
    )
    .attr("stroke", "var(--color-primary)")
    .attr("fill", "var(--color-background)")
    .attr("stroke", "var(--color-primary)");
  return icon;
};

export const flowerIcon = () => {
  const icon = create("svg:g");
  const pedals = icon.append("g");
  const pedalsArr = Array.from({ length: 5 }).map((_, i) => i);
  pedals
    .selectAll("rect")
    .data(pedalsArr)
    .enter()
    .append("rect")
    .attr("width", s * 0.2)
    .attr("height", s * 0.8)
    .attr("rx", s * 0.1)
    .attr("x", (-s * 0.2) / 2)
    .attr("y", (-s * 0.8) / 2)
    .attr("transform", (d) => `rotate(${(d * 360) / 2 / pedalsArr.length})`)
    .attr("stroke", "var(--color-primary)")
    .attr("fill", "var(--color-background)");
  icon
    .append("circle")
    .attr("r", s * 0.225)
    .attr("stroke", "var(--color-primary)")
    .attr("fill", "var(--color-background)");
  return icon;
};

export const crocusIcon = () => {
  const icon = create("svg:g");
  const pedals = icon.append("g");
  const pedalsArr = [0, -1, 1];
  const margin = s * 0.1;
  const pedalHeight = s * 0.7 - margin;
  icon
    .append("line")
    .attr("y1", -s / 2 + pedalHeight + margin)
    .attr("y2", s / 2 - margin)
    .attr("fill", "none")
    .attr("stroke", "var(--color-primary)");
  pedals
    .append("g")
    .attr("transform", `translate(0, 4)`)
    .selectAll("path")
    .data(pedalsArr)
    .enter()
    .append("path")
    .attr(
      "d",
      `M 0 ${margin} 
      c ${-pedalHeight * 0.2} ${-pedalHeight * 0.3} ${-pedalHeight * 0.2} ${
        -pedalHeight * 0.7
      } 0 ${-pedalHeight}
      c ${pedalHeight * 0.2} ${pedalHeight * 0.3} ${pedalHeight * 0.2} ${
        pedalHeight * 0.7
      }
       0 ${pedalHeight} Z`
    )
    .attr("transform", (d) => `rotate(${d * 40})`)
    .attr("stroke", "var(--color-primary)")
    .attr("fill", "var(--color-background)")
    .attr("stroke-linejoin", "round");
  icon
    .append("circle")
    .attr("cy", pedalHeight / 3)
    .attr("r", s * 0.066)
    .attr("fill", "var(--color-background)")
    .attr("stroke", "var(--color-primary)");
  return icon;
};

export const icons = {
  crocusIcon,
  flowerIcon,
  pragerZeileIcon,
  stadiumIcon,
  sunIcon,
  trafficLightsIcon,
};
