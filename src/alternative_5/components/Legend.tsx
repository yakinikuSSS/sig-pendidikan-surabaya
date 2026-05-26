import type { MetricKey, MetricScale } from "../types";
import { getMetricMeta } from "../utils/metrics";

interface LegendProps {
  activeMetric: MetricKey;
  scale: MetricScale;
}

export function Legend({ activeMetric, scale }: LegendProps) {
  const meta = getMetricMeta(activeMetric);

  return (
    <section className="alt5-legend" aria-label={`Legenda ${meta.label}`}>
      <h2>{meta.label}</h2>
      <div className="alt5-legend-items">
        {scale.classes.map((item) => (
          <div className="alt5-legend-row" key={`${item.color}-${item.label}`}>
            <span className="alt5-swatch" style={{ backgroundColor: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
