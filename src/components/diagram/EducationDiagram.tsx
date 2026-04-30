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

export const EducationDiagram: React.FC = () => {
  const [viewMode, setViewMode] = useState<string>("pemerataan");

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

    if (viewMode === "beban_kerja") {
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

    return (
      <BarChart data={chartData} margin={chartMargin}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
        <XAxis dataKey="kecamatan" tick={axisTextStyle} tickLine={false} />
        <YAxis tick={axisTextStyle} />
        <Tooltip contentStyle={{ backgroundColor: '#222', color: '#fff', border: '1px solid #555' }} cursor={{fill: '#333'}} />
        <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }} />

        {viewMode === "pemerataan" && (
          <>
            <Bar dataKey="sekolahSD" stackId="a" name="Jumlah SD" fill="#8884d8" />
            <Bar dataKey="sekolahSMP" stackId="a" name="Jumlah SMP" fill="#82ca9d" />
            <Bar dataKey="sekolahSMA" stackId="a" name="Jumlah SMA" fill="#ffc658" />
          </>
        )}

        {viewMode === "umur_7_12" && <Bar dataKey="umurSD" name="Penduduk Usia 7-12 Tahun" fill="#8884d8" />}
        {viewMode === "umur_13_15" && <Bar dataKey="umurSMP" name="Penduduk Usia 13-15 Tahun" fill="#82ca9d" />}
        {viewMode === "umur_16_18" && <Bar dataKey="umurSMA" name="Penduduk Usia 16-18 Tahun" fill="#ffc658" />}
        {viewMode === "sekolah_sd" && <Bar dataKey="sekolahSD" name="Jumlah SD" fill="#8884d8" />}
        {viewMode === "sekolah_smp" && <Bar dataKey="sekolahSMP" name="Jumlah SMP" fill="#82ca9d" />}
        {viewMode === "sekolah_sma" && <Bar dataKey="sekolahSMA" name="Jumlah SMA" fill="#ffc658" />}
        {viewMode === "guru_sd" && <Bar dataKey="guruSD" name="Jumlah Guru SD" fill="#a4de6c" />}
        {viewMode === "guru_smp" && <Bar dataKey="guruSMP" name="Jumlah Guru SMP" fill="#d0ed57" />}
        {viewMode === "guru_sma" && <Bar dataKey="guruSMA" name="Jumlah Guru SMA" fill="#ffc658" />}

      </BarChart>
    );
  };

  return (
    <div style={{ padding: '10px 20px', height: '30vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', color: '#fff' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '600' }}>Dashboard Pendidikan</h2>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ marginRight: '8px', fontSize: '0.85rem', color: '#aaa' }}>Menu Data: </label>
          <select 
            value={viewMode} 
            onChange={(e) => setViewMode(e.target.value)}
            style={{ 
              padding: '6px 10px', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontSize: '0.85rem',
              backgroundColor: '#2c2c2c',
              color: '#fff',
              border: '1px solid #555',
              outline: 'none'
            }}
          >
            <option value="pemerataan">Pemerataan Pendidikan</option>
            <option value="beban_kerja">Beban Kerja Guru</option>
            <option value="umur_7_12">Penduduk Usia 7-12 tahun</option>
            <option value="umur_13_15">Penduduk Usia 13-15 tahun</option>
            <option value="umur_16_18">Penduduk Usia 16-18 tahun</option>
            <option value="sekolah_sd">Jumlah SD</option>
            <option value="sekolah_smp">Jumlah SMP</option>
            <option value="sekolah_sma">Jumlah SMA</option>
            <option value="guru_sd">Jumlah Guru SD</option>
            <option value="guru_smp">Jumlah Guru SMP</option>
            <option value="guru_sma">Jumlah Guru SMA</option>
          </select>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};