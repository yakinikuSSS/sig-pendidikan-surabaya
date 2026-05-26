import { MapContainer, TileLayer, GeoJSON, ZoomControl } from "react-leaflet";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { FeatureCollection } from "geojson";
import InfoPanel from "../ui/InfoPanel";
import SidebarPanel from "../ui/SidebarPanel";
import RankPanel from "../ui/RankPanel";
import { EducationDiagram } from "../diagram/EducationDiagram";

type MetricKey =
    | "pemerataan"
    | "beban"
    | "usiaSd"
    | "usiaSmp"
    | "usiaSma"
    | "sd"
    | "smp"
    | "sma"
    | "guruSd"
    | "guruSmp"
    | "guruSma";

type ViewMode = "map" | "report";

const metricCopy: Record<MetricKey, { label: string; short: string; insight: string; unit: string; orientation: "lowRisk" | "highRisk" | "neutral" }> = {
    pemerataan: {
        label: "Indeks Pemerataan Pendidikan",
        short: "Pemerataan",
        insight: "Rasio siswa terhadap penduduk usia sekolah. Nilai rendah dibaca sebagai area prioritas layanan.",
        unit: "rasio",
        orientation: "lowRisk",
    },
    beban: {
        label: "Beban Kerja Guru",
        short: "Beban Guru",
        insight: "Rasio siswa per guru. Nilai tinggi menandakan tekanan layanan pendidikan lebih berat.",
        unit: "siswa/guru",
        orientation: "highRisk",
    },
    usiaSd: {
        label: "Penduduk Usia SD",
        short: "Usia SD",
        insight: "Basis kebutuhan layanan pendidikan dasar usia 7–12 tahun.",
        unit: "jiwa",
        orientation: "neutral",
    },
    usiaSmp: {
        label: "Penduduk Usia SMP",
        short: "Usia SMP",
        insight: "Basis kebutuhan layanan pendidikan menengah pertama usia 13–15 tahun.",
        unit: "jiwa",
        orientation: "neutral",
    },
    usiaSma: {
        label: "Penduduk Usia SMA",
        short: "Usia SMA",
        insight: "Basis kebutuhan layanan pendidikan menengah atas usia 16–18 tahun.",
        unit: "jiwa",
        orientation: "neutral",
    },
    sd: {
        label: "Sebaran Sekolah SD / MI",
        short: "Sekolah SD",
        insight: "Distribusi unit pendidikan dasar per kecamatan.",
        unit: "sekolah",
        orientation: "neutral",
    },
    smp: {
        label: "Sebaran Sekolah SMP / MTs",
        short: "Sekolah SMP",
        insight: "Distribusi unit pendidikan menengah pertama per kecamatan.",
        unit: "sekolah",
        orientation: "neutral",
    },
    sma: {
        label: "Sebaran Sekolah SMA / SMK / MA",
        short: "Sekolah SMA",
        insight: "Distribusi unit pendidikan menengah atas per kecamatan.",
        unit: "sekolah",
        orientation: "neutral",
    },
    guruSd: {
        label: "Ketersediaan Guru SD / MI",
        short: "Guru SD",
        insight: "Distribusi tenaga pengajar SD per kecamatan.",
        unit: "guru",
        orientation: "neutral",
    },
    guruSmp: {
        label: "Ketersediaan Guru SMP / MTs",
        short: "Guru SMP",
        insight: "Distribusi tenaga pengajar SMP per kecamatan.",
        unit: "guru",
        orientation: "neutral",
    },
    guruSma: {
        label: "Ketersediaan Guru SMA / SMK / MA",
        short: "Guru SMA",
        insight: "Distribusi tenaga pengajar SMA sederajat per kecamatan.",
        unit: "guru",
        orientation: "neutral",
    },
};

const palette = {
    appBg: "#EEF3F8",
    ink: "#0F172A",
    muted: "#64748B",
    subtle: "#94A3B8",
    border: "#DDE6F0",
    panel: "#FFFFFF",
    panelSoft: "#F8FAFC",
    navy: "#0B2545",
    navy2: "#123A63",
    blue: "#2563EB",
    cyan: "#0891B2",
    green: "#059669",
    mint: "#A7F3D0",
    yellow: "#FACC15",
    orange: "#F97316",
    red: "#DC2626",
    redSoft: "#FEE2E2",
    amberSoft: "#FEF3C7",
    blueSoft: "#DBEAFE",
};

