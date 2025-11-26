import "d3-transition";
import { easeLinear } from "d3-ease";
import { type Selection } from "d3-selection";
import { type GeoProjection } from "d3-geo";
import { bisectLeft } from "d3-array";

export type AnimateController = {
  start: () => void;
  stop: () => void;
  getCurrentTime: () => number;
};

export const animateMarker = (
  marker: Selection<SVGGElement, undefined, null, any>,
  points: GeoJSON.Feature<GeoJSON.Point, { time: Date | null }>[],
  path: Selection<SVGPathElement, undefined, null, undefined>,
  projection: GeoProjection,
  animationLength = 50000,
  onTick?: (timeMs: number, t: number, pos: [number, number]) => void
): AnimateController => {
  const times = points.map((d) => d.properties.time);
  const startTime = times.at(0)?.getTime() ?? 0;
  const endTime = times.at(-1)?.getTime() ?? startTime;
  const duration = Math.max(1, endTime - startTime);

  const projected = points.map((p) => {
    const coords = p.geometry.coordinates as [number, number];
    const pos = projection(coords);
    return pos ? [pos[0] ?? 0, pos[1] ?? 0] : [0, 0];
  });

  const [startX = 0, startY = 0] = projected[0] ?? [0, 0];
  marker.attr("transform", `translate(${startX}, ${startY})`);

  let currentTimeMs = startTime;
  let running = false;
  let loopTimer: number | undefined;

  const run = () => {
    running = true;
    // Ensure previous transition is cleared
    try {
      // d3-transition adds .interrupt
      (path as any).interrupt();
    } catch {}

    path
      .transition()
      .duration(animationLength)
      .ease(easeLinear)
      .tween("move", () => (t: number) => {
        const currentTime = startTime + t * duration;
        currentTimeMs = currentTime;

        const idx = bisectLeft(
          times.map((d) => d?.getTime() ?? 0),
          currentTime
        );

        let x = 0,
          y = 0;
        if (idx <= 0) {
          [x, y] = projected[0] ?? [0, 0];
        } else if (idx >= times.length) {
          [x, y] = projected[projected.length - 1] ?? [0, 0];
        } else {
          const t0 = times[idx - 1]?.getTime();
          const t1 = times[idx]?.getTime();
          const frac = (currentTime - (t0 ?? 0)) / ((t1 ?? 0) - (t0 ?? 0) || 1);
          const [x0 = 0, y0 = 0] = projected[idx - 1];
          const [x1 = 0, y1 = 0] = projected[idx];
          x = x0 + (x1 - x0) * frac;
          y = y0 + (y1 - y0) * frac;
        }

        marker.attr("transform", `translate(${x}, ${y})`);
        if (onTick) onTick(currentTimeMs, t, [x, y]);
      })
      .on("end", function () {
        if (!running) return;
        marker.attr("transform", `translate(${startX}, ${startY})`);
        loopTimer = window.setTimeout(() => {
          if (running) run();
        }, 500);
      });
  };

  const start = () => {
    if (!running) run();
  };

  const stop = () => {
    running = false;
    try {
      (path as any).interrupt();
    } catch {}
    if (loopTimer) {
      clearTimeout(loopTimer);
      loopTimer = undefined;
    }
  };

  // auto-start
  run();

  return {
    start,
    stop,
    getCurrentTime: () => currentTimeMs,
  };
};
