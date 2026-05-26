import L, { type LatLng } from "leaflet";
import { GeoJSON } from "react-leaflet";
import type { KecamatanFeature, KecamatanFeatureCollection, KecamatanMetrics, MetricKey, MetricScale } from "../types";
import {
  formatMetricValue,
  getColorForMetric,
  getMetricMeta,
  getMetricValue,
  normalizeKecamatanName,
} from "../utils/metrics";

interface ChoroplethLayerProps {
  geoData: KecamatanFeatureCollection;
  activeMetric: MetricKey;
  metricsByName: Record<string, KecamatanMetrics>;
  scale: MetricScale;
  selectedName: string | null;
  onSelect: (name: string, position: LatLng) => void;
}

function featureName(feature: KecamatanFeature) {
  const rawName = feature.properties?.name ?? feature.properties?.NAME_3 ?? feature.properties?.kecamatan ?? "";
  return normalizeKecamatanName(String(rawName));
}

export function ChoroplethLayer({
  geoData,
  activeMetric,
  metricsByName,
  scale,
  selectedName,
  onSelect,
}: ChoroplethLayerProps) {
  const meta = getMetricMeta(activeMetric);

  const featureStyle = (feature?: KecamatanFeature): L.PathOptions => {
    const name = feature ? featureName(feature) : "";
    const metrics = metricsByName[name];
    const value = metrics ? getMetricValue(metrics, activeMetric) : 0;
    const isSelected = selectedName === name;

    return {
      color: isSelected ? "#0f172a" : "#ffffff",
      fillColor: metrics ? getColorForMetric(value, scale) : "#e5e7eb",
      fillOpacity: isSelected ? 0.9 : 0.78,
      opacity: 1,
      weight: isSelected ? 3 : 1.2,
    };
  };

  const onEachFeature = (feature: KecamatanFeature, layer: L.Layer) => {
    const name = featureName(feature);
    const metrics = metricsByName[name];
    const value = metrics ? getMetricValue(metrics, activeMetric) : 0;
    const pathLayer = layer as L.Path;

    pathLayer.bindTooltip(
      `<strong>${name}</strong><br>${meta.shortLabel}: ${formatMetricValue(value, activeMetric)}`,
      {
        direction: "top",
        opacity: 0.95,
        sticky: true,
      },
    );

    pathLayer.on({
      mouseover: () => {
        pathLayer.setStyle({
          color: "#0f172a",
          fillOpacity: 0.92,
          weight: 2.6,
        });
        pathLayer.bringToFront();
      },
      mouseout: () => {
        pathLayer.setStyle(featureStyle(feature));
      },
      click: (event: L.LeafletMouseEvent) => {
        onSelect(name, event.latlng);
      },
    });
  };

  return (
    <GeoJSON
      key={`${activeMetric}-${selectedName ?? "none"}`}
      data={geoData}
      onEachFeature={onEachFeature}
      style={(feature) => featureStyle(feature as KecamatanFeature)}
    />
  );
}
