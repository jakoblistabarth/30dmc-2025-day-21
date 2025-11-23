import { type Selection } from "d3-selection";
import type { IconDefinition } from "./types/icon-definition";

export const updateBackgroundIcon = (
  node: Selection<HTMLDivElement, unknown, HTMLElement, any>,
  time: Date,
  icons: IconDefinition[]
) => {
  const icon = getIcon(time, icons);
  if (icon?.icon?.node()) {
    node.html(`
        <svg width="100%" viewBox="0 0 40 40" height="100%"><g transform="translate(20 20)">${
          icon.icon.node()?.outerHTML
        }</g></svg>
        <div>
            <div>
                ${icon.label}
            </div>
            <div>
                ${icon.point?.properties.time?.toLocaleTimeString() || ""}
            </div>
        </div>`);
  } else {
    node.html("");
  }
};

const getIcon = (time: Date, icons: IconDefinition[]) => {
  return icons
    .map((d) => {
      const diff = Math.abs(
        time.getTime() - (d.point?.properties.time?.getTime() || 0)
      );
      return { ...d, diff };
    })
    .sort((a, b) => a.diff - b.diff)
    .filter((d) => d.diff < 2 * 60 * 1000)
    .at(0)!;
};
