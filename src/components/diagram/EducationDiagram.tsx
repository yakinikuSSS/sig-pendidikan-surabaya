import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

import dataPendidikan from '../../../public/data/data_persebaran_pendidikan.json';
import dataUmur from '../../../public/data/data_umur.json';

interface PendidikanData {
  "Jumlah Sekolah SD": number;
  "Jumlah Sekolah SMP": number;
  "Jumah Sekolah SMA": number; 
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

interface UmurData {
  "SD": number;
  "SMP": number;
  "SMA": number;
  "Total": number;
}

export const EducationDiagram: React.FC = () => {
  // State default diset ke salah satu menu, misalnya "Pemerataan Pendidikan"
  const [viewMode, setViewMode] = useState<string>("pemerataan");

  const chartData = useMemo(() => {
    const dataPendidikanTyped = dataPendidikan as Record<string, PendidikanData>;
    const dataUmurTyped = dataUmur as Record<string, UmurData>;

    return Object.keys(dataPendidikanTyped).map((kecamatan) => {
      const pd = dataPendidikanTyped[kecamatan];
      const ud = dataUmurTyped[kecamatan]; 
      
      // Memasukkan SEMUA data yang dibutuhkan oleh menu ke dalam chartData
      return {
        kecamatan,
        bebanKerja: pd['Beban Kerja'],
        sekolahSD: pd['Jumlah Sekolah SD'],
        sekolahSMP: pd['Jumlah Sekolah SMP'],
        sekolahSMA: pd['Jumah Sekolah SMA'], // Typo bawaan dari interface kamu
        guruSD: pd['Jumlah Guru SD'],
        guruSMP: pd['Jumlah Guru SMP'],
        guruSMA: pd['Jumlah Guru SMA'],
        umurSD: ud ? ud['SD'] : 0,   // Identik dengan usia 7-12 tahun
        umurSMP: ud ? ud['SMP'] : 0, // Identik dengan usia 13-15 tahun
        umurSMA: ud ? ud['SMA'] : 0  // Identik dengan usia 16-18 tahun
      };
    });
  }, []);

  const renderChart = () => {
    // 1. Line Chart khusus untuk Beban Kerja
    if (viewMode === "beban_kerja") {
      return (
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="kecamatan" angle={-45} textAnchor="end" interval={0} tick={{fontSize: 12}} />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }} />
          <Line type="monotone" dataKey="bebanKerja" name="Beban Kerja Guru" stroke="#ff7300" strokeWidth={3} />
        </LineChart>
      );
    }

    // 2. Bar Chart untuk semua menu lainnya
    return (
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="kecamatan" angle={-45} textAnchor="end" interval={0} tick={{fontSize: 12}} />
        <YAxis />
        <Tooltip />
        <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }} />

        {/* --- KONDISI RENDER BAR BERDASARKAN MENU --- */}
        
        {viewMode === "pemerataan" && (
          <>
            <Bar dataKey="sekolahSD" stackId="a" name="Jumlah SD" fill="#8884d8" />
            <Bar dataKey="sekolahSMP" stackId="a" name="Jumlah SMP" fill="#82ca9d" />
            <Bar dataKey="sekolahSMA" stackId="a" name="Jumlah SMA" fill="#ffc658" />
          </>
        )}

        {viewMode === "umur_7_12" && (
          <Bar dataKey="umurSD" name="Penduduk Usia 7-12 Tahun" fill="#8884d8" />
        )}

        {viewMode === "umur_13_15" && (
          <Bar dataKey="umurSMP" name="Penduduk Usia 13-15 Tahun" fill="#82ca9d" />
        )}

        {viewMode === "umur_16_18" && (
          <Bar dataKey="umurSMA" name="Penduduk Usia 16-18 Tahun" fill="#ffc658" />
        )}

        {viewMode === "sekolah_sd" && (
          <Bar dataKey="sekolahSD" name="Jumlah SD" fill="#8884d8" />
        )}

        {viewMode === "sekolah_smp" && (
          <Bar dataKey="sekolahSMP" name="Jumlah SMP" fill="#82ca9d" />
        )}

        {viewMode === "sekolah_sma" && (
          <Bar dataKey="sekolahSMA" name="Jumlah SMA" fill="#ffc658" />
        )}

        {viewMode === "guru_sd" && (
          <Bar dataKey="guruSD" name="Jumlah Guru SD" fill="#a4de6c" />
        )}

        {viewMode === "guru_smp" && (
          <Bar dataKey="guruSMP" name="Jumlah Guru SMP" fill="#d0ed57" />
        )}

        {viewMode === "guru_sma" && (
          <Bar dataKey="guruSMA" name="Jumlah Guru SMA" fill="#ffc658" />
        )}

      </BarChart>
    );
  };

  return (
    <div style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      <h2>Dashboard Data Pendidikan Kota Surabaya</h2>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Menu Data: </label>
        <select 
          value={viewMode} 
          onChange={(e) => setViewMode(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', minWidth: '250px' }}
        >
          <option value="beban_kerja">Beban Kerja Guru</option>
          <option value="pemerataan">Pemerataan Pendidikan</option>
          <option value="umur_7_12">Jumlah Penduduk Usia 7-12 tahun</option>
          <option value="umur_13_15">Jumlah Penduduk Usia 13-15 tahun</option>
          <option value="umur_16_18">Jumlah Penduduk Usia 16-18 tahun</option>
          <option value="sekolah_sd">Jumlah SD</option>
          <option value="sekolah_smp">Jumlah SMP</option>
          <option value="sekolah_sma">Jumlah SMA</option>
          <option value="guru_sd">Jumlah Guru SD</option>
          <option value="guru_smp">Jumlah Guru SMP</option>
          <option value="guru_sma">Jumlah Guru SMA</option>
        </select>
      </div>

      {/* Area Render Chart */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};