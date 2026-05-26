import React, { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";

import dataPendidikan from "../../../public/data/data_persebaran_pendidikan.json";
import dataUmur from "../../../public/data/data_umur.json";

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
    SD: number;
    SMP: number;
    SMA: number;
    Total: number;
}

interface Props {
    activeMetric: string;
}

const metricLabels: Record<string, { title: string; key: string; unit: string; color: string; subtitle: string; sort: "asc" | "desc" }> = {
    pemerataan: {
        title: "Prioritas Pemerataan Pendidikan",
        key: "pemerataan",
        unit: "rasio",
        color: "#DC2626",
        subtitle: "12 kecamatan dengan rasio coverage terendah",
        sort: "asc",
    },
    beban: {
        title: "Beban Kerja Guru",
        key: "bebanKerja",
        unit: "siswa/guru",
        color: "#F97316",
        subtitle: "12 kecamatan dengan tekanan layanan tertinggi",
        sort: "desc",
    },
    sd: {
        title: "Jumlah SD / MI",
        key: "sekolahSD",
        unit: "sekolah",
        color: "#0B2545",
        subtitle: "12 kecamatan berdasarkan jumlah SD/MI terbanyak",
        sort: "desc",
    },
    smp: {
        title: "Jumlah SMP / MTs",
        key: "sekolahSMP",
        unit: "sekolah",
        color: "#0B2545",
        subtitle: "12 kecamatan berdasarkan jumlah SMP/MTs terbanyak",
        sort: "desc",
    },
    sma: {
        title: "Jumlah SMA / SMK / MA",
        key: "sekolahSMA",
        unit: "sekolah",
        color: "#0B2545",
        subtitle: "12 kecamatan berdasarkan jumlah SMA sederajat terbanyak",
        sort: "desc",
    },
    guruSd: {
        title: "Jumlah Guru SD / MI",
        key: "guruSD",
        unit: "guru",
        color: "#0891B2",
        subtitle: "12 kecamatan berdasarkan jumlah guru SD/MI terbanyak",
        sort: "desc",
    },
    guruSmp: {
        title: "Jumlah Guru SMP / MTs",
        key: "guruSMP",
        unit: "guru",
        color: "#0891B2",
        subtitle: "12 kecamatan berdasarkan jumlah guru SMP/MTs terbanyak",
        sort: "desc",
    },
    guruSma: {
        title: "Jumlah Guru SMA / SMK / MA",
        key: "guruSMA",
        unit: "guru",
        color: "#0891B2",
        subtitle: "12 kecamatan berdasarkan jumlah guru SMA sederajat terbanyak",
        sort: "desc",
    },
    usiaSd: {
        title: "Penduduk Usia SD",
        key: "umurSD",
        unit: "jiwa",
        color: "#2563EB",
        subtitle: "12 kecamatan dengan anak usia 7–12 tahun terbanyak",
        sort: "desc",
    },
    usiaSmp: {
        title: "Penduduk Usia SMP",
        key: "umurSMP",
        unit: "jiwa",
        color: "#2563EB",
        subtitle: "12 kecamatan dengan remaja usia 13–15 tahun terbanyak",
        sort: "desc",
    },
    usiaSma: {
        title: "Penduduk Usia SMA",
        key: "umurSMA",
        unit: "jiwa",
        color: "#2563EB",
        subtitle: "12 kecamatan dengan remaja usia 16–18 tahun terbanyak",
        sort: "desc",
    },
};

const color = {
    ink: "#0F172A",
    muted: "#64748B",
    subtle: "#94A3B8",
    border: "#DDE6F0",
    soft: "#F8FAFC",
};

function formatValue(value: any, metricKey: string) {
    const numeric = Number(value || 0);
    return numeric.toLocaleString("id-ID", {
        maximumFractionDigits: metricKey === "beban" || metricKey === "pemerataan" ? 2 : 0,
    });
}

export const EducationDiagram: React.FC<Props> = ({ activeMetric }) => {
    const active = metricLabels[activeMetric] || metricLabels.pemerataan;

    const chartData = useMemo(() => {
        const pd = dataPendidikan as Record<string, PendidikanData>;
        const ud = dataUmur as Record<string, UmurData>;

        return Object.keys(pd)
            .map(kecamatan => {
                const data = pd[kecamatan];
                const penduduk = ud[kecamatan];

                return {
                    kecamatan,
                    bebanKerja: data["Beban Kerja"] || 0,
                    sekolahSD: data["Jumlah Sekolah SD"] || 0,
                    sekolahSMP: data["Jumlah Sekolah SMP"] || 0,
                    sekolahSMA: data["Jumlah Sekolah SMA"] ?? 0,
                    guruSD: data["Jumlah Guru SD"] || 0,
                    guruSMP: data["Jumlah Guru SMP"] || 0,
                    guruSMA: data["Jumlah Guru SMA"] || 0,
                    umurSD: penduduk?.SD ?? 0,
                    umurSMP: penduduk?.SMP ?? 0,
                    umurSMA: penduduk?.SMA ?? 0,
                    pemerataan: (data["Total Siswa"] || 0) / (penduduk?.Total || 1),
                };
            })
            .sort((a: any, b: any) => active.sort === "asc" ? a[active.key] - b[active.key] : b[active.key] - a[active.key])
            .slice(0, 12);
    }, [activeMetric, active.key, active.sort]);

    const tooltipFormatter = (value: any) => [`${formatValue(value, activeMetric)} ${active.unit}`, active.title];

    return (
        <div style={{
            height: "100%",
            padding: "18px 20px 16px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            background: "#FFFFFF",
            minHeight: 0,
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, marginBottom: 12, flexShrink: 0 }}>
                <div>
                    <p style={{ fontSize: 10.5, fontWeight: 950, color: color.muted, margin: 0, letterSpacing: 0.9, textTransform: "uppercase" }}>
                        Grafik distribusi
                    </p>
                    <h3 style={{ margin: "5px 0 0", fontSize: 19, color: color.ink, fontWeight: 950, letterSpacing: -0.55 }}>
                        {active.title}
                    </h3>
                </div>
                <span style={{ fontSize: 11.5, color: color.muted, fontWeight: 750, textAlign: "right", lineHeight: 1.35, maxWidth: 230 }}>
                    {active.subtitle}
                </span>
            </div>

            <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 4, right: 24, left: 10, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke={color.border} horizontal={false} />
                        <XAxis
                            type="number"
                            tick={{ fontSize: 10.5, fill: color.muted, fontWeight: 650 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            dataKey="kecamatan"
                            type="category"
                            width={118}
                            tick={{ fontSize: 10.8, fill: color.ink, fontWeight: 800 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            formatter={tooltipFormatter as any}
                            cursor={{ fill: color.soft }}
                            contentStyle={{
                                background: "rgba(255,255,255,0.98)",
                                border: `1px solid ${color.border}`,
                                borderRadius: 12,
                                boxShadow: "0 16px 34px rgba(15, 23, 42, 0.12)",
                                fontSize: 12,
                            }}
                        />
                        {activeMetric === "pemerataan" && (
                            <ReferenceLine
                                x={1}
                                stroke="#059669"
                                strokeDasharray="4 4"
                                label={{ value: "acuan 1,0", fill: "#047857", fontSize: 10, position: "insideTopRight" }}
                            />
                        )}
                        <Bar dataKey={active.key} name={active.title} fill={active.color} radius={[0, 8, 8, 0]} barSize={13} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
