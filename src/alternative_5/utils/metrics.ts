import type {
  KecamatanMetrics,
  MetricKey,
  MetricMeta,
  MetricScale,
  PendidikanData,
  PendidikanRecord,
  RankedKecamatan,
  UmurData,
  UmurRecord,
} from "../types";

const KECAMATAN_NAMES = [
  "Asemrowo",
  "Benowo",
  "Bubutan",
  "Bulak",
  "Dukuh Pakis",
  "Gayungan",
  "Genteng",
  "Gubeng",
  "Gununganyar",
  "Jambangan",
  "Karangpilang",
  "Kenjeran",
  "Krembangan",
  "Lakarsantri",
  "Mulyorejo",
  "Pabean Cantian",
  "Pakal",
  "Rungkut",
  "Sambikerep",
  "Sawahan",
  "Semampir",
  "Simokerto",
  "Sukolilo",
  "Sukomanunggal",
  "Tambaksari",
  "Tandes",
  "Tegalsari",
  "Tenggilis Mejoyo",
  "Wiyung",
  "Wonocolo",
  "Wonokromo",
] as const;

const GREEN_SCALE = ["#dcfce7", "#bbf7d0", "#86efac", "#22c55e", "#166534"];
const HEAT_SCALE = ["#fef9c3", "#fde68a", "#f59e0b", "#ef4444", "#7f1d1d"];
const TEAL_SCALE = ["#ccfbf1", "#99f6e4", "#5eead4", "#14b8a6", "#0f766e"];

export const METRIC_OPTIONS: MetricMeta[] = [
  {
    key: "pemerataan",
    label: "Pemerataan (Ketersediaan Sekolah)",
    shortLabel: "Ketersediaan",
    unit: "sekolah/1rb anak",
    higherIsBetter: true,
    colors: GREEN_SCALE,
  },
  {
    key: "bebanKerja",
    label: "Beban Kerja Guru",
    shortLabel: "Beban Guru",
    unit: "siswa/guru",
    higherIsBetter: false,
    colors: HEAT_SCALE,
  },
  {
    key: "rasioSekolah",
    label: "Rasio Sekolah",
    shortLabel: "Rasio Sekolah",
    unit: "sekolah/1rb anak",
    higherIsBetter: true,
    colors: TEAL_SCALE,
  },
];

const METRIC_META = METRIC_OPTIONS.reduce<Record<MetricKey, MetricMeta>>((acc, metric) => {
  acc[metric.key] = metric;
  return acc;
}, {} as Record<MetricKey, MetricMeta>);

const aliasLookup: Record<string, string> = {
  "dukuh pakis": "Dukuh Pakis",
  dukuhpakis: "Dukuh Pakis",
  "gunung anyar": "Gununganyar",
  gununganyar: "Gununganyar",
  "pabean cantikan": "Pabean Cantian",
  "pabean cantian": "Pabean Cantian",
  "tenggilis mejoyo": "Tenggilis Mejoyo",
};

const canonicalLookup = KECAMATAN_NAMES.reduce<Record<string, string>>((acc, name) => {
  acc[toLookupKey(name)] = name;
  return acc;
}, {});

function toLookupKey(name: string) {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

function titleCaseName(name: string) {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function normalizeKecamatanName(name: string): string {
  const key = toLookupKey(String(name || ""));
  return aliasLookup[key] ?? canonicalLookup[key] ?? titleCaseName(key);
}

function buildLookup<T>(data: Record<string, T>) {
  return Object.keys(data).reduce<Record<string, T>>((acc, key) => {
    acc[normalizeKecamatanName(key)] = data[key];
    return acc;
  }, {});
}

function computeOne(name: string, pendidikan: PendidikanRecord, umur: UmurRecord): KecamatanMetrics {
  const ratio_SD = umur.SD > 0 ? (pendidikan["Jumlah Sekolah SD"] / umur.SD) * 1000 : 0;
  const ratio_SMP = umur.SMP > 0 ? (pendidikan["Jumlah Sekolah SMP"] / umur.SMP) * 1000 : 0;
  const ratio_SMA = umur.SMA > 0 ? (pendidikan["Jumlah Sekolah SMA"] / umur.SMA) * 1000 : 0;
  const ratio_total = umur.Total > 0 ? (pendidikan["Total Sekolah"] / umur.Total) * 1000 : 0;
  const beban_kerja =
    pendidikan["Beban Kerja"] || pendidikan["Total Siswa"] / Math.max(1, pendidikan["Total Guru"]);
  const sekolah_ratio = ratio_total;

  return {
    name,
    pendidikan,
    umur,
    ratio_SD,
    ratio_SMP,
    ratio_SMA,
    ratio_total,
    beban_kerja,
    sekolah_ratio,
    coverage: [
      {
        jenjang: "SD",
        sekolah: pendidikan["Jumlah Sekolah SD"],
        siswa: pendidikan["Jumlah Siswa SD"],
        guru: pendidikan["Jumlah Guru SD"],
        pendudukUsia: umur.SD,
        ratio: ratio_SD,
      },
      {
        jenjang: "SMP",
        sekolah: pendidikan["Jumlah Sekolah SMP"],
        siswa: pendidikan["Jumlah Siswa SMP"],
        guru: pendidikan["Jumlah Guru SMP"],
        pendudukUsia: umur.SMP,
        ratio: ratio_SMP,
      },
      {
        jenjang: "SMA",
        sekolah: pendidikan["Jumlah Sekolah SMA"],
        siswa: pendidikan["Jumlah Siswa SMA"],
        guru: pendidikan["Jumlah Guru SMA"],
        pendudukUsia: umur.SMA,
        ratio: ratio_SMA,
      },
    ],
  };
}

export function buildMetricsByKecamatan(
  pendidikanData: PendidikanData,
  umurData: UmurData,
): Record<string, KecamatanMetrics> {
  const pendidikanLookup = buildLookup(pendidikanData);
  const umurLookup = buildLookup(umurData);
  const names = new Set([...Object.keys(pendidikanLookup), ...Object.keys(umurLookup)]);

  return [...names].reduce<Record<string, KecamatanMetrics>>((acc, name) => {
    const pendidikan = pendidikanLookup[name];
    const umur = umurLookup[name];
    if (pendidikan && umur) {
      acc[name] = computeOne(name, pendidikan, umur);
    }
    return acc;
  }, {});
}

export function getMetricMeta(metric: MetricKey) {
  return METRIC_META[metric];
}

export function getMetricValue(metrics: KecamatanMetrics, metric: MetricKey) {
  if (metric === "pemerataan") return metrics.ratio_total;
  if (metric === "bebanKerja") return metrics.beban_kerja;
  return metrics.sekolah_ratio;
}

function numberFormatter(maximumFractionDigits = 0) {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits });
}

export function formatNumber(value: number, maximumFractionDigits = 0) {
  return numberFormatter(maximumFractionDigits).format(value);
}

export function formatMetricNumber(value: number, metric: MetricKey) {
  if (metric === "pemerataan") return formatNumber(value, 1);
  if (metric === "bebanKerja") return formatNumber(value, 1);
  return formatNumber(value, 2);
}

export function formatMetricValue(value: number, metric: MetricKey) {
  const meta = getMetricMeta(metric);
  if (metric === "pemerataan") return `${formatMetricNumber(value, metric)}${meta.unit}`;
  return `${formatMetricNumber(value, metric)} ${meta.unit}`;
}

export function createMetricScale(metric: MetricKey, values: number[]): MetricScale {
  const finiteValues = values.filter(Number.isFinite);
  const meta = getMetricMeta(metric);
  const min = finiteValues.length ? Math.min(...finiteValues) : 0;
  const max = finiteValues.length ? Math.max(...finiteValues) : 0;
  const effectiveMax = max === min ? min + 1 : max;
  const step = (effectiveMax - min) / meta.colors.length;

  const classes = meta.colors.map((color, index) => {
    const from = min + step * index;
    const to = index === meta.colors.length - 1 ? effectiveMax : min + step * (index + 1);
    return {
      color,
      from,
      to,
      label: `${formatMetricNumber(from, metric)} - ${formatMetricNumber(to, metric)} ${meta.unit}`,
    };
  });

  return { metric, min, max: effectiveMax, classes };
}

export function getColorForMetric(value: number, scale: MetricScale) {
  const selectedClass =
    scale.classes.find((item, index) => {
      if (index === scale.classes.length - 1) return value >= item.from && value <= item.to;
      return value >= item.from && value < item.to;
    }) ?? scale.classes[scale.classes.length - 1];

  return selectedClass.color;
}

export function rankKecamatan(
  metricsByName: Record<string, KecamatanMetrics>,
  metric: MetricKey,
  scale: MetricScale,
): RankedKecamatan[] {
  const meta = getMetricMeta(metric);
  const rows = Object.values(metricsByName)
    .map((metrics) => ({ metrics, value: getMetricValue(metrics, metric) }))
    .filter((row) => Number.isFinite(row.value))
    .sort((a, b) => (meta.higherIsBetter ? b.value - a.value : a.value - b.value));

  const min = Math.min(...rows.map((row) => row.value), 0);
  const max = Math.max(...rows.map((row) => row.value), 1);
  const range = Math.max(0.0001, max - min);

  return rows.map((row, index) => ({
    name: row.metrics.name,
    metrics: row.metrics,
    rank: index + 1,
    value: row.value,
    color: getColorForMetric(row.value, scale),
    barPercent: Math.max(7, Math.min(100, ((row.value - min) / range) * 100)),
  }));
}

export function computeCityAverageBeban(metricsByName: Record<string, KecamatanMetrics>) {
  const rows = Object.values(metricsByName);
  const totalSiswa = rows.reduce((sum, row) => sum + row.pendidikan["Total Siswa"], 0);
  const totalGuru = rows.reduce((sum, row) => sum + row.pendidikan["Total Guru"], 0);
  return totalGuru > 0 ? totalSiswa / totalGuru : 0;
}
