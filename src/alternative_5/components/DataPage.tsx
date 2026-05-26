import { useMemo, useState } from "react";
import type { KecamatanMetrics } from "../types";
import { formatNumber } from "../utils/metrics";

interface DataPageProps {
  metricsByName: Record<string, KecamatanMetrics>;
}

const columns = [
  "Kecamatan",
  "Sekolah SD",
  "Sekolah SMP",
  "Sekolah SMA",
  "Total Sekolah",
  "Siswa SD",
  "Siswa SMP",
  "Siswa SMA",
  "Total Siswa",
  "Guru SD",
  "Guru SMP",
  "Guru SMA",
  "Total Guru",
  "Usia SD",
  "Usia SMP",
  "Usia SMA",
  "Total Usia",
  "Coverage SD",
  "Coverage SMP",
  "Coverage SMA",
  "Coverage Total",
  "Beban Kerja",
  "Rasio Sekolah",
] as const;

export function DataPage({ metricsByName }: DataPageProps) {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return Object.values(metricsByName)
      .filter((row) => !normalizedQuery || row.name.toLowerCase().includes(normalizedQuery))
      .sort((a, b) => a.name.localeCompare(b.name, "id-ID"));
  }, [metricsByName, query]);

  return (
    <main className="alt5-data-page">
      <section className="alt5-data-header">
        <div>
          <span>Data Master</span>
          <h2>Daftar data pendidikan dan penduduk usia sekolah per kecamatan.</h2>
        </div>
        <div className="alt5-data-actions">
          <label htmlFor="alt5-data-search">Cari kecamatan</label>
          <input
            id="alt5-data-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Contoh: Tambaksari"
          />
        </div>
      </section>

      <section className="alt5-data-summary">
        <article>
          <span>Baris Data</span>
          <strong>{formatNumber(rows.length)}</strong>
          <small>dari 31 kecamatan</small>
        </article>
        <article>
          <span>Sumber</span>
          <strong>2 JSON</strong>
          <small>persebaran pendidikan + data umur</small>
        </article>
        <article>
          <span>Kolom</span>
          <strong>{formatNumber(columns.length)}</strong>
          <small>termasuk metric hasil hitung</small>
        </article>
      </section>

      <section className="alt5-data-card">
        <div className="alt5-data-table-wrap">
          <table className="alt5-data-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name}>
                  <th scope="row">{row.name}</th>
                  <td>{formatNumber(row.pendidikan["Jumlah Sekolah SD"])}</td>
                  <td>{formatNumber(row.pendidikan["Jumlah Sekolah SMP"])}</td>
                  <td>{formatNumber(row.pendidikan["Jumlah Sekolah SMA"])}</td>
                  <td>{formatNumber(row.pendidikan["Total Sekolah"])}</td>
                  <td>{formatNumber(row.pendidikan["Jumlah Siswa SD"])}</td>
                  <td>{formatNumber(row.pendidikan["Jumlah Siswa SMP"])}</td>
                  <td>{formatNumber(row.pendidikan["Jumlah Siswa SMA"])}</td>
                  <td>{formatNumber(row.pendidikan["Total Siswa"])}</td>
                  <td>{formatNumber(row.pendidikan["Jumlah Guru SD"])}</td>
                  <td>{formatNumber(row.pendidikan["Jumlah Guru SMP"])}</td>
                  <td>{formatNumber(row.pendidikan["Jumlah Guru SMA"])}</td>
                  <td>{formatNumber(row.pendidikan["Total Guru"])}</td>
                  <td>{formatNumber(row.umur.SD)}</td>
                  <td>{formatNumber(row.umur.SMP)}</td>
                  <td>{formatNumber(row.umur.SMA)}</td>
                  <td>{formatNumber(row.umur.Total)}</td>
                  <td>{formatNumber(row.ratio_SD, 1)}%</td>
                  <td>{formatNumber(row.ratio_SMP, 1)}%</td>
                  <td>{formatNumber(row.ratio_SMA, 1)}%</td>
                  <td>{formatNumber(row.ratio_total, 1)}%</td>
                  <td>{formatNumber(row.beban_kerja, 1)}</td>
                  <td>{formatNumber(row.sekolah_ratio, 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
