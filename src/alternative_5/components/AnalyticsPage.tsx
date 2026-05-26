import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend as RechartsLegend,
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
};

function percent(numerator: number, denominator: number) {
  return denominator > 0 ? (numerator / denominator) * 100 : 0;
}

function shortName(name: string) {
  return name.length > 14 ? `${name.slice(0, 12)}.` : name;
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

  const cityCoverage = percent(summary.totalSiswa, summary.totalUsia);
  const citySchoolRatio = summary.totalUsia > 0 ? summary.totalSekolah / (summary.totalUsia / 1000) : 0;

  const levelCoverage = [
    { jenjang: "SD", siswa: summary.sdSiswa, usia: summary.sdUsia, coverage: percent(summary.sdSiswa, summary.sdUsia) },
    {
      jenjang: "SMP",
      siswa: summary.smpSiswa,
      usia: summary.smpUsia,
      coverage: percent(summary.smpSiswa, summary.smpUsia),
    },
    {
      jenjang: "SMA",
      siswa: summary.smaSiswa,
      usia: summary.smaUsia,
      coverage: percent(summary.smaSiswa, summary.smaUsia),
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
    .slice(0, 12);

  const schoolRatioRows = rows
    .map((row) => ({ name: row.name, label: shortName(row.name), rasio: row.sekolah_ratio }))
    .sort((a, b) => b.rasio - a.rasio)
    .slice(0, 12);

  const demandCapacityRows = rows.map((row) => ({
    name: row.name,
    siswa: row.pendidikan["Total Siswa"],
    sekolah: row.pendidikan["Total Sekolah"],
    guru: row.pendidikan["Total Guru"],
    beban: row.beban_kerja,
  }));

  const kpis = [
    { label: "Total Sekolah", value: formatNumber(summary.totalSekolah), helper: "unit pendidikan" },
    { label: "Total Siswa", value: formatNumber(summary.totalSiswa), helper: "peserta didik" },
    { label: "Total Guru", value: formatNumber(summary.totalGuru), helper: "tenaga pengajar" },
    { label: "Coverage Kota", value: `${formatNumber(cityCoverage, 1)}%`, helper: "siswa / anak usia sekolah" },
    { label: "Beban Guru", value: formatNumber(cityAverageBeban, 1), helper: "siswa per guru" },
    { label: "Rasio Sekolah", value: formatNumber(citySchoolRatio, 2), helper: "per 1.000 anak usia sekolah" },
  ];

  return (
    <main className="alt5-analytics">
      <section className="alt5-analytics-hero">
        <div>
          <span>Dashboard Analitik</span>
          <h2>Ringkasan kapasitas, pemerataan, dan beban layanan pendidikan Surabaya.</h2>
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

      <section className="alt5-analytics-grid">
        <article className="alt5-chart-card alt5-chart-card-wide">
          <header>
            <span>Coverage Jenjang</span>
            <h3>Pemerataan siswa dibanding populasi usia sekolah</h3>
          </header>
          <div className="alt5-chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={levelCoverage} margin={{ top: 14, right: 20, bottom: 6, left: 0 }}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="jenjang" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "coverage") return [`${formatNumber(Number(value), 1)}%`, "Coverage"];
                    return [formatNumber(Number(value)), name === "siswa" ? "Siswa" : "Penduduk Usia"];
                  }}
                />
                <RechartsLegend />
                <Bar dataKey="usia" name="Penduduk Usia" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="siswa" name="Siswa" fill={chartColors.teal} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="alt5-chart-card">
          <header>
            <span>Top Coverage</span>
            <h3>10 kecamatan dengan pemerataan tertinggi</h3>
          </header>
          <div className="alt5-chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCoverage} layout="vertical" margin={{ top: 8, right: 26, bottom: 0, left: 62 }}>
                <CartesianGrid stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tickFormatter={(value) => `${value}%`} hide />
                <YAxis type="category" dataKey="label" tickLine={false} axisLine={false} width={72} />
                <Tooltip formatter={(value) => [`${formatNumber(Number(value), 1)}%`, "Coverage"]} />
                <Bar dataKey="coverage" fill={chartColors.green} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="alt5-chart-card">
          <header>
            <span>Area Prioritas</span>
            <h3>10 kecamatan dengan coverage terendah</h3>
          </header>
          <div className="alt5-chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lowCoverage} layout="vertical" margin={{ top: 8, right: 26, bottom: 0, left: 62 }}>
                <CartesianGrid stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tickFormatter={(value) => `${value}%`} hide />
                <YAxis type="category" dataKey="label" tickLine={false} axisLine={false} width={72} />
                <Tooltip formatter={(value) => [`${formatNumber(Number(value), 1)}%`, "Coverage"]} />
                <Bar dataKey="coverage" fill={chartColors.amber} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="alt5-chart-card">
          <header>
            <span>Beban Guru</span>
            <h3>Kecamatan dengan siswa per guru tertinggi</h3>
          </header>
          <div className="alt5-chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadRows} margin={{ top: 14, right: 18, bottom: 18, left: 0 }}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} interval={0} angle={-35} textAnchor="end" height={58} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => [`${formatNumber(Number(value), 1)} siswa/guru`, "Beban"]} />
                <Bar dataKey="beban" radius={[6, 6, 0, 0]}>
                  {workloadRows.map((row) => (
                    <Cell key={row.name} fill={row.beban > 20 ? chartColors.red : chartColors.amber} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="alt5-chart-card">
          <header>
            <span>Rasio Sekolah</span>
            <h3>Sekolah per 1.000 anak usia sekolah tertinggi</h3>
          </header>
          <div className="alt5-chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={schoolRatioRows} margin={{ top: 14, right: 18, bottom: 18, left: 0 }}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} interval={0} angle={-35} textAnchor="end" height={58} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => [`${formatNumber(Number(value), 2)}`, "Sekolah / 1.000 anak"]} />
                <Bar dataKey="rasio" fill={chartColors.teal} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="alt5-chart-card alt5-chart-card-wide">
          <header>
            <span>Demand vs Kapasitas</span>
            <h3>Hubungan jumlah siswa, sekolah, dan beban guru</h3>
          </header>
          <div className="alt5-chart-area alt5-scatter-area">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 18, bottom: 10, left: 4 }}>
                <CartesianGrid stroke="#e2e8f0" />
                <XAxis
                  dataKey="siswa"
                  name="Siswa"
                  tickFormatter={(value) => formatNumber(Number(value) / 1000, 0)}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: "Total siswa (ribu)", position: "insideBottom", offset: -4 }}
                />
                <YAxis
                  dataKey="sekolah"
                  name="Sekolah"
                  tickLine={false}
                  axisLine={false}
                  label={{ value: "Total sekolah", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    if (name === "Siswa") return [formatNumber(Number(value)), name];
                    if (name === "Sekolah") return [formatNumber(Number(value)), name];
                    return [formatNumber(Number(value), 1), name];
                  }}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.name ?? ""}
                />
                <Scatter data={demandCapacityRows} fill={chartColors.blue}>
                  {demandCapacityRows.map((row) => (
                    <Cell key={row.name} fill={row.beban > 20 ? chartColors.red : row.beban > 17 ? chartColors.amber : chartColors.teal} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>
    </main>
  );
}
