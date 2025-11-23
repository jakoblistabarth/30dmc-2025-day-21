import { type Selection } from "d3-selection";

export type IconDefinition = {
  point: GeoJSON.Feature<GeoJSON.Point, { time: Date | null }> | undefined;
  label: string;
  icon: Selection<Element, undefined, null, undefined>;
};
