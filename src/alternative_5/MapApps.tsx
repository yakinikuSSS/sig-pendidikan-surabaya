import L, { type LatLng } from "leaflet";
import { useMemo, useState } from "react";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { AnalyticsPage } from "./components/AnalyticsPage";
import { ChoroplethLayer } from "./components/ChoroplethLayer";
import { DataPage } from "./components/DataPage";
import { KecamatanPopup } from "./components/KecamatanPopup";
import { LayerToggle } from "./components/LayerToggle";
import { Legend } from "./components/Legend";
import { MapController } from "./components/MapController";
import { MethodologyPage } from "./components/MethodologyPage";
import { Sidebar } from "./components/Sidebar";
import { pendidikanData, surabayaGeoJson, umurData } from "./data";
import "./styles.css";
import type { FlyTarget, KecamatanFeature, MetricKey } from "./types";
import {
  buildMetricsByKecamatan,
  computeCityAverageBeban,
  createMetricScale,
  getMetricValue,
  normalizeKecamatanName,
  rankKecamatan,
} from "./utils/metrics";

const SURABAYA_CENTER: [number, number] = [-7.2575, 112.7521];
type AppView = "map" | "analytics" | "data" | "methodology";

function getFeatureName(feature: KecamatanFeature) {
  const rawName = feature.properties?.name ?? feature.properties?.NAME_3 ?? feature.properties?.kecamatan ?? "";
  return normalizeKecamatanName(String(rawName));
}

function boundsForFeature(feature: KecamatanFeature): [[number, number], [number, number]] {
  const bounds = L.geoJSON(feature).getBounds();
  const southWest = bounds.getSouthWest();
  const northEast = bounds.getNorthEast();
  return [
    [southWest.lat, southWest.lng],
    [northEast.lat, northEast.lng],
  ];
}

export default function MapApps() {
  const [activeView, setActiveView] = useState<AppView>("map");
  const [activeMetric, setActiveMetric] = useState<MetricKey>("pemerataan");
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [flyTarget, setFlyTarget] = useState<FlyTarget | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const metricsByName = useMemo(() => buildMetricsByKecamatan(pendidikanData, umurData), []);

  const featureByName = useMemo(() => {
    return surabayaGeoJson.features.reduce<Record<string, KecamatanFeature>>((acc, feature) => {
      acc[getFeatureName(feature)] = feature;
      return acc;
    }, {});
  }, []);

  const metricValues = useMemo(
    () => Object.values(metricsByName).map((metrics) => getMetricValue(metrics, activeMetric)),
    [activeMetric, metricsByName],
  );

  const metricScale = useMemo(
    () => createMetricScale(activeMetric, metricValues),
    [activeMetric, metricValues],
  );

  const rankings = useMemo(
    () => rankKecamatan(metricsByName, activeMetric, metricScale),
    [activeMetric, metricScale, metricsByName],
  );

  const cityAverageBeban = useMemo(() => computeCityAverageBeban(metricsByName), [metricsByName]);

  const selectedMetrics = selectedName ? metricsByName[selectedName] : null;
  const selectedRank = selectedName ? rankings.find((row) => row.name === selectedName)?.rank ?? 0 : 0;

  const openKecamatan = (name: string) => {
    const normalizedName = normalizeKecamatanName(name);
    setSelectedName(normalizedName);
  };

  const handleMapSelect = (name: string, _position: LatLng) => {
    openKecamatan(name);
  };

  const handleSidebarSelect = (name: string) => {
    const feature = featureByName[normalizeKecamatanName(name)];
    if (!feature) return;

    const bounds = boundsForFeature(feature);
    openKecamatan(name);
    setFlyTarget({
      name,
      bounds,
      requestId: Date.now(),
    });
  };

  const closePopup = () => {
    setSelectedName(null);
  };

  return (
    <div className="alt5-app">
      <header className="alt5-header">
        <div className="alt5-header-brand">
          <h1>Peta Pendidikan Surabaya</h1>
        </div>

        <nav className="alt5-top-nav" aria-label="Navigasi halaman">
          <button
            className={activeView === "map" ? "is-active" : ""}
            type="button"
            onClick={() => setActiveView("map")}
          >
            Peta
          </button>
          <button
            className={activeView === "analytics" ? "is-active" : ""}
            type="button"
            onClick={() => {
              setActiveView("analytics");
              setSelectedName(null);
            }}
          >
            Analitik
          </button>
          <button
            className={activeView === "data" ? "is-active" : ""}
            type="button"
            onClick={() => {
              setActiveView("data");
              setSelectedName(null);
            }}
          >
            Data
          </button>
          <button
            className={activeView === "methodology" ? "is-active" : ""}
            type="button"
            onClick={() => {
              setActiveView("methodology");
              setSelectedName(null);
            }}
          >
            Metodologi
          </button>
        </nav>
      </header>

      {activeView === "analytics" ? (
        <AnalyticsPage metricsByName={metricsByName} cityAverageBeban={cityAverageBeban} />
      ) : activeView === "data" ? (
        <DataPage metricsByName={metricsByName} />
      ) : activeView === "methodology" ? (
        <MethodologyPage />
      ) : (
      <main className={`alt5-map-shell ${selectedMetrics ? "has-detail" : ""}`}>
        <MapContainer
          center={SURABAYA_CENTER}
          zoom={12}
          minZoom={5}
          maxZoom={16}
          scrollWheelZoom
          zoomControl={false}
          className="alt5-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          <ChoroplethLayer
            activeMetric={activeMetric}
            geoData={surabayaGeoJson}
            metricsByName={metricsByName}
            onSelect={handleMapSelect}
            scale={metricScale}
            selectedName={selectedName}
          />

          <MapController flyTarget={flyTarget} />
          <ZoomControl position="bottomright" />
        </MapContainer>

        <LayerToggle activeMetric={activeMetric} onChange={setActiveMetric} />
        <Legend activeMetric={activeMetric} scale={metricScale} />
        {selectedMetrics && (
          <div className="alt5-detail-panel" aria-live="polite">
            <KecamatanPopup
              activeMetric={activeMetric}
              cityAverageBeban={cityAverageBeban}
              metrics={selectedMetrics}
              onClose={closePopup}
              rank={selectedRank}
              totalRanked={rankings.length}
            />
          </div>
        )}
        <Sidebar
          activeMetric={activeMetric}
          onMetricChange={setActiveMetric}
          onSelectKecamatan={handleSidebarSelect}
          onToggle={() => setSidebarOpen((value) => !value)}
          open={sidebarOpen}
          rankings={rankings}
          selectedName={selectedName}
        />
      </main>
      )}
    </div>
  );
}