function formatNumber(value: number | string, maximumFractionDigits = 0) {
    if (value === "—") return value;
    return Number(value || 0).toLocaleString("id-ID", { maximumFractionDigits });
}

function formatMetric(value: number, activeMetric: MetricKey) {
    return formatNumber(value, activeMetric === "beban" || activeMetric === "pemerataan" ? 2 : 0);
}

export default function MapView() {
    const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
    const [pendidikan, setPendidikan] = useState<any>({});
    const [pendudukData, setPendudukData] = useState<any>({});
    const [selected, setSelected] = useState<any>(null);
    const [activeMetric, setActiveMetric] = useState<MetricKey>("pemerataan");
    const [viewMode, setViewMode] = useState<ViewMode>("map");

    useEffect(() => {
        fetch("/data/surabaya_kecamatan.geojson")
            .then(res => res.json())
            .then((data: FeatureCollection) => setGeoData(data));
    }, []);

    useEffect(() => {
        fetch("/data/data_persebaran_pendidikan.json")
            .then(res => res.json())
            .then(data => setPendidikan(data));
    }, []);

    useEffect(() => {
        fetch("/data/data_umur.json")
            .then(res => res.json())
            .then(data => setPendudukData(data));
    }, []);

    const getValue = (nama: string) => {
        const data = pendidikan[nama];
        const penduduk = pendudukData[nama];

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
    };

    const selectKecamatan = (nama: string) => {
        setSelected({
            nama,
            data: pendidikan[nama],
            penduduk: pendudukData[nama],
            metricValue: getValue(nama),
        });
    };

    const getColorByMetric = (value: number) => {
        if (activeMetric === "pemerataan") {
            if (value < 0.65) return palette.red;
            if (value < 0.85) return palette.orange;
            if (value < 1) return palette.yellow;
            return palette.green;
        }

        if (activeMetric === "beban") {
            if (value > 20) return palette.red;
            if (value > 17) return palette.orange;
            if (value > 12) return palette.yellow;
            return palette.green;
        }

        const thresholds: Record<string, [number, number, number]> = {
            sd: [45, 30, 15],
            smp: [14, 10, 6],
            sma: [8, 5, 2],
            guruSd: [500, 300, 150],
            guruSmp: [250, 180, 120],
            guruSma: [400, 200, 100],
            usiaSd: [15000, 10000, 7000],
            usiaSmp: [7000, 5000, 3000],
            usiaSma: [7000, 5000, 3000],
        };

        const [high, mid, low] = thresholds[activeMetric] || [0, 0, 0];
        if (value > high) return palette.navy2;
        if (value > mid) return palette.blue;
        if (value > low) return "#67E8F9";
        return "#E0F2FE";
    };

    const style = (feature: any) => {
        const nama = feature.properties.name;
        const isSelected = selected?.nama === nama;
        const value = getValue(nama);

        return {
            fillColor: isSelected ? "#111827" : getColorByMetric(value),
            weight: isSelected ? 3 : 1.2,
            color: isSelected ? "#FFFFFF" : "rgba(255,255,255,0.96)",
            fillOpacity: isSelected ? 0.95 : 0.76,
        };
    };

    const onEachFeature = (feature: any, layer: any) => {
        const nama = feature.properties.name;

        layer.bindTooltip(
            `<strong>${nama}</strong><br/>${metricCopy[activeMetric].short}: ${formatMetric(getValue(nama), activeMetric)} ${metricCopy[activeMetric].unit}`,
            { sticky: true, direction: "top", opacity: 0.95 }
        );

        layer.on({
            mouseover: (e: any) => {
                e.target.setStyle({ weight: 3, color: "#111827", fillOpacity: 0.9 });
            },
            mouseout: (e: any) => {
                if (selected?.nama !== nama) {
                    e.target.setStyle(style(feature));
                }
            },
            click: () => {
                if (selected?.nama === nama) {
                    setSelected(null);
                    return;
                }
                selectKecamatan(nama);
            },
        });
    };

    const rows = useMemo(() => Object.keys(pendidikan), [pendidikan]);

    const summaryStats = useMemo(() => {
        const totalSekolah = rows.reduce((acc, nama) => acc + (pendidikan[nama]?.["Total Sekolah"] || 0), 0);
        const totalSiswa = rows.reduce((acc, nama) => acc + (pendidikan[nama]?.["Total Siswa"] || 0), 0);
        const totalGuru = rows.reduce((acc, nama) => acc + (pendidikan[nama]?.["Total Guru"] || 0), 0);
        const totalUsia = rows.reduce((acc, nama) => acc + (pendudukData[nama]?.Total || 0), 0);
        const avgCoverage = totalSiswa / (totalUsia || 1);
        const avgLoad = rows.reduce((acc, nama) => acc + (pendidikan[nama]?.["Beban Kerja"] || 0), 0) / (rows.length || 1);
        return { totalKecamatan: rows.length, totalSekolah, totalSiswa, totalGuru, totalUsia, avgCoverage, avgLoad };
    }, [rows, pendidikan, pendudukData]);

    const metricRows = useMemo(() => {
        const list = rows.map(nama => ({ nama, value: getValue(nama) }));
        if (activeMetric === "pemerataan") return list.sort((a, b) => a.value - b.value);
        return list.sort((a, b) => b.value - a.value);
    }, [rows, pendidikan, pendudukData, activeMetric]);

    const priorityNames = metricRows.slice(0, 3).map(item => item.nama).join(", ");
    const activeCopy = metricCopy[activeMetric];

    const legendItems = activeMetric === "pemerataan"
        ? [
            { color: palette.red, label: "Prioritas" },
            { color: palette.orange, label: "Perlu perhatian" },
            { color: palette.yellow, label: "Cukup" },
            { color: palette.green, label: "Terlayani baik" },
        ]
        : activeMetric === "beban"
            ? [
                { color: palette.red, label: "Sangat berat" },
                { color: palette.orange, label: "Berat" },
                { color: palette.yellow, label: "Sedang" },
                { color: palette.green, label: "Ringan" },
            ]
            : [
                { color: palette.navy2, label: "Sangat tinggi" },
                { color: palette.blue, label: "Tinggi" },
                { color: "#67E8F9", label: "Sedang" },
                { color: "#E0F2FE", label: "Rendah" },
            ];

    const card: CSSProperties = {
        background: palette.panel,
        border: `1px solid ${palette.border}`,
        borderRadius: 22,
        boxShadow: "0 18px 42px rgba(15, 23, 42, 0.08)",
        overflow: "hidden",
    };

    return (
        <div style={{ width: "100%", height: "100vh", background: palette.appBg, color: palette.ink, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <header style={{ height: 70, flexShrink: 0, background: `linear-gradient(135deg, ${palette.navy} 0%, #0F3A5F 100%)`, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", boxSizing: "border-box", boxShadow: "0 16px 40px rgba(11, 37, 69, 0.25)", zIndex: 30 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 15, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", fontWeight: 950, letterSpacing: -1 }}>
                        ED
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.2, textTransform: "uppercase", color: "#93C5FD" }}>
                            GIS Pemerataan Pendidikan Surabaya
                        </div>
                        <h1 style={{ margin: "3px 0 0", fontSize: 20, lineHeight: 1.1, letterSpacing: -0.55, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            Membaca ketimpangan layanan pendidikan per kecamatan
                        </h1>
                    </div>
                </div>

                <nav style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    {[
                        { key: "map", label: "Peta Interaktif" },
                        { key: "report", label: "Laporan Analisis" },
                    ].map(item => {
                        const active = viewMode === item.key;
                        return (
                            <button
                                key={item.key}
                                onClick={() => setViewMode(item.key as ViewMode)}
                                style={{
                                    height: 38,
                                    padding: "0 16px",
                                    borderRadius: 12,
                                    border: `1px solid ${active ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.14)"}`,
                                    background: active ? "rgba(255,255,255,0.17)" : "transparent",
                                    color: "#FFFFFF",
                                    cursor: "pointer",
                                    fontSize: 12.5,
                                    fontWeight: 850,
                                }}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </header>

            <section style={{ height: 82, flexShrink: 0, display: "grid", gridTemplateColumns: "minmax(300px, 1.3fr) repeat(5, minmax(120px, 0.7fr))", gap: 12, padding: "14px 20px 0", boxSizing: "border-box" }}>
                <div style={{ ...card, padding: "13px 16px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 9, height: 9, borderRadius: 99, background: activeMetric === "pemerataan" ? palette.green : activeMetric === "beban" ? palette.orange : palette.blue, boxShadow: "0 0 0 5px rgba(37,99,235,0.12)" }} />
                        <span style={{ fontSize: 10.5, color: palette.muted, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.9 }}>Indikator aktif</span>
                    </div>
                    <div style={{ marginTop: 3, display: "flex", alignItems: "baseline", gap: 8, minWidth: 0 }}>
                        <strong style={{ fontSize: 18, letterSpacing: -0.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{activeCopy.label}</strong>
                        <span style={{ color: palette.muted, fontSize: 12, whiteSpace: "nowrap" }}>{activeCopy.unit}</span>
                    </div>
                </div>
                {[
                    { label: "Kecamatan", value: summaryStats.totalKecamatan || "—", helper: "wilayah" },
                    { label: "Sekolah", value: formatNumber(summaryStats.totalSekolah), helper: "unit" },
                    { label: "Siswa", value: formatNumber(summaryStats.totalSiswa), helper: "orang" },
                    { label: "Guru", value: formatNumber(summaryStats.totalGuru), helper: "orang" },
                    { label: "Rasio Kota", value: formatNumber(summaryStats.avgCoverage, 2), helper: "siswa/usia" },
                ].map(item => (
                    <div key={item.label} style={{ ...card, padding: "11px 14px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <span style={{ fontSize: 10, color: palette.muted, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.8 }}>{item.label}</span>
                        <div style={{ marginTop: 4, display: "flex", alignItems: "baseline", gap: 5 }}>
                            <strong style={{ fontSize: 18, letterSpacing: -0.45 }}>{item.value}</strong>
                            <span style={{ fontSize: 10.5, color: palette.subtle, fontWeight: 750 }}>{item.helper}</span>
                        </div>
                    </div>
                ))}
            </section>

            <main style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "300px minmax(520px, 1fr) 340px", gap: 16, padding: "16px 20px 20px", boxSizing: "border-box" }}>
                <SidebarPanel
                    activeMetric={activeMetric}
                    setActiveMetric={(value) => setActiveMetric(value as MetricKey)}
                    viewMode={viewMode}
                    setViewMode={(value) => setViewMode(value as ViewMode)}
                />

                {viewMode === "map" ? (
                    <section style={{ ...card, position: "relative", minHeight: 0 }}>
                        <div style={{ height: "100%", width: "100%" }}>
                            <MapContainer
                                center={[-7.27544, 112.74463] as any}
                                zoom={12}
                                zoomControl={false}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                    attribution="&copy; OpenStreetMap"
                                />
                                {geoData && (
                                    <GeoJSON
                                        key={`${activeMetric}-${selected?.nama || "none"}-${rows.length}`}
                                        data={geoData}
                                        style={style}
                                        onEachFeature={onEachFeature}
                                    />
                                )}
                                <ZoomControl position="topright" />
                            </MapContainer>
                        </div>

                        <div style={{ position: "absolute", top: 18, left: 18, right: 18, zIndex: 900, display: "flex", justifyContent: "space-between", gap: 12, pointerEvents: "none" }}>
                            <div style={{ background: "rgba(255,255,255,0.92)", border: `1px solid ${palette.border}`, borderRadius: 16, padding: "11px 13px", maxWidth: 520, boxShadow: "0 12px 28px rgba(15,23,42,0.09)", backdropFilter: "blur(12px)" }}>
                                <div style={{ fontSize: 10.5, color: palette.muted, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.8 }}>Pembacaan peta</div>
                                <div style={{ marginTop: 4, color: palette.ink, fontSize: 13, fontWeight: 800, lineHeight: 1.35 }}>
                                    {activeCopy.insight}
                                </div>
                            </div>
                            <div style={{ background: "rgba(255,255,255,0.92)", border: `1px solid ${palette.border}`, borderRadius: 16, padding: "11px 13px", minWidth: 190, boxShadow: "0 12px 28px rgba(15,23,42,0.09)", backdropFilter: "blur(12px)" }}>
                                <div style={{ fontSize: 10.5, color: palette.muted, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.8 }}>Prioritas cepat</div>
                                <div style={{ marginTop: 4, color: palette.ink, fontSize: 13, fontWeight: 850, lineHeight: 1.35 }}>
                                    {priorityNames || "Memuat data..."}
                                </div>
                            </div>
                        </div>

                        <div style={{ position: "absolute", left: 18, bottom: 18, zIndex: 900, background: "rgba(255,255,255,0.94)", border: `1px solid ${palette.border}`, borderRadius: 16, padding: "12px 14px", boxShadow: "0 14px 32px rgba(15,23,42,0.12)", backdropFilter: "blur(12px)" }}>
                            <div style={{ fontSize: 10.5, color: palette.muted, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 9 }}>
                                Legenda {activeCopy.unit}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 13px" }}>
                                {legendItems.map(item => (
                                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                        <span style={{ width: 13, height: 13, borderRadius: 4, background: item.color, border: item.color === palette.yellow || item.color === "#E0F2FE" ? "1px solid rgba(15,23,42,0.12)" : "none" }} />
                                        <span style={{ fontSize: 11.5, fontWeight: 800, color: palette.ink }}>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                ) : (
                    <section style={{ minHeight: 0, display: "grid", gridTemplateRows: "160px minmax(0, 1fr)", gap: 16 }}>
                        <div style={{ ...card, padding: 20, display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 20, alignItems: "center" }}>
                            <div>
                                <div style={{ fontSize: 11, color: palette.blue, fontWeight: 950, letterSpacing: 1, textTransform: "uppercase" }}>Ringkasan laporan</div>
                                <h2 style={{ margin: "8px 0 8px", fontSize: 24, lineHeight: 1.1, letterSpacing: -0.9 }}>Pemerataan pendidikan dibaca dari ruang, beban, dan kebutuhan usia sekolah.</h2>
                                <p style={{ margin: 0, color: palette.muted, fontSize: 13.5, lineHeight: 1.55 }}>
                                    Tab ini memisahkan laporan dari peta agar tampilan tidak penuh. Gunakan ranking untuk menemukan kecamatan prioritas, lalu kembali ke peta untuk melihat posisinya secara spasial.
                                </p>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                <div style={{ borderRadius: 18, background: palette.blueSoft, padding: 14 }}>
                                    <div style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 900, color: palette.navy2 }}>Rasio kota</div>
                                    <strong style={{ display: "block", marginTop: 7, fontSize: 26 }}>{formatNumber(summaryStats.avgCoverage, 2)}</strong>
                                </div>
                                <div style={{ borderRadius: 18, background: palette.amberSoft, padding: 14 }}>
                                    <div style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 900, color: "#92400E" }}>Beban guru</div>
                                    <strong style={{ display: "block", marginTop: 7, fontSize: 26 }}>{formatNumber(summaryStats.avgLoad, 2)}</strong>
                                </div>
                            </div>
                        </div>

                        <div style={{ minHeight: 0, display: "grid", gridTemplateColumns: "0.9fr 1.4fr", gap: 16 }}>
                            <div style={{ ...card, minHeight: 0 }}>
                                <RankPanel
                                    pendidikan={pendidikan}
                                    pendudukData={pendudukData}
                                    activeMetric={activeMetric}
                                    onSelectKecamatan={(nama) => {
                                        selectKecamatan(nama);
                                        setViewMode("map");
                                    }}
                                    limit={12}
                                />
                            </div>
                            <div style={{ ...card, minHeight: 0 }}>
                                <EducationDiagram activeMetric={activeMetric} />
                            </div>
                        </div>
                    </section>
                )}

                <aside style={{ minHeight: 0, display: "grid", gridTemplateRows: "auto minmax(0, 1fr)", gap: 16 }}>
                    <div style={{ ...card }}>
                        <InfoPanel selected={selected} activeMetric={activeMetric} />
                    </div>
                    <div style={{ ...card, minHeight: 0 }}>
                        <RankPanel
                            pendidikan={pendidikan}
                            pendudukData={pendudukData}
                            activeMetric={activeMetric}
                            onSelectKecamatan={selectKecamatan}
                            limit={viewMode === "map" ? 8 : 6}
                        />
                    </div>
                </aside>
            </main>
        </div>
    );
}
