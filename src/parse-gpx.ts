import { ParsedGPX, parseGPX } from "@we-gold/gpxjs";
import { text } from "d3-fetch";

export const parseGpxFile = async (gpxFilePath: string) => {
  const gpxAsText = await text(gpxFilePath);
  const [gpx, error] = parseGPX(gpxAsText);
  if (error) throw error;
  return gpx;
};

export const gpxToGeoJSON = (gpx: ParsedGPX) => {
  const geoJsonRaw = gpx.toGeoJSON();

  if (geoJsonRaw.type !== "FeatureCollection") {
    throw new Error("Expected a FeatureCollection from GPX");
  }
  const geoJson = geoJsonRaw as GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    GeoJSON.GeoJsonProperties
  >;

  return geoJson;
};

export const getPointsFromGpx = (gpx: ParsedGPX) => {
  const points = gpx.tracks.at(0)?.points;
  if (!points || points.length === 0) {
    throw new Error("No points found in GPX track");
  }
  return {
    type: "FeatureCollection",
    //@ts-expect-error points type mismatch
    features:
      points.map(({ longitude, latitude, elevation, time }) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        properties: {
          elevation,
          time,
        },
      })) || [],
  } satisfies GeoJSON.FeatureCollection<
    GeoJSON.Point,
    { elevation: number; time: Date }
  >;
};
