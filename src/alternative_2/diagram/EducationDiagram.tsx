import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, LineChart, Line, Cell
} from 'recharts';
import { metricLabels, BLUE_PALETTE, calculateMetricValue } from '../utils';

interface Props {
    activeMetric: string;
    pendidikan: any;
    pendudukData: any;
    selectedKecamatan?: string;
    onSelectKecamatan: (nama: string) => void;
}

export const EducationDiagram: React.FC<Props> = ({ 
    activeMetric, 
    pendidikan, 
    pendudukData, 
    selectedKecamatan,
    onSelectKecamatan 
}) => {
    const chartData = useMemo(() => {
        if (!pendidikan || Object.keys(pendidikan).length === 0) return [];

        const mappedData = Object.keys(pendidikan).map(kecamatan => {
            const data = pendidikan[kecamatan];
            const penduduk = pendudukData[kecamatan];

            const item = {
                kecamatan,
                bebanKerja:  data?.['Beban Kerja'] || 0,
                sekolahSD:   data?.['Jumlah Sekolah SD'] || 0,
                sekolahSMP:  data?.['Jumlah Sekolah SMP'] || 0,
                sekolahSMA:  data?.['Jumlah Sekolah SMA'] ?? 0,
                guruSD:      data?.['Jumlah Guru SD'] || 0,
                guruSMP:     data?.['Jumlah Guru SMP'] || 0,
                guruSMA:     data?.['Jumlah Guru SMA'] || 0,
                umurSD:      penduduk?.SD ?? 0,
                umurSMP:     penduduk?.SMP ?? 0,
                umurSMA:     penduduk?.SMA ?? 0,
                pemerataan:  (data?.['Total Siswa'] || 0) / (penduduk?.Total || 1)
            };

            const sortValue = calculateMetricValue(kecamatan, pendidikan, pendudukData, activeMetric);
            return { ...item, sortValue };
        });

        return mappedData.sort((a, b) => b.sortValue - a.sortValue);
    }, [activeMetric, pendidikan, pendudukData]);

    const axisStyle  = { fontSize: 10, fill: BLUE_PALETTE.muted, fontWeight: 500 };
    const chartMargin = { top: 16, right: 16, left: -16, bottom: 0 };

    const tooltipStyle = {
        contentStyle: { 
            background: "rgba(255, 255, 255, 0.95)", 
            backdropFilter: "blur(4px)",
            border: `1px solid ${BLUE_PALETTE.pale}`, 
            borderRadius: "8px", 
            fontSize: 12, 
            color: BLUE_PALETTE.text,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
        },
        cursor: { fill: BLUE_PALETTE.bg },
    };

    const legendStyle = {
        verticalAlign: "top" as const,
        wrapperStyle: { paddingBottom: 12, fontSize: 11, color: BLUE_PALETTE.text, fontWeight: 500 },
    };

    const handleClick = (state: any) => {
        if (state && state.activeLabel) {
            onSelectKecamatan(state.activeLabel);
        }
    };

    const renderChart = () => {
        if (activeMetric === "beban") {
            return (
                <LineChart data={chartData} margin={chartMargin} onClick={handleClick}>
                    <CartesianGrid strokeDasharray="3 3" stroke={BLUE_PALETTE.border} vertical={false} />
                    <XAxis dataKey="kecamatan" tick={axisStyle} tickLine={false} axisLine={{ stroke: BLUE_PALETTE.border }} />
                    <YAxis domain={['auto', 'auto']} tick={axisStyle} axisLine={false} tickLine={false} />
                    <Tooltip {...tooltipStyle} />
                    <Legend {...legendStyle} />
                    <Line 
                        type="monotone" 
                        dataKey="bebanKerja" 
                        name="Beban Kerja Guru" 
                        stroke={BLUE_PALETTE.mid} 
                        strokeWidth={3} 
                        activeDot={{ r: 6, fill: "#F59E0B", stroke: "#fff", strokeWidth: 2 }} 
                        dot={(props: any) => {
                            const { cx, cy, payload } = props;
                            if (payload.kecamatan === selectedKecamatan) {
                                return <circle cx={cx} cy={cy} r={6} fill="#F59E0B" stroke="#fff" strokeWidth={2} />;
                            }
                            return <circle cx={cx} cy={cy} r={2} fill={BLUE_PALETTE.dark} strokeWidth={0} />;
                        }}
                    />
                </LineChart>
            );
        }

        const dataKeyMap: Record<string, string> = {
            usiaSd: "umurSD",
            usiaSmp: "umurSMP",
            usiaSma: "umurSMA",
            sd: "sekolahSD",
            smp: "sekolahSMP",
            sma: "sekolahSMA",
            guruSd: "guruSD",
            guruSmp: "guruSMP",
            guruSma: "guruSMA",
            pemerataan: "pemerataan"
        };

        return (
            <BarChart data={chartData} margin={chartMargin} onClick={handleClick}>
                <CartesianGrid strokeDasharray="3 3" stroke={BLUE_PALETTE.border} vertical={false} />
                <XAxis dataKey="kecamatan" tick={axisStyle} tickLine={false} axisLine={{ stroke: BLUE_PALETTE.border }} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Legend {...legendStyle} />
                <Bar dataKey={dataKeyMap[activeMetric] || "sortValue"} name={metricLabels[activeMetric]} radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={entry.kecamatan === selectedKecamatan ? "#F59E0B" : BLUE_PALETTE.mid} 
                        />
                    ))}
                </Bar>
            </BarChart>
        );
    };

    return (
        <div style={{
            height: "100%",
            padding: "16px 20px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
            }}>
                <p style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: BLUE_PALETTE.muted,
                    margin: 0,
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                }}>
                    📊 {metricLabels[activeMetric] ?? activeMetric}
                </p>
                <span style={{ fontSize: 10, color: BLUE_PALETTE.light, fontWeight: 500 }}>
                    {selectedKecamatan ? `Terpilih: ${selectedKecamatan}` : "Klik grafik untuk memilih kecamatan"}
                </span>
            </div>

            <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        </div>
    );
};