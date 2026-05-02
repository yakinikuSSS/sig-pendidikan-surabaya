import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';

import dataPendidikan from '../../../public/data/data_persebaran_pendidikan.json';
import dataUmur from '../../../public/data/data_umur.json';

interface PendidikanData {
  "Jumlah Sekolah SD": number;
  "Jumlah Sekolah SMP": number;
  "Jumlah Sekolah SMA"?: number; 
  "Jumah Sekolah SMA"?: number;  
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

// 1. Definisikan Props untuk menerima activeMetric dari MapView
interface Props {
  activeMetric: string;
}

export const EducationDiagram: React.FC<Props> = ({ activeMetric }) => {
  
  // 2. Olah data menggunakan useMemo agar efisien
  const chartData = useMemo(() => {
    const dataPendidikanTyped = dataPendidikan as Record<string, PendidikanData>;
    const dataUmurTyped = dataUmur as Record<string, UmurData>;

    return Object.keys(dataPendidikanTyped).map((kecamatan) => {
      const pd = dataPendidikanTyped[kecamatan];
      const ud = dataUmurTyped[kecamatan]; 
      
      return {
        kecamatan,
        bebanKerja: pd['Beban Kerja'],
        sekolahSD: pd['Jumlah Sekolah SD'],
        sekolahSMP: pd['Jumlah Sekolah SMP'],
        sekolahSMA: pd['Jumlah Sekolah SMA'] ?? pd['Jumah Sekolah SMA'] ?? 0, 
        guruSD: pd['Jumlah Guru SD'],
        guruSMP: pd['Jumlah Guru SMP'],
        guruSMA: pd['Jumlah Guru SMA'],
        umurSD: ud ? ud['SD'] : 0,   
        umurSMP: ud ? ud['SMP'] : 0, 
        umurSMA: ud ? ud['SMA'] : 0 
      };
    });
  }, []);

  const renderChart = () => {
    const chartMargin = { top: 10, right: 20, left: -20, bottom: 0 };
    const axisTextStyle = { fontSize: 10, fill: '#cccccc' };

    // 3. Logika untuk menampilkan LineChart khusus untuk Beban Kerja
    if (activeMetric === "beban") {
      return (
        <LineChart data={chartData} margin={chartMargin}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="kecamatan" tick={axisTextStyle} tickLine={false} />
          <YAxis domain={['auto', 'auto']} tick={axisTextStyle} />
          <Tooltip contentStyle={{ backgroundColor: '#222', color: '#fff', border: 'none' }} />
          <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '10px', fontSize: '12px', color: '#fff' }} />
          <Line type="monotone" dataKey="bebanKerja" name="Beban Kerja Guru" stroke="#ff7300" strokeWidth={2} />
        </LineChart>
      );
    }

    // 4. BarChart untuk metric lainnya[cite: 3]
    return (
      <BarChart data={chartData} margin={chartMargin}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
        <XAxis dataKey="kecamatan" tick={axisTextStyle} tickLine={false} />
        <YAxis tick={axisTextStyle} />
        <Tooltip contentStyle={{ backgroundColor: '#222', color: '#fff', border: '1px solid #555' }} cursor={{fill: '#333'}} />
        <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }} />

        {/* Render bar berdasarkan activeMetric yang dipanggil dari DropDownPanel */}
        {activeMetric === "pemerataan" && (
          <>
            <Bar dataKey="sekolahSD" stackId="a" name="Jumlah SD" fill="#8884d8" />
            <Bar dataKey="sekolahSMP" stackId="a" name="Jumlah SMP" fill="#82ca9d" />
            <Bar dataKey="sekolahSMA" stackId="a" name="Jumlah SMA" fill="#ffc658" />
          </>
        )}

        {activeMetric === "usiaSd" && <Bar dataKey="umurSD" name="Penduduk Usia 7-12 Tahun" fill="#8884d8" />}
        {activeMetric === "usiaSmp" && <Bar dataKey="umurSMP" name="Penduduk Usia 13-15 Tahun" fill="#82ca9d" />}
        {activeMetric === "usiaSma" && <Bar dataKey="umurSMA" name="Penduduk Usia 16-18 Tahun" fill="#ffc658" />}
        
        {activeMetric === "sd" && <Bar dataKey="sekolahSD" name="Jumlah SD" fill="#8884d8" />}
        {activeMetric === "smp" && <Bar dataKey="sekolahSMP" name="Jumlah SMP" fill="#82ca9d" />}
        {activeMetric === "sma" && <Bar dataKey="sekolahSMA" name="Jumlah SMA" fill="#ffc658" />}
        
        {activeMetric === "guruSd" && <Bar dataKey="guruSD" name="Jumlah Guru SD" fill="#a4de6c" />}
        {activeMetric === "guruSmp" && <Bar dataKey="guruSMP" name="Jumlah Guru SMP" fill="#d0ed57" />}
        {activeMetric === "guruSma" && <Bar dataKey="guruSMA" name="Jumlah Guru SMA" fill="#ffc658" />}
      </BarChart>
    );
  };

  return (
    <div style={{ padding: '10px 20px', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', color: '#fff', background: '#1a1a1a', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '600' }}>Visualisasi Data: {activeMetric.toUpperCase()}</h2>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};