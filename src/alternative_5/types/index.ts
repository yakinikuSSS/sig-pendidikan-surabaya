import type { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";

export type Jenjang = "SD" | "SMP" | "SMA";

export type MetricKey = "pemerataan" | "bebanKerja" | "rasioSekolah";

export interface KecamatanProperties {
  name?: string;
  NAME_3?: string;
  kecamatan?: string;
  [key: string]: unknown;
}

export type KecamatanGeometry = Polygon | MultiPolygon;
export type KecamatanFeature = Feature<KecamatanGeometry, KecamatanProperties>;
export type KecamatanFeatureCollection = FeatureCollection<KecamatanGeometry, KecamatanProperties>;

export interface PendidikanRecord {
  "Jumlah Sekolah SD": number;
  "Jumlah Sekolah SMP": number;
  "Jumlah Sekolah SMA": number;
  "Total Sekolah": number;
  "Jumlah Siswa SD": number;
  "Jumlah Siswa SMP": number;
  "Jumlah Siswa SMA": number;
  "Total Siswa": number;
  "Jumlah Guru SD": number;
  "Jumlah Guru SMP": number;
  "Jumlah Guru SMA": number;
  "Total Guru": number;
  "Beban Kerja": number;
}

export interface UmurRecord {
  SD: number;
  SMP: number;
  SMA: number;
  Total: number;
}

export type PendidikanData = Record<string, PendidikanRecord>;
export type UmurData = Record<string, UmurRecord>;

export interface CoverageByLevel {
  jenjang: Jenjang;
  sekolah: number;
  siswa: number;
  guru: number;
  pendudukUsia: number;
  ratio: number;
}

export interface KecamatanMetrics {
  name: string;
  pendidikan: PendidikanRecord;
  umur: UmurRecord;
  coverage: CoverageByLevel[];
  ratio_SD: number;
  ratio_SMP: number;
  ratio_SMA: number;
  ratio_total: number;
  beban_kerja: number;
  sekolah_ratio: number;
}

export interface MetricMeta {
  key: MetricKey;
  label: string;
  shortLabel: string;
  unit: string;
  higherIsBetter: boolean;
  colors: string[];
}

export interface MetricClass {
  color: string;
  from: number;
  to: number;
  label: string;
}

export interface MetricScale {
  metric: MetricKey;
  min: number;
  max: number;
  classes: MetricClass[];
}

export interface RankedKecamatan {
  name: string;
  metrics: KecamatanMetrics;
  rank: number;
  value: number;
  color: string;
  barPercent: number;
}

export interface FlyTarget {
  name: string;
  bounds: [[number, number], [number, number]];
  requestId: number;
}
