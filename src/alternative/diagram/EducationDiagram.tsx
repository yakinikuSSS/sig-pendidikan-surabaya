import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';

import dataPendidikan from '../../../public/data/data_persebaran_pendidikan.json';
import dataUmur from '../../../public/data/data_umur.json';

interface PendidikanData {
    "Jumlah Sekolah SD": number;
    "Jumlah Sekolah SMP": number;
    "Jumlah Sekolah SMA"?: number;
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

interface Props {
    activeMetric: string;
}

const metricLabels: Record<string, string> = {
    beban:      "Beban Kerja Guru",
    pemerataan: "Pemerataan Pendidikan",
    sd:         "Jumlah SD / MI",
    smp:        "Jumlah SMP / MTs",
    sma:        "Jumlah SMA / SMK / MA",
    guruSd:     "Jumlah Guru SD",
    guruSmp:    "Jumlah Guru SMP", 
    guruSma:    "Jumlah Guru SMA",
    usiaSd:     "Penduduk Usia SD (7–12 th)",
    usiaSmp:    "Penduduk Usia SMP (13–15 th)",
    usiaSma:    "Penduduk Usia SMA (16–18 th)",
};

const GREEN = {
    dark:   "#3B6D11",
    mid:    "#639922",
    light:  "#97C459",
    pale:   "#C0DD97",
    bg:     "#EAF3DE",
    text:   "#27500A",
    muted:  "#5F5E5A",
    border: "#C0DD97",
};

export const EducationDiagram: React.FC<Props> = ({ activeMetric }) => {
    const chartData = useMemo(() => {
        const pd = dataPendidikan as Record<string, PendidikanData>;
        const ud = dataUmur as Record<string, UmurData>;

        return Object.keys(pd).map(kecamatan => ({
            kecamatan,
            bebanKerja:  pd[kecamatan]['Beban Kerja'],
            sekolahSD:   pd[kecamatan]['Jumlah Sekolah SD'],
            sekolahSMP:  pd[kecamatan]['Jumlah Sekolah SMP'],
            sekolahSMA:  pd[kecamatan]['Jumlah Sekolah SMA'] ?? pd[kecamatan]['Jumlah Sekolah SMA'] ?? 0,
            guruSD:      pd[kecamatan]['Jumlah Guru SD'],
            guruSMP:     pd[kecamatan]['Jumlah Guru SMP'],
            guruSMA:     pd[kecamatan]['Jumlah Guru SMA'],
            umurSD:      ud[kecamatan]?.SD ?? 0,
            umurSMP:     ud[kecamatan]?.SMP ?? 0,
            umurSMA:     ud[kecamatan]?.SMA ?? 0,
        }));
    }, []);

    const axisStyle  = { fontSize: 10, fill: GREEN.muted };
    const chartMargin = { top: 8, right: 16, left: -24, bottom: 0 };

    const tooltipStyle = {
        contentStyle: { background: "white", border: `0.5px solid ${GREEN.border}`, borderRadius: 6, fontSize: 11, color: GREEN.text },
        cursor: { fill: GREEN.bg },
    };

    const legendStyle = {
        verticalAlign: "top" as const,
        wrapperStyle: { paddingBottom: 6, fontSize: 11, color: GREEN.text },
    };

    const renderChart = () => {
        if (activeMetric === "beban") {
            return (
                <LineChart data={chartData} margin={chartMargin}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GREEN.border} />
                    <XAxis dataKey="kecamatan" tick={axisStyle} tickLine={false} />
                    <YAxis domain={['auto', 'auto']} tick={axisStyle} />
                    <Tooltip {...tooltipStyle} />
                    <Legend {...legendStyle} />
                    <Line type="monotone" dataKey="bebanKerja" name="Beban Kerja Guru" stroke={GREEN.dark} strokeWidth={2} dot={{ fill: GREEN.dark, r: 3 }} />
                </LineChart>
            );
        }

        return (
            <BarChart data={chartData} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" stroke={GREEN.border} vertical={false} />
                <XAxis dataKey="kecamatan" tick={axisStyle} tickLine={false} />
                <YAxis tick={axisStyle} />
                <Tooltip {...tooltipStyle} />
                <Legend {...legendStyle} />

                {activeMetric === "pemerataan" && (
                    <>
                        <Bar dataKey="sekolahSD"  stackId="a" name="SD"  fill={GREEN.dark}  radius={[0,0,0,0]} />
                        <Bar dataKey="sekolahSMP" stackId="a" name="SMP" fill={GREEN.mid}   radius={[0,0,0,0]} />
                        <Bar dataKey="sekolahSMA" stackId="a" name="SMA" fill={GREEN.light} radius={[2,2,0,0]} />
                    </>
                )}

                {activeMetric === "usiaSd"  && <Bar dataKey="umurSD"   name="Usia 7–12 th"  fill={GREEN.dark}  radius={[3,3,0,0]} />}
                {activeMetric === "usiaSmp" && <Bar dataKey="umurSMP"  name="Usia 13–15 th" fill={GREEN.mid}   radius={[3,3,0,0]} />}
                {activeMetric === "usiaSma" && <Bar dataKey="umurSMA"  name="Usia 16–18 th" fill={GREEN.light} radius={[3,3,0,0]} />}
                {activeMetric === "sd"      && <Bar dataKey="sekolahSD"  name="Jumlah SD"  fill={GREEN.dark}  radius={[3,3,0,0]} />}
                {activeMetric === "smp"     && <Bar dataKey="sekolahSMP" name="Jumlah SMP" fill={GREEN.mid}   radius={[3,3,0,0]} />}
                {activeMetric === "sma"     && <Bar dataKey="sekolahSMA" name="Jumlah SMA" fill={GREEN.light} radius={[3,3,0,0]} />}
                {activeMetric === "guruSd"  && <Bar dataKey="guruSD"  name="Guru SD"  fill={GREEN.dark}  radius={[3,3,0,0]} />}
                {activeMetric === "guruSmp" && <Bar dataKey="guruSMP" name="Guru SMP" fill={GREEN.mid}   radius={[3,3,0,0]} />}
                {activeMetric === "guruSma" && <Bar dataKey="guruSMA" name="Guru SMA" fill={GREEN.light} radius={[3,3,0,0]} />}
            </BarChart>
        );
    };

    return (
        <div style={{
            height: "100%",
            padding: "12px 16px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            background: "white",
        }}>
            <p style={{
                fontSize: 10,
                fontWeight: 600,
                color: GREEN.dark,
                margin: "0 0 8px",
                letterSpacing: ".6px",
                textTransform: "uppercase",
            }}>
                {metricLabels[activeMetric] ?? activeMetric}
            </p>

            <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        </div>
    );
};