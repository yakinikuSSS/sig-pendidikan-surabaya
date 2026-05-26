import React, { useMemo } from "react";

interface Props {
    pendidikan: any;
    pendudukData: any;
    activeMetric: string;
    onSelectKecamatan: (nama: string) => void;
    limit?: number;
}

const metricLabels: Record<string, { label: string; unit: string; note: string; sort: "asc" | "desc" }> = {
    pemerataan: { label: "Prioritas Pemerataan", unit: "rasio", note: "Nilai terendah ditampilkan dahulu.", sort: "asc" },
    beban: { label: "Beban Kerja Guru", unit: "siswa/guru", note: "Tekanan layanan tertinggi.", sort: "desc" },
    usiaSd: { label: "Penduduk Usia SD", unit: "jiwa", note: "Kebutuhan SD terbesar.", sort: "desc" },
    usiaSmp: { label: "Penduduk Usia SMP", unit: "jiwa", note: "Kebutuhan SMP terbesar.", sort: "desc" },
    usiaSma: { label: "Penduduk Usia SMA", unit: "jiwa", note: "Kebutuhan SMA terbesar.", sort: "desc" },
    sd: { label: "Sekolah SD / MI", unit: "unit", note: "Fasilitas SD terbanyak.", sort: "desc" },
    smp: { label: "Sekolah SMP / MTs", unit: "unit", note: "Fasilitas SMP terbanyak.", sort: "desc" },
    sma: { label: "Sekolah SMA / SMK / MA", unit: "unit", note: "Fasilitas SMA sederajat terbanyak.", sort: "desc" },
    guruSd: { label: "Guru SD / MI", unit: "guru", note: "Guru SD terbanyak.", sort: "desc" },
    guruSmp: { label: "Guru SMP / MTs", unit: "guru", note: "Guru SMP terbanyak.", sort: "desc" },
    guruSma: { label: "Guru SMA / SMK / MA", unit: "guru", note: "Guru SMA sederajat terbanyak.", sort: "desc" },
};

const color = {
    ink: "#0F172A",
    muted: "#64748B",
    subtle: "#94A3B8",
    border: "#DDE6F0",
    blue: "#2563EB",
    navy: "#0B2545",
    soft: "#F8FAFC",
    green: "#059669",
    orange: "#F97316",
    red: "#DC2626",
};

function formatValue(value: number, activeMetric: string) {
    return value.toLocaleString("id-ID", {
        maximumFractionDigits: activeMetric === "beban" || activeMetric === "pemerataan" ? 2 : 0,
    });
}

function calculateValue(nama: string, pendidikan: any, pendudukData: any, activeMetric: string) {
    const data = pendidikan[nama];
    const penduduk = pendudukData[nama];
    if (!data && !penduduk) return 0;

    switch (activeMetric) {
        case "pemerataan": return (data?.["Total Siswa"] || 0) / (penduduk?.Total || 1);
        case "beban": return data?.["Beban Kerja"] || 0;
        case "sd": return data?.["Jumlah Sekolah SD"] || 0;
        case "smp": return data?.["Jumlah Sekolah SMP"] || 0;
        case "sma": return data?.["Jumlah Sekolah SMA"] || 0;
        case "guruSd": return data?.["Jumlah Guru SD"] || 0;
        case "guruSmp": return data?.["Jumlah Guru SMP"] || 0;
        case "guruSma": return data?.["Jumlah Guru SMA"] || 0;
        case "usiaSd": return penduduk?.SD || 0;
        case "usiaSmp": return penduduk?.SMP || 0;
        case "usiaSma": return penduduk?.SMA || 0;
        default: return 0;
    }
}

function barColor(activeMetric: string, index: number) {
    if (activeMetric === "pemerataan") return index < 3 ? color.red : color.orange;
    if (activeMetric === "beban") return index < 3 ? color.orange : color.blue;
    return index < 3 ? color.navy : color.blue;
}

export default function RankPanel({ pendidikan, pendudukData, activeMetric, onSelectKecamatan, limit = 8 }: Props) {
    const active = metricLabels[activeMetric] || metricLabels.pemerataan;

    const rankingList = useMemo(() => {
        const rows = Object.keys(pendidikan)
            .map(nama => ({ nama, value: calculateValue(nama, pendidikan, pendudukData, activeMetric) }))
            .filter(item => Number.isFinite(item.value));

        return rows.sort((a, b) => active.sort === "asc" ? a.value - b.value : b.value - a.value);
    }, [pendidikan, pendudukData, activeMetric, active.sort]);

    const visibleRows = rankingList.slice(0, limit);
    const maxValue = active.sort === "asc"
        ? Math.max(...visibleRows.map(item => item.value), 1)
        : Math.max(...rankingList.map(item => item.value), 1);

    return (
        <div style={{ height: "100%", padding: 17, boxSizing: "border-box", display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div style={{ flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                <div>
                    <p style={{ margin: 0, color: color.muted, fontSize: 10.5, fontWeight: 950, letterSpacing: 0.9, textTransform: "uppercase" }}>Ranking kecamatan</p>
                    <h3 style={{ margin: "5px 0 0", color: color.ink, fontSize: 18, lineHeight: 1.12, letterSpacing: -0.5 }}>{active.label}</h3>
                </div>
                <span style={{ color: color.subtle, fontSize: 11, fontWeight: 750, lineHeight: 1.35, textAlign: "right", maxWidth: 130 }}>{active.note}</span>
            </div>

            <div style={{ overflowY: "auto", minHeight: 0, display: "grid", gap: 8, paddingRight: 2 }}>
                {visibleRows.map((item, index) => {
                    const ratio = active.sort === "asc"
                        ? Math.max(8, Math.min(100, (item.value / maxValue) * 100))
                        : Math.max(8, Math.min(100, (item.value / maxValue) * 100));
                    const top = index < 3;
                    const accent = barColor(activeMetric, index);

                    return (
                        <button
                            key={item.nama}
                            onClick={() => onSelectKecamatan(item.nama)}
                            style={{
                                width: "100%",
                                border: `1px solid ${top ? `${accent}55` : color.border}`,
                                background: top ? "#FFFFFF" : color.soft,
                                borderRadius: 15,
                                padding: "10px 11px",
                                textAlign: "left",
                                cursor: "pointer",
                                boxShadow: top ? "0 10px 22px rgba(15,23,42,0.06)" : "none",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                                <div style={{ minWidth: 0, display: "flex", alignItems: "center", gap: 9 }}>
                                    <span style={{ width: 26, height: 26, borderRadius: 10, display: "grid", placeItems: "center", flexShrink: 0, color: top ? "#FFFFFF" : color.muted, background: top ? accent : "#E2E8F0", fontSize: 11, fontWeight: 950 }}>
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span style={{ minWidth: 0 }}>
                                        <span style={{ display: "block", color: color.ink, fontSize: 13, fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.nama}</span>
                                        <span style={{ display: "block", marginTop: 2, color: color.muted, fontSize: 10.5, fontWeight: 700 }}>{active.unit}</span>
                                    </span>
                                </div>
                                <strong style={{ color: top ? accent : color.ink, fontSize: 12.5, flexShrink: 0 }}>{formatValue(item.value, activeMetric)}</strong>
                            </div>
                            <div style={{ height: 6, borderRadius: 99, background: "#E2E8F0", overflow: "hidden", marginTop: 9 }}>
                                <span style={{ display: "block", width: `${ratio}%`, height: "100%", borderRadius: 99, background: accent }} />
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
