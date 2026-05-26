import React from "react";

interface Props {
    activeMetric: string;
    setActiveMetric: (value: string) => void;
    viewMode?: "map" | "report";
    setViewMode?: (value: "map" | "report") => void;
}

const metricGroups = [
    {
        label: "Analisis utama",
        helper: "indikator keputusan",
        options: [
            { key: "pemerataan", label: "Indeks Pemerataan", meta: "coverage siswa vs usia sekolah", accent: "#059669" },
            { key: "beban", label: "Beban Kerja Guru", meta: "tekanan siswa per guru", accent: "#F97316" },
        ],
    },
    {
        label: "Kebutuhan layanan",
        helper: "basis demografi",
        options: [
            { key: "usiaSd", label: "Penduduk Usia SD", meta: "7–12 tahun", accent: "#2563EB" },
            { key: "usiaSmp", label: "Penduduk Usia SMP", meta: "13–15 tahun", accent: "#2563EB" },
            { key: "usiaSma", label: "Penduduk Usia SMA", meta: "16–18 tahun", accent: "#2563EB" },
        ],
    },
    {
        label: "Fasilitas sekolah",
        helper: "jumlah unit sekolah",
        options: [
            { key: "sd", label: "Sekolah SD / MI", meta: "unit pendidikan dasar", accent: "#0F3A5F" },
            { key: "smp", label: "Sekolah SMP / MTs", meta: "unit menengah pertama", accent: "#0F3A5F" },
            { key: "sma", label: "Sekolah SMA / SMK / MA", meta: "unit menengah atas", accent: "#0F3A5F" },
        ],
    },
    {
        label: "Tenaga pengajar",
        helper: "jumlah guru",
        options: [
            { key: "guruSd", label: "Guru SD / MI", meta: "tenaga pengajar SD", accent: "#0891B2" },
            { key: "guruSmp", label: "Guru SMP / MTs", meta: "tenaga pengajar SMP", accent: "#0891B2" },
            { key: "guruSma", label: "Guru SMA / SMK / MA", meta: "tenaga pengajar SMA", accent: "#0891B2" },
        ],
    },
];

const flatMetrics = metricGroups.flatMap(group => group.options);

const color = {
    ink: "#0F172A",
    muted: "#64748B",
    subtle: "#94A3B8",
    border: "#DDE6F0",
    soft: "#F8FAFC",
    navy: "#0B2545",
    blue: "#2563EB",
};

export default function SidebarPanel({ activeMetric, setActiveMetric, viewMode = "map", setViewMode }: Props) {
    const active = flatMetrics.find(item => item.key === activeMetric) || flatMetrics[0];

    return (
        <aside style={{
            background: "#FFFFFF",
            border: `1px solid ${color.border}`,
            borderRadius: 22,
            boxShadow: "0 18px 42px rgba(15, 23, 42, 0.08)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
        }}>
            <div style={{ padding: "18px 18px 14px", borderBottom: `1px solid ${color.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 14, display: "grid", placeItems: "center", color: "#FFFFFF", background: "linear-gradient(135deg, #0B2545 0%, #2563EB 100%)", fontWeight: 950, letterSpacing: -1 }}>
                        ED
                    </div>
                    <div>
                        <div style={{ color: color.blue, fontSize: 10, fontWeight: 950, letterSpacing: 1.1, textTransform: "uppercase" }}>Layer Control</div>
                        <h2 style={{ margin: "4px 0 0", fontSize: 18, lineHeight: 1.1, letterSpacing: -0.6, color: color.ink }}>Data pendidikan</h2>
                    </div>
                </div>

                <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[
                        { key: "map", label: "Peta" },
                        { key: "report", label: "Laporan" },
                    ].map(item => {
                        const isActive = viewMode === item.key;
                        return (
                            <button
                                key={item.key}
                                onClick={() => setViewMode?.(item.key as "map" | "report")}
                                style={{
                                    height: 38,
                                    borderRadius: 12,
                                    border: `1px solid ${isActive ? color.blue : color.border}`,
                                    background: isActive ? color.blue : color.soft,
                                    color: isActive ? "#FFFFFF" : color.ink,
                                    cursor: "pointer",
                                    fontSize: 12.5,
                                    fontWeight: 900,
                                }}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${color.border}` }}>
                <label style={{ display: "block", color: color.muted, fontSize: 10.5, fontWeight: 950, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8 }}>
                    Indikator aktif
                </label>
                <select
                    value={activeMetric}
                    onChange={(e) => setActiveMetric(e.target.value)}
                    style={{
                        width: "100%",
                        height: 42,
                        borderRadius: 12,
                        border: `1px solid ${color.border}`,
                        background: "#FFFFFF",
                        color: color.ink,
                        padding: "0 12px",
                        fontSize: 13,
                        fontWeight: 850,
                        outline: "none",
                        cursor: "pointer",
                    }}
                >
                    {metricGroups.map(group => (
                        <optgroup key={group.label} label={group.label}>
                            {group.options.map(option => (
                                <option key={option.key} value={option.key}>{option.label}</option>
                            ))}
                        </optgroup>
                    ))}
                </select>
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 99, background: active.accent }} />
                    <span style={{ color: color.muted, fontSize: 11.5, fontWeight: 750 }}>{active.meta}</span>
                </div>
            </div>

            <div style={{ padding: 14, overflowY: "auto", minHeight: 0 }}>
                {metricGroups.map(group => (
                    <section key={group.label} style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, margin: "0 4px 8px" }}>
                            <h3 style={{ margin: 0, color: color.ink, fontSize: 12.5, fontWeight: 950 }}>{group.label}</h3>
                            <span style={{ color: color.subtle, fontSize: 10.5, fontWeight: 800 }}>{group.helper}</span>
                        </div>
                        <div style={{ display: "grid", gap: 8 }}>
                            {group.options.map(item => {
                                const isActive = activeMetric === item.key;
                                return (
                                    <button
                                        key={item.key}
                                        onClick={() => setActiveMetric(item.key)}
                                        style={{
                                            width: "100%",
                                            display: "grid",
                                            gridTemplateColumns: "8px 1fr",
                                            gap: 10,
                                            alignItems: "stretch",
                                            padding: 0,
                                            borderRadius: 14,
                                            border: `1px solid ${isActive ? item.accent : color.border}`,
                                            background: isActive ? "#F8FAFC" : "#FFFFFF",
                                            boxShadow: isActive ? "0 12px 24px rgba(15,23,42,0.08)" : "none",
                                            cursor: "pointer",
                                            overflow: "hidden",
                                            textAlign: "left",
                                        }}
                                    >
                                        <span style={{ background: isActive ? item.accent : "#CBD5E1" }} />
                                        <span style={{ padding: "11px 11px 11px 0" }}>
                                            <span style={{ display: "block", color: color.ink, fontSize: 12.5, lineHeight: 1.1, fontWeight: 900 }}>{item.label}</span>
                                            <span style={{ display: "block", marginTop: 4, color: color.muted, fontSize: 10.8, lineHeight: 1.2, fontWeight: 650 }}>{item.meta}</span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>
        </aside>
    );
}
