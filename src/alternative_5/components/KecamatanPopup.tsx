import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { KecamatanMetrics, MetricKey } from "../types";
import { formatNumber } from "../utils/metrics";

interface KecamatanPopupProps {
  metrics: KecamatanMetrics;
  rank: number;
  totalRanked: number;
  cityAverageBeban: number;
  activeMetric: MetricKey;
  onClose: () => void;
}

const coverageColors = ["#14b8a6", "#22c55e", "#0f766e"];

function bebanStatus(value: number) {
  if (value < 17) return { label: "Ringan", className: "is-green" };
  if (value <= 20) return { label: "Sedang", className: "is-yellow" };
  return { label: "Berat", className: "is-red" };
}

function metricRankLabel(metric: MetricKey) {
  if (metric === "bebanKerja") return "beban guru";
  if (metric === "rasioSekolah") return "rasio sekolah";
  return "pemerataan";
}

export function KecamatanPopup({
  metrics,
  rank,
  totalRanked,
  cityAverageBeban,
  activeMetric,
  onClose,
}: KecamatanPopupProps) {
  const status = bebanStatus(metrics.beban_kerja);
  const maxCoverage = Math.max(...metrics.coverage.map((item) => item.ratio));
  const coverageDomainMax = Math.ceil(maxCoverage * 1.15);
  const maxBeban = Math.max(24, metrics.beban_kerja, cityAverageBeban) * 1.12;
  const bebanPercent = Math.min(100, (metrics.beban_kerja / maxBeban) * 100);
  const cityAveragePercent = Math.min(100, (cityAverageBeban / maxBeban) * 100);

  return (
    <article className="alt5-popup">
      <button className="alt5-popup-close" type="button" onClick={onClose} aria-label="Tutup popup">
        X
      </button>

      <header className="alt5-popup-header">
        <div>
          <span className="alt5-popup-kicker">Kecamatan</span>
          <h2>{metrics.name}</h2>
        </div>
        <span className="alt5-rank-badge">
          #{rank} dari {totalRanked}
          <small>{metricRankLabel(activeMetric)}</small>
        </span>
      </header>

      <section className="alt5-popup-section">
        <h3>Ketersediaan Sekolah (per 1rb Anak)</h3>
        <div className="alt5-chart-wrap">
          <ResponsiveContainer width="100%" height={126}>
            <BarChart
              data={metrics.coverage}
              layout="vertical"
              margin={{ top: 4, right: 58, bottom: 4, left: 6 }}
            >
              <CartesianGrid horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, coverageDomainMax]} hide />
              <YAxis type="category" dataKey="jenjang" axisLine={false} tickLine={false} width={46} />
              <Tooltip formatter={(value) => [`${formatNumber(Number(value), 2)}`, "Sekolah / 1rb anak"]} />
              <Bar dataKey="ratio" radius={[0, 5, 5, 0]} barSize={18}>
                {metrics.coverage.map((item, index) => (
                  <Cell key={item.jenjang} fill={coverageColors[index]} />
                ))}
                <LabelList
                  dataKey="ratio"
                  position="right"
                  formatter={(value) => `${formatNumber(Number(value || 0), 2)}`}
                  className="alt5-chart-label"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="alt5-popup-section">
        <h3>Data Sekolah & Guru</h3>
        <div className="alt5-stat-grid">
          <div>
            <span>Total Sekolah</span>
            <strong>{formatNumber(metrics.pendidikan["Total Sekolah"])}</strong>
          </div>
          <div>
            <span>Total Siswa</span>
            <strong>{formatNumber(metrics.pendidikan["Total Siswa"])}</strong>
          </div>
          <div>
            <span>Total Guru</span>
            <strong>{formatNumber(metrics.pendidikan["Total Guru"])}</strong>
          </div>
        </div>

        <table className="alt5-breakdown-table">
          <thead>
            <tr>
              <th>Jenjang</th>
              <th>Sekolah</th>
              <th>Siswa</th>
              <th>Guru</th>
            </tr>
          </thead>
          <tbody>
            {metrics.coverage.map((row) => (
              <tr key={row.jenjang}>
                <td>{row.jenjang}</td>
                <td>{formatNumber(row.sekolah)}</td>
                <td>{formatNumber(row.siswa)}</td>
                <td>{formatNumber(row.guru)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="alt5-popup-section">
        <div className="alt5-beban-heading">
          <h3>Beban Kerja Guru</h3>
          <span className={`alt5-status-badge ${status.className}`}>{status.label}</span>
        </div>

        <div className="alt5-beban-number">
          {formatNumber(metrics.beban_kerja, 1)}
          <span>siswa/guru</span>
        </div>

        <div className="alt5-average-bar" aria-label="Perbandingan beban guru dengan rata-rata kota">
          <div className="alt5-average-track">
            <span className="alt5-average-fill" style={{ width: `${bebanPercent}%` }} />
            <span className="alt5-average-marker" style={{ left: `${cityAveragePercent}%` }} />
          </div>
          <div className="alt5-average-labels">
            <span>Kecamatan</span>
            <span>Rata-rata kota: {formatNumber(cityAverageBeban, 1)}</span>
          </div>
        </div>
      </section>
    </article>
  );
}
