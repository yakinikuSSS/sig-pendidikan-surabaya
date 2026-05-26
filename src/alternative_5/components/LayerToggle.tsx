import type { MetricKey } from "../types";
import { METRIC_OPTIONS } from "../utils/metrics";

interface LayerToggleProps {
  activeMetric: MetricKey;
  onChange: (metric: MetricKey) => void;
}

export function LayerToggle({ activeMetric, onChange }: LayerToggleProps) {
  return (
    <div className="alt5-layer-toggle" aria-label="Pilih layer peta">
      {METRIC_OPTIONS.map((metric) => (
        <button
          key={metric.key}
          className={metric.key === activeMetric ? "is-active" : ""}
          type="button"
          onClick={() => onChange(metric.key)}
        >
          {metric.label}
        </button>
      ))}
    </div>
  );
}
