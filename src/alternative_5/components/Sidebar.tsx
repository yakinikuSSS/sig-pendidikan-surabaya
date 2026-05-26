import type { MetricKey, RankedKecamatan } from "../types";
import { formatMetricValue, METRIC_OPTIONS } from "../utils/metrics";

interface SidebarProps {
  activeMetric: MetricKey;
  rankings: RankedKecamatan[];
  open: boolean;
  onMetricChange: (metric: MetricKey) => void;
  onToggle: () => void;
  onSelectKecamatan: (name: string) => void;
  selectedName: string | null;
}

export function Sidebar({
  activeMetric,
  rankings,
  open,
  onMetricChange,
  onToggle,
  onSelectKecamatan,
  selectedName,
}: SidebarProps) {
  return (
    <aside className={`alt5-sidebar ${open ? "is-open" : "is-closed"}`}>
      <button className="alt5-sidebar-toggle" type="button" onClick={onToggle} aria-label="Toggle ranking">
        <span />
        <span />
        <span />
      </button>

      <div className="alt5-sidebar-panel">
        <header className="alt5-sidebar-header">
          <span>Analisis Kecamatan</span>
          <h2>Ranking Kecamatan</h2>
        </header>

        <label className="alt5-select-label" htmlFor="alt5-ranking-metric">
          Metrik
        </label>
        <select
          id="alt5-ranking-metric"
          value={activeMetric}
          onChange={(event) => onMetricChange(event.target.value as MetricKey)}
        >
          {METRIC_OPTIONS.map((metric) => (
            <option key={metric.key} value={metric.key}>
              {metric.label}
            </option>
          ))}
        </select>

        <div className="alt5-ranking-list">
          {rankings.map((row) => (
            <button
              className={`alt5-ranking-row ${selectedName === row.name ? "is-selected" : ""}`}
              key={row.name}
              type="button"
              aria-current={selectedName === row.name ? "true" : undefined}
              onClick={() => onSelectKecamatan(row.name)}
            >
              <span className="alt5-ranking-number">{row.rank}</span>
              <span className="alt5-ranking-main">
                <span className="alt5-ranking-name">{row.name}</span>
                <span className="alt5-ranking-bar">
                  <span
                    style={{
                      backgroundColor: row.color,
                      width: `${row.barPercent}%`,
                    }}
                  />
                </span>
              </span>
              <span className="alt5-ranking-value">{formatMetricValue(row.value, activeMetric)}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
