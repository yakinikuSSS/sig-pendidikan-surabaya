import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend as RechartsLegend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { KecamatanMetrics } from "../types";
import { formatNumber } from "../utils/metrics";

interface AnalyticsPageProps {
  metricsByName: Record<string, KecamatanMetrics>;
  cityAverageBeban: number;
}

const chartColors = {
  teal: "#14b8a6",
  green: "#22c55e",
  blue: "#2563eb",
  amber: "#f59e0b",
  red: "#ef4444",
  slate: "#334155",
  orange: "#f97316",
};

function percent(numerator: number, denominator: number) {
  return denominator > 0 ? (numerator / denominator) * 100 : 0;
}

function shortName(name: string) {
  return name; // Tampilkan nama lengkap
}

export function AnalyticsPage({ metricsByName, cityAverageBeban }: AnalyticsPageProps) {
  const rows = Object.values(metricsByName);

  const summary = rows.reduce(
    (acc, row) => {
      acc.totalSekolah += row.pendidikan["Total Sekolah"];
      acc.totalSiswa += row.pendidikan["Total Siswa"];
      acc.totalGuru += row.pendidikan["Total Guru"];
      acc.totalUsia += row.umur.Total;
      acc.sdSiswa += row.pendidikan["Jumlah Siswa SD"];
      acc.smpSiswa += row.pendidikan["Jumlah Siswa SMP"];
      acc.smaSiswa += row.pendidikan["Jumlah Siswa SMA"];
      acc.sdUsia += row.umur.SD;
      acc.smpUsia += row.umur.SMP;
      acc.smaUsia += row.umur.SMA;
      return acc;
    },
    {
      totalSekolah: 0,
      totalSiswa: 0,
      totalGuru: 0,
      totalUsia: 0,
      sdSiswa: 0,
      smpSiswa: 0,
      smaSiswa: 0,
      sdUsia: 0,
      smpUsia: 0,
      smaUsia: 0,
    },
  );

  const cityCoverage = (summary.totalUsia > 0 ? (summary.totalSekolah / summary.totalUsia) * 1000 : 0);
  const citySchoolRatio = cityCoverage;

  const levelCoverage = [
    {
      jenjang: "SD",
      siswa: summary.sdSiswa,
      usia: summary.sdUsia,
      coverage: percent(summary.sdSiswa, summary.sdUsia),
      ketersediaan: (summary.sdUsia > 0 ? (summary.totalSekolah / summary.totalUsia) * 1000 : 0),
    },
    {
      jenjang: "SMP",
      siswa: summary.smpSiswa,
      usia: summary.smpUsia,
      coverage: percent(summary.smpSiswa, summary.smpUsia),
      ketersediaan: (summary.smpUsia > 0 ? (summary.totalSekolah / summary.totalUsia) * 1000 : 0),
    },
    {
      jenjang: "SMA",
      siswa: summary.smaSiswa,
      usia: summary.smaUsia,
      coverage: percent(summary.smaSiswa, summary.smaUsia),
      ketersediaan: (summary.smaUsia > 0 ? (summary.totalSekolah / summary.totalUsia) * 1000 : 0),
    },
  ];

  const rankedCoverage = rows
    .map((row) => ({ name: row.name, label: shortName(row.name), coverage: row.ratio_total }))
    .sort((a, b) => b.coverage - a.coverage);

  const topCoverage = rankedCoverage.slice(0, 10);
  const lowCoverage = rankedCoverage.slice(-10).reverse();

  const workloadRows = rows
    .map((row) => ({ name: row.name, label: shortName(row.name), beban: row.beban_kerja }))
    .sort((a, b) => b.beban - a.beban)
    .slice(0, 10);

  const schoolRatioRows = rows
    .map((row) => ({ name: row.name, label: shortName(row.name), rasio: row.sekolah_ratio }))
    .sort((a, b) => b.rasio - a.rasio)
    .slice(0, 10);

  const [levelFilter, setLevelFilter] = useState<"all" | "SD" | "SMP" | "SMA">("all");

  const demandCapacityRows = rows.map((row) => {
    if (levelFilter === "all") {
      return {
        name: row.name,
        siswa: row.pendidikan["Total Siswa"],
        sekolah: row.pendidikan["Total Sekolah"],
        guru: row.pendidikan["Total Guru"],
        beban: row.beban_kerja,
      };
    }
    
    // Per-level metrics calculation
    const siswa = row.pendidikan[`Jumlah Siswa ${levelFilter}` as keyof typeof row.pendidikan] as number;
    const sekolah = row.pendidikan[`Jumlah Sekolah ${levelFilter}` as keyof typeof row.pendidikan] as number;
    const guru = row.pendidikan[`Jumlah Guru ${levelFilter}` as keyof typeof row.pendidikan] as number;
    const beban = guru > 0 ? siswa / guru : 0;

    return {
      name: row.name,
      siswa,
      sekolah,
      guru,
      beban,
    };
  });

  const scatterAvgSiswa = demandCapacityRows.reduce((sum, r) => sum + r.siswa, 0) / demandCapacityRows.length;
  const scatterAvgSekolah = demandCapacityRows.reduce((sum, r) => sum + r.sekolah, 0) / demandCapacityRows.length;

  const kpis = [
    { label: "Total Sekolah", value: formatNumber(summary.totalSekolah), helper: "unit" },
    { label: "Total Siswa", value: formatNumber(summary.totalSiswa), helper: "jiwa" },
    { label: "Total Guru", value: formatNumber(summary.totalGuru), helper: "jiwa" },
    { label: "Pemerataan", value: formatNumber(cityCoverage, 2), helper: "sk/1rb" },
    { label: "Beban Guru", value: formatNumber(cityAverageBeban, 1), helper: "s/g" },
    { label: "Rasio Sekolah", value: formatNumber(citySchoolRatio, 2), helper: "sk/1rb" },
  ];

  const criticalBeban = workloadRows.filter(r => r.beban > cityAverageBeban * 1.15).length;
  const lowCoverageAreas = rows.filter(r => r.ratio_total < cityCoverage * 0.8).length;

  return (
    <main className="alt5-analytics">
      <section className="alt5-analytics-hero">
        <div>
          <span>Dashboard Analitik</span>
          <h2>Analisis Kapasitas, Pemerataan, dan Beban Layanan Pendidikan</h2>
        </div>
      </section>

      <section className="alt5-kpi-grid">
        {kpis.map((item) => (
          <article className="alt5-kpi-card" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.helper}</small>
          </article>
        ))}
      </section>

      <section className="alt5-insights">
        <article className="alt5-insight-card" style={{ borderLeftColor: chartColors.red }}>
          <span>Temuan Penting</span>
          <h3>Beban Guru Kritis</h3>
          <p>Terdapat <strong>{criticalBeban} kecamatan</strong> dengan rasio siswa per guru di atas 15% dari rata-rata kota ({formatNumber(cityAverageBeban, 1)}).</p>
        </article>
        <article className="alt5-insight-card" style={{ borderLeftColor: chartColors.amber }}>
          <span>Pemerataan Layanan</span>
          <h3>Kesenjangan Coverage</h3>
          <p>Terdapat <strong>{lowCoverageAreas} kecamatan</strong> dengan tingkat pemerataan di bawah 80% rata-rata kota.</p>
        </article>
      </section>

      <section className="alt5-analytics-grid">
        <article className="alt5-chart-card alt5-chart-card-wide">
          <header>
            <span>Coverage Jenjang</span>
            <h3>Kapasitas Siswa dibanding Populasi Usia per Jenjang</h3>
          </header>
          <div className="alt5-chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={levelCoverage} margin={{ top: 20, right: 30, bottom: 0, left: 10 }}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="jenjang" tickLine={false} axisLine={false} />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(value) => formatNumber(value / 1000)}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => `${value}%`}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "Coverage (%)") return [`${formatNumber(Number(value), 1)}%`, name];
                    return [formatNumber(Number(value)), name];
                  }}
                />
                <RechartsLegend verticalAlign="top" height={36}/>
                <Bar yAxisId="left" dataKey="usia" name="Penduduk Usia" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
                <Bar yAxisId="left" dataKey="siswa" name="Siswa Terdaftar" fill={chartColors.teal} radius={[6, 6, 0, 0]} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="coverage"
                  name="Coverage (%)"
                  stroke={chartColors.orange}
                  strokeWidth={3}
                  dot={{ r: 6, fill: chartColors.orange, strokeWidth: 2, stroke: "#fff" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="alt5-chart-card">
          <header>
            <span>Top Ketersediaan</span>
            <h3>10 Kecamatan: Rasio Sekolah Tertinggi</h3>
          </header>
          <div className="alt5-chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCoverage} layout="vertical" margin={{ top: 20, right: 60, bottom: 0, left: 110 }}>
                <CartesianGrid stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="label" tickLine={false} axisLine={false} width={100} fontSize={10} />
                <Tooltip formatter={(value) => [`${formatNumber(Number(value), 2)}`, "Sekolah / 1rb anak"]} />
                <ReferenceLine
                  x={cityCoverage}
                  stroke={chartColors.slate}
                  strokeDasharray="4 4"
                  label={{ 
                    value: `Avg: ${formatNumber(cityCoverage, 2)}`, 
                    position: 'top',
                    fill: chartColors.slate,
                    fontSize: 10,
                    offset: 10
                  }}
                />
                <Bar dataKey="coverage" radius={[0, 6, 6, 0]}>
                  {topCoverage.map((row) => (
                    <Cell 
                      key={row.name} 
                      fill={row.coverage >= cityCoverage ? chartColors.green : chartColors.amber} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="alt5-chart-card">
          <header>
            <span>Area Prioritas</span>
            <h3>10 Kecamatan: Rasio Sekolah Terendah</h3>
          </header>
          <div className="alt5-chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lowCoverage} layout="vertical" margin={{ top: 20, right: 60, bottom: 0, left: 110 }}>
                <CartesianGrid stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="label" tickLine={false} axisLine={false} width={100} fontSize={10} />
                <Tooltip formatter={(value) => [`${formatNumber(Number(value), 2)}`, "Sekolah / 1rb anak"]} />
                <ReferenceLine
                  x={cityCoverage}
                  stroke={chartColors.slate}
                  strokeDasharray="4 4"
                  label={{ 
                    value: `Avg: ${formatNumber(cityCoverage, 2)}`, 
                    position: 'top',
                    fill: chartColors.slate,
                    fontSize: 10,
                    offset: 10
                  }}
                />
                <Bar dataKey="coverage" radius={[0, 6, 6, 0]}>
                  {lowCoverage.map((row) => (
                    <Cell 
                      key={row.name} 
                      fill={row.coverage < cityCoverage * 0.8 ? chartColors.red : chartColors.amber} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="alt5-chart-card">
          <header>
            <span>Beban Guru</span>
            <h3>Kecamatan: Siswa per Guru Tertinggi</h3>
          </header>
          <div className="alt5-chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadRows} margin={{ top: 14, right: 10, bottom: 60, left: -10 }}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} interval={0} angle={-45} textAnchor="end" height={80} fontSize={9} />
                <YAxis tickLine={false} axisLine={false} fontSize={11} />
                <Tooltip formatter={(value) => [`${formatNumber(Number(value), 1)} siswa/guru`, "Beban"]} />
                <ReferenceLine
                  y={cityAverageBeban}
                  stroke={chartColors.slate}
                  strokeDasharray="4 4"
                />
                <Bar dataKey="beban" radius={[6, 6, 0, 0]}>
                  {workloadRows.map((row) => (
                    <Cell
                      key={row.name}
                      fill={
                        row.beban > cityAverageBeban * 1.15 
                          ? chartColors.red 
                          : row.beban > cityAverageBeban 
                            ? chartColors.amber 
                            : chartColors.teal
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="alt5-chart-card">
          <header>
            <span>Rasio Sekolah</span>
            <h3>Kecamatan: Rasio Sekolah Tertinggi</h3>
          </header>
          <div className="alt5-chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={schoolRatioRows} margin={{ top: 14, right: 10, bottom: 60, left: -10 }}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} interval={0} angle={-45} textAnchor="end" height={80} fontSize={9} />
                <YAxis tickLine={false} axisLine={false} fontSize={11} />
                <Tooltip formatter={(value) => [`${formatNumber(Number(value), 2)}`, "Sekolah / 1.000 anak"]} />
                <ReferenceLine
                  y={citySchoolRatio}
                  stroke={chartColors.slate}
                  strokeDasharray="4 4"
                />
                <Bar dataKey="rasio" radius={[6, 6, 0, 0]}>
                  {schoolRatioRows.map((row) => (
                    <Cell 
                      key={row.name} 
                      fill={row.rasio >= citySchoolRatio ? chartColors.teal : chartColors.amber} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="alt5-chart-card alt5-chart-card-wide">
          <header className="alt5-chart-header-flex">
            <div>
              <span>Analisis Kuadran: Demand vs Kapasitas</span>
              <h3>Korelasi Jumlah Siswa (Demand) dan Jumlah Sekolah (Kapasitas)</h3>
            </div>
            <div className="alt5-level-filter">
              {(["all", "SD", "SMP", "SMA"] as const).map((lvl) => (
                <button
                  key={lvl}
                  className={levelFilter === lvl ? "is-active" : ""}
                  onClick={() => setLevelFilter(lvl)}
                >
                  {lvl === "all" ? "Semua" : lvl}
                </button>
              ))}
            </div>
          </header>
          <div className="alt5-chart-area alt5-scatter-area">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 25, right: 35, bottom: 20, left: 10 }}>
                <CartesianGrid stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="siswa"
                  name="Siswa"
                  tickFormatter={(value) => formatNumber(Number(value) / 1000, 0)}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: "Total Siswa (Ribu)", position: "insideBottom", offset: -10, fontSize: 12, fontWeight: 700 }}
                />
                <YAxis
                  type="number"
                  dataKey="sekolah"
                  name="Sekolah"
                  tickLine={false}
                  axisLine={false}
                  label={{ value: "Total Sekolah", angle: -90, position: "insideLeft", offset: 10, fontSize: 12, fontWeight: 700 }}
                />
                {/* ZAxis adds the 'Bubble' effect based on teacher workload */}
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const isHighBeban = data.beban > cityAverageBeban * 1.15;
                      return (
                        <div className="alt5-custom-tooltip">
                          <p style={{ fontWeight: 900, color: "#0f172a", marginBottom: "6px" }}>{data.name}</p>
                          <p style={{ fontSize: "12px", color: "#475569" }}>Siswa: <strong>{formatNumber(data.siswa)}</strong></p>
                          <p style={{ fontSize: "12px", color: "#475569" }}>Sekolah: <strong>{formatNumber(data.sekolah)}</strong></p>
                          <p style={{ marginTop: "6px", fontSize: "12px", color: isHighBeban ? chartColors.red : "#0f766e", fontWeight: 700 }}>
                            Beban: {formatNumber(data.beban, 1)} siswa/guru {isHighBeban ? "(Kritis)" : "(Normal)"}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* Average Lines to create Quadrants */}
                <ReferenceLine 
                  x={scatterAvgSiswa} 
                  stroke={chartColors.slate} 
                  strokeDasharray="3 3"
                  label={{ value: "Avg Siswa", position: "insideTopRight", fontSize: 10, fill: "#64748b" }} 
                />
                <ReferenceLine 
                  y={scatterAvgSekolah} 
                  stroke={chartColors.slate} 
                  strokeDasharray="3 3"
                  label={{ value: "Avg Sekolah", position: "insideRight", fontSize: 10, fill: "#64748b" }} 
                />
                
                <Scatter data={demandCapacityRows} fill={chartColors.blue}>
                  {demandCapacityRows.map((row) => (
                    <Cell
                      key={row.name}
                      fill={
                        row.beban > cityAverageBeban * 1.15
                          ? chartColors.red
                          : row.beban > cityAverageBeban
                            ? chartColors.amber
                            : chartColors.teal
                      }
                      fillOpacity={0.8}
                      strokeWidth={row.beban > cityAverageBeban * 1.15 ? 2 : 1}
                      stroke={row.beban > cityAverageBeban * 1.15 ? chartColors.red : "#fff"}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <footer className="alt5-chart-footer">
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="alt5-legend-dot" style={{ background: chartColors.red }} /> Beban Kritis
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="alt5-legend-dot" style={{ background: chartColors.amber }} /> Di atas Rata-rata
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="alt5-legend-dot" style={{ background: chartColors.teal }} /> Beban Ringan
            </div>
          </footer>
        </article>
      </section>
    </main>
  );
}
