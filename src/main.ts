import "./style.css";
import { getPointsFromGpx, gpxToGeoJSON, parseGpxFile } from "./parse-gpx";
import { geoPath, geoTransverseMercator } from "d3-geo";
import { create, select } from "d3-selection";
import {
  crocusIcon,
  flowerIcon,
  pragerZeileIcon,
  stadiumIcon,
  sunIcon,
  trafficLightsIcon,
} from "./icons";
import { animateMarker } from "./animateMarker";
import ngcLogo from "/src/svgs/ngc-rgb-logomark-black.svg?raw";
import type { IconDefinition } from "./types/icon-definition";
import { updateDate } from "./update-date";
import { updateBackgroundIcon } from "./draw-backgroundicon";

const app = select("#app");
app.html(`
  <figure id="map">
    <div id="background-icon"></div>
    <h1>
      Morning run moments
      </br>
      <span id="subline"></span>
    </h1>
    <figcaption>
      <div>
        #30DayMapChallenge · Day 21 
      </div>
      <div>
        Jakob Listabarth
      </div>
      <a href="https://next-generation-cartographers.github.io/">
        ${ngcLogo}
      </a>
    </figcaption>
  </figure> 
`);

const gpx = await parseGpxFile("activity-cropped.gpx");
const geoJson = gpxToGeoJSON(gpx);
const points = getPointsFromGpx(gpx);

const mapContainer = select<HTMLElement, null>("#map");
const [mapWidth, mapHeight] = [
  mapContainer.node()!.clientWidth,
  mapContainer.node()!.clientHeight,
];

const svg = create("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .style("grid-area", "1 / 1 / -1 / -1");

const margin = 40;
const projection = geoTransverseMercator().fitExtent(
  [
    [margin, margin],
    [mapWidth - margin, mapHeight - margin],
  ],
  geoJson
);
const path = geoPath(projection);

const icons: IconDefinition[] = [
  {
    point: points.features.at(26),
    label: "Prager Zeile",
    icon: pragerZeileIcon(),
  },
  {
    point: points.features.at(48),
    label: "Trafficlights",
    icon: trafficLightsIcon(),
  },
  {
    point: points.features.at(100),
    label: "Stadium",
    icon: stadiumIcon(),
  },
  {
    point: points.features.at(125),
    label: "Sunrise between the trees",
    icon: sunIcon(),
  },
  {
    point: points.features.at(160),
    label: "Flowerbeds",
    icon: flowerIcon(),
  },
  {
    point: points.features.at(170),
    label: "Crocusfield",
    icon: crocusIcon(),
  },
];

const trackLayer = svg
  .append("path")
  .attr("d", path(geoJson))
  .attr("pathLength", 100)
  .attr("fill", "none")
  .attr("stroke", "var(--color-secondary)")
  .attr("mix-blend-mode", "multiply");

const marker = svg.append("g").attr("id", "marker").attr("opacity", 1);
marker
  .append("circle")
  .attr("r", 3)
  .attr("fill", "var(--color-primary)")
  .attr("stroke", "var(--color-background")
  .attr("paint-order", "stroke fill")
  .attr("stroke-width", 4);
marker
  .append("circle")
  .attr("r", 12)
  .attr("fill", "var(--color-primary)")
  .attr("opacity", 0.1)
  .attr("mix-blend-mode", "multiply");

const subline = app.select("#subline");
console.log(subline);

animateMarker(
  marker,
  points.features,
  trackLayer,
  projection,
  20000,
  (timeMs, t) => {
    const date = new Date(timeMs);
    updateDate(subline, date);
    updateBackgroundIcon(app.select("#background-icon"), date, icons);
    document.documentElement.style.setProperty(
      "--animation-progess",
      t.toString()
    );
  }
);

const pointsLayer = svg.append("g").attr("id", "points-layer");

const iconGroup = pointsLayer
  .selectAll("g")
  .data(icons)
  .enter()
  .append("g")
  .attr("class", "icon-group")
  .attr("transform", (d) => {
    const [x, y] = projection(
      //@ts-expect-error type Position to broad
      d.point ? d.point.geometry.coordinates : [0, 0]
    ) || [0, 0];
    return `translate(${x}, ${y})`;
  });

iconGroup
  .append("circle")
  .attr("r", 1)
  .attr("stroke", "var(--color-primary)")
  .attr("fill", "var(--color-background)");

iconGroup
  .append("line")
  .attr("y1", -2)
  .attr("y2", -20)
  .attr("stroke", "var(--color-primary)");

const iconArea = iconGroup.append("g").attr("transform", "translate(0, -40)");

iconArea
  .append("rect")
  .attr("x", -15)
  .attr("y", -15)
  .attr("width", 30)
  .attr("height", 30)
  .attr("rx", 4)
  .attr("ry", 4)
  .attr("fill", "var(--color-background)")
  .attr("stroke", "var(--color-secondary)");

iconArea.append((d) => {
  return d.icon.node();
});

mapContainer.append(() => svg.node());
