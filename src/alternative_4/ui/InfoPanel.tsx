import React from "react";

interface Props {
    selected: any;
    activeMetric: string;
}

const metricLabels: Record<string, { label: string; unit: string }> = {
    pemerataan: { label: "Indeks Pemerataan", unit: "rasio" },
    beban: { label: "Beban Kerja Guru", unit: "siswa/guru" },
    usiaSd: { label: "Penduduk Usia SD", unit: "jiwa" },
    usiaSmp: { label: "Penduduk Usia SMP", unit: "jiwa" },
    usiaSma: { label: "Penduduk Usia SMA", unit: "jiwa" },
    sd: { label: "Sekolah SD / MI", unit: "sekolah" },
    smp: { label: "Sekolah SMP / MTs", unit: "sekolah" },
    sma: { label: "Sekolah SMA / SMK / MA", unit: "sekolah" },
    guruSd: { label: "Guru SD / MI", unit: "guru" },
    guruSmp: { label: "Guru SMP / MTs", unit: "guru" },
    guruSma: { label: "Guru SMA / SMK / MA", unit: "guru" },
};

const color = {
    ink: "#0F172A",
    muted: "#64748B",
    subtle: "#94A3B8",
    border: "#DDE6F0",
    soft: "#F8FAFC",
    navy: "#0B2545",
    blue: "#2563EB",
    green: "#059669",
    orange: "#F97316",
    red: "#DC2626",
};

function formatNumber(value: any, maximumFractionDigits = 0) {
    if (value === undefined || value === null || Number.isNaN(Number(value))) return "—";
    return Number(value).toLocaleString("id-ID", { maximumFractionDigits });
}

function getMetricValue(selected: any, activeMetric: string) {
    const data = selected?.data;
    const penduduk = selected?.penduduk;

    switch (activeMetric) {
        case "pemerataan": return (data?.["Total Siswa"] || 0) / (penduduk?.Total || 1);
        case "beban": return data?.["Beban Kerja"] || 0;
        case "usiaSd": return penduduk?.SD || 0;
        case "usiaSmp": return penduduk?.SMP || 0;
        case "usiaSma": return penduduk?.SMA || 0;
        case "sd": return data?.["Jumlah Sekolah SD"] || 0;
        case "smp": return data?.["Jumlah Sekolah SMP"] || 0;
        case "sma": return data?.["Jumlah Sekolah SMA"] || 0;
        case "guruSd": return data?.["Jumlah Guru SD"] || 0;
        case "guruSmp": return data?.["Jumlah Guru SMP"] || 0;
        case "guruSma": return data?.["Jumlah Guru SMA"] || 0;
        default: return 0;
    }
}

function getStatus(activeMetric: string, value: number) {
    if (activeMetric === "pemerataan") {
        if (value < 0.65) return { label: "Prioritas", tone: color.red, bg: "#FEE2E2", copy: "Coverage rendah. Area ini layak masuk daftar perhatian pemerataan." };
        if (value < 0.85) return { label: "Perlu perhatian", tone: color.orange, bg: "#FFEDD5", copy: "Coverage belum kuat. Bandingkan dengan jumlah sekolah dan guru." };
        if (value < 1) return { label: "Cukup", tone: "#A16207", bg: "#FEF3C7", copy: "Coverage mendekati seimbang, tetapi tetap perlu dilihat bersama beban guru." };
        return { label: "Terlayani baik", tone: color.green, bg: "#D1FAE5", copy: "Coverage relatif baik dibanding populasi usia sekolah." };
    }

    if (activeMetric === "beban") {
        if (value > 20) return { label: "Sangat berat", tone: color.red, bg: "#FEE2E2", copy: "Rasio siswa per guru tinggi. Tekanan layanan lebih besar." };
        if (value > 17) return { label: "Berat", tone: color.orange, bg: "#FFEDD5", copy: "Beban guru relatif tinggi dan perlu dibaca bersama ketersediaan guru." };
        if (value > 12) return { label: "Sedang", tone: "#A16207", bg: "#FEF3C7", copy: "Beban guru berada pada level menengah." };
        return { label: "Ringan", tone: color.green, bg: "#D1FAE5", copy: "Beban guru relatif lebih ringan dibanding kecamatan lain." };
    }

    return { label: "Informasi", tone: color.blue, bg: "#DBEAFE", copy: "Gunakan indikator ini untuk membaca distribusi fasilitas, guru, atau kebutuhan penduduk." };
}

export default function InfoPanel({ selected, activeMetric }: Props) {
    const metric = metricLabels[activeMetric] || { label: "Indikator", unit: "" };

    if (!selected) {
        return (
            <div style={{ padding: 20, minHeight: 190, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: 18, display: "grid", placeItems: "center", background: "#DBEAFE", color: color.blue, fontSize: 22, fontWeight: 950 }}>⌖</div>
                <h3 style={{ margin: "14px 0 7px", color: color.ink, fontSize: 18, lineHeight: 1.15, letterSpacing: -0.5 }}>Pilih kecamatan</h3>
                <p style={{ margin: 0, color: color.muted, fontSize: 12.5, lineHeight: 1.5 }}>
                    Klik area pada peta untuk membuka profil pendidikan kecamatan, status indikator, dan rincian jenjang.
                </p>
            </div>
        );
    }

    const data = selected?.data || {};
    const penduduk = selected?.penduduk || {};
    const metricValue = getMetricValue(selected, activeMetric);
    const status = getStatus(activeMetric, metricValue);

    const stats = [
        { label: "Sekolah", value: data?.["Total Sekolah"], helper: "unit" },
        { label: "Siswa", value: data?.["Total Siswa"], helper: "orang" },
        { label: "Guru", value: data?.["Total Guru"], helper: "orang" },
        { label: "Usia sekolah", value: penduduk?.Total, helper: "jiwa" },
    ];

    const jenjangRows = [
        { label: "SD", sekolah: data?.["Jumlah Sekolah SD"], siswa: data?.["Jumlah Siswa SD"], guru: data?.["Jumlah Guru SD"], usia: penduduk?.SD },
        { label: "SMP", sekolah: data?.["Jumlah Sekolah SMP"], siswa: data?.["Jumlah Siswa SMP"], guru: data?.["Jumlah Guru SMP"], usia: penduduk?.SMP },
        { label: "SMA", sekolah: data?.["Jumlah Sekolah SMA"], siswa: data?.["Jumlah Siswa SMA"], guru: data?.["Jumlah Guru SMA"], usia: penduduk?.SMA },
    ];

    return (
        <div style={{ padding: 18, boxSizing: "border-box", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div>
                    <p style={{ margin: 0, color: color.muted, fontSize: 10.5, fontWeight: 950, letterSpacing: 0.9, textTransform: "uppercase" }}>Profil kecamatan</p>
                    <h3 style={{ margin: "6px 0 0", color: color.ink, fontSize: 24, lineHeight: 1.05, letterSpacing: -0.9 }}>{selected.nama}</h3>
                </div>
                <span style={{ padding: "7px 9px", borderRadius: 999, color: status.tone, background: status.bg, fontSize: 10.5, fontWeight: 950, whiteSpace: "nowrap" }}>
                    {status.label}
                </span>
            </div>

            <div style={{ marginTop: 14, padding: 15, borderRadius: 18, color: "#FFFFFF", background: `linear-gradient(135deg, ${color.navy} 0%, ${status.tone} 120%)`, boxShadow: "0 16px 32px rgba(15,23,42,0.13)" }}>
                <div style={{ fontSize: 10.5, opacity: 0.78, fontWeight: 900, letterSpacing: 0.8, textTransform: "uppercase" }}>{metric.label}</div>
                <div style={{ marginTop: 6, display: "flex", alignItems: "baseline", gap: 7 }}>
                    <strong style={{ fontSize: 33, lineHeight: 1, letterSpacing: -1 }}>{formatNumber(metricValue, activeMetric === "beban" || activeMetric === "pemerataan" ? 2 : 0)}</strong>
                    <span style={{ fontSize: 12.5, fontWeight: 750, opacity: 0.8 }}>{metric.unit}</span>
                </div>
            </div>

            <p style={{ margin: "12px 0 0", color: color.muted, fontSize: 12.5, lineHeight: 1.5 }}>
                {status.copy}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginTop: 14 }}>
                {stats.map(s => (
                    <div key={s.label} style={{ background: color.soft, border: `1px solid ${color.border}`, borderRadius: 15, padding: "10px 11px" }}>
                        <div style={{ color: color.muted, fontSize: 10, fontWeight: 950, textTransform: "uppercase", letterSpacing: 0.6 }}>{s.label}</div>
                        <div style={{ marginTop: 4, display: "flex", alignItems: "baseline", gap: 5 }}>
                            <strong style={{ color: color.ink, fontSize: 17 }}>{formatNumber(s.value)}</strong>
                            <span style={{ color: color.subtle, fontSize: 10.5, fontWeight: 750 }}>{s.helper}</span>
                        </div>
                    </div>
                ))}
            </div>

            <details style={{ marginTop: 14 }}>
                <summary style={{ cursor: "pointer", color: color.navy, fontSize: 12.5, fontWeight: 950 }}>Rincian per jenjang</summary>
                <div style={{ marginTop: 10, border: `1px solid ${color.border}`, borderRadius: 15, overflow: "hidden" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "0.55fr 0.9fr 1fr 0.9fr 1fr", background: "#EEF6FF", color: color.navy, fontSize: 9.3, fontWeight: 950, textTransform: "uppercase" }}>
                        {['Jenjang', 'Sekolah', 'Siswa', 'Guru', 'Usia'].map(head => <div key={head} style={{ padding: "8px 7px" }}>{head}</div>)}
                    </div>
                    {jenjangRows.map((row, index) => (
                        <div key={row.label} style={{ display: "grid", gridTemplateColumns: "0.55fr 0.9fr 1fr 0.9fr 1fr", borderTop: index === 0 ? "none" : `1px solid ${color.border}`, fontSize: 11, color: color.ink, fontWeight: 750, background: index % 2 === 0 ? "#FFFFFF" : color.soft }}>
                            <div style={{ padding: "8px 7px", fontWeight: 950 }}>{row.label}</div>
                            <div style={{ padding: "8px 7px" }}>{formatNumber(row.sekolah)}</div>
                            <div style={{ padding: "8px 7px" }}>{formatNumber(row.siswa)}</div>
                            <div style={{ padding: "8px 7px" }}>{formatNumber(row.guru)}</div>
                            <div style={{ padding: "8px 7px" }}>{formatNumber(row.usia)}</div>
                        </div>
                    ))}
                </div>
            </details>
        </div>
    );
}
