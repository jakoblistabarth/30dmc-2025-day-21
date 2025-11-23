import type { BaseType, Selection } from "d3-selection";

export const updateDate = (
  node: Selection<BaseType, unknown, HTMLElement, undefined>,
  time: Date
) => {
  const timeString = time.toLocaleTimeString();
  const dateString = time.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  node.html(`
  ${dateString} · ${timeString}`);
};
