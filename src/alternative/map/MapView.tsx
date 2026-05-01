import { MapContainer, TileLayer, GeoJSON, ZoomControl } from "react-leaflet";
import { useEffect, useState } from "react";
import type { FeatureCollection } from "geojson";
import InfoPanel from "../ui/InfoPanel";
import SidebarPanel from "../ui/SidebarPanel";
import RankPanel from "../ui/RankPanel";
import { EducationDiagram } from "../diagram/EducationDiagram";

export default function MapView() {
    const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
    const [pendidikan, setPendidikan] = useState<any>({});
    const [pendudukData, setPendudukData] = useState<any>({});
    const [selected, setSelected] = useState<any>(null);
    const [activeMetric, setActiveMetric] = useState<string>("beban");

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
        fetch("/data/data_penduduk.json")
            .then(res => res.json())
            .then(data => setPendudukData(data));
    }, []);

    const onEachFeature = (feature: any, layer: any) => {
        layer.on({
            mouseover: (e: any) => {
                e.target.setStyle({ weight: 3, color: "#27500A", fillOpacity: 0.85 });
            },
            mouseout: (e: any) => {
                const nama = feature.properties.name;
                if (!(selected && selected.nama === nama)) {
                    e.target.setStyle({ weight: 1.5, color: "#ffffff", fillOpacity: 0.65 });
                }
            },
            click: () => {
                const nama = feature.properties.name;
                if (selected && selected.nama === nama) {
                    setSelected(null);
                    return;
                }
                setSelected({ nama, data: pendidikan[nama] });
            },
        });
    };

    const getValue = (nama: string) => {
        const data = pendidikan[nama];
        const penduduk = pendudukData[nama];
        if (!data) return 0;

        switch (activeMetric) {
            case "beban": return data["Beban Kerja"] || 0;
            case "pemerataan": return data["Total Siswa"] / (penduduk?.Total || 1);
            case "sd": return data["Jumlah Sekolah SD"] || 0;
            case "smp": return data["Jumlah Sekolah SMP"] || 0;
            case "sma": return data["Jumlah Sekolah SMA"] || 0;
            case "guruSd": return data["Jumlah Guru SD"] || 0;
            case "guruSmp": return data["Jumlah Guru SMP"] || 0;
            case "guruSma": return data["Jumlah Guru SMA"] || 0;
            case "usiaSd": return penduduk?.SD || 0;
            case "usiaSmp": return penduduk?.SMP || 0;
            case "usiaSma": return penduduk?.SMA || 0;
            default: return 0;
        }
    };

    const getColorByMetric = (value: number) => {
        switch (activeMetric) {
            case "sd":
                if (value > 45) return "#173404";
                if (value > 30) return "#3B6D11";
                if (value > 15) return "#97C459";
                return "#EAF3DE";
            case "smp":
                if (value > 14) return "#173404";
                if (value > 10) return "#3B6D11";
                if (value > 6) return "#97C459";
                return "#EAF3DE";
            case "sma":
                if (value > 8) return "#173404";
                if (value > 5) return "#3B6D11";
                if (value > 2) return "#97C459";
                return "#EAF3DE";
            case "guruSd":
                if (value > 500) return "#173404";
                if (value > 300) return "#3B6D11";
                if (value > 150) return "#97C459";
                return "#EAF3DE";
            case "guruSmp":
                if (value > 250) return "#173404";
                if (value > 180) return "#3B6D11";
                if (value > 120) return "#97C459";
                return "#EAF3DE";
            case "guruSma":
                if (value > 400) return "#173404";
                if (value > 200) return "#3B6D11";
                if (value > 100) return "#97C459";
                return "#EAF3DE";
            case "usiaSd":
                if (value > 15000) return "#173404";
                if (value > 10000) return "#3B6D11";
                if (value > 7000) return "#97C459";
                return "#EAF3DE";
            case "usiaSmp":
                if (value > 7000) return "#173404";
                if (value > 5000) return "#3B6D11";
                if (value > 3000) return "#97C459";
                return "#EAF3DE";
            case "usiaSma":
                if (value > 7000) return "#173404";
                if (value > 5000) return "#3B6D11";
                if (value > 3000) return "#97C459";
                return "#EAF3DE";
            case "beban":
                if (value > 20) return "#173404";
                if (value > 17) return "#3B6D11";
                if (value > 12) return "#97C459";
                return "#EAF3DE";
            case "pemerataan":
                if (value >= 1.1) return "#173404";
                if (value > 0.8) return "#3B6D11";
                if (value > 0.6) return "#97C459";
                return "#EAF3DE";
            default:
                return "#EAF3DE";
        }
    };

    const style = (feature: any) => {
        const nama = feature.properties.name;
        const value = getValue(nama);

        if (selected && selected.nama === nama) {
            return { fillColor: "#639922", weight: 3, color: "#27500A", fillOpacity: 0.95 };
        }

        return {
            fillColor: getColorByMetric(value),
            weight: 1.5,
            color: "#ffffff",
            fillOpacity: 0.65,
        };
    };

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "190px minmax(0, 1fr) 215px",
            gridTemplateRows: "1fr 230px",
            height: "100vh",
            gap: 8,
            padding: 10,
            background: "#f2f7ec",
            boxSizing: "border-box",
        }}>
            {/* Kolom kiri — sidebar navigasi (span 2 baris) */}
            <div style={{ gridColumn: 1, gridRow: "1 / 3" }}>
                <SidebarPanel activeMetric={activeMetric} setActiveMetric={setActiveMetric} />
            </div>

            {/* Tengah atas — peta */}
            <div style={{
                gridColumn: 2,
                gridRow: 1,
                borderRadius: 10,
                overflow: "hidden",
                border: "0.5px solid #C0DD97",
                position: "relative",
            }}>
                {/* Legend */}
                <div style={{
                    position: "absolute",
                    bottom: 40,
                    left: 10,
                    zIndex: 1000,
                    background: "white",
                    border: "0.5px solid #C0DD97",
                    borderRadius: 8,
                    padding: "8px 10px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                }}>
                    {[
                        { color: "#173404", label: "Sangat tinggi" },
                        { color: "#3B6D11", label: "Tinggi" },
                        { color: "#97C459", label: "Sedang" },
                        { color: "#EAF3DE", label: "Rendah", border: "0.5px solid #C0DD97" },
                    ].map(item => (
                        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ width: 12, height: 12, background: item.color, borderRadius: 3, display: "inline-block", border: (item as any).border || "none" }} />
                            <span style={{ fontSize: 11, color: "#27500A" }}>{item.label}</span>
                        </div>
                    ))}
                </div>

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
                            key={activeMetric + (selected?.nama || "")}
                            data={geoData}
                            style={style}
                            onEachFeature={onEachFeature}
                        />
                    )}
                    <ZoomControl position="bottomright" />
                </MapContainer>
            </div>

            {/* Kanan — info + ranking (span 2 baris) */}
            <div style={{ gridColumn: 3, gridRow: "1 / 3" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, height: "100%" }}>
                    <InfoPanel selected={selected} />
                    <RankPanel
                        pendidikan={pendidikan}
                        pendudukData={pendudukData}
                        activeMetric={activeMetric}
                        onSelectKecamatan={(nama, data) => setSelected({ nama, data })}
                    />
                </div>
            </div>

            {/* Tengah bawah — grafik */}
            <div style={{
                gridColumn: 2,
                gridRow: 2,
                borderRadius: 10,
                overflow: "hidden",
                border: "0.5px solid #C0DD97",
                background: "white",
            }}>
                <EducationDiagram activeMetric={activeMetric} />
            </div>
        </div>
    );
}