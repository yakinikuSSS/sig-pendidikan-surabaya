import { MapContainer, TileLayer, GeoJSON, ZoomControl } from "react-leaflet";
import { useEffect, useState, useMemo } from "react";
import type { FeatureCollection } from "geojson";
import InfoPanel from "../ui/InfoPanel";
import SidebarPanel from "../ui/SidebarPanel";
import RankPanel from "../ui/RankPanel";
import { EducationDiagram } from "../diagram/EducationDiagram";
import { calculateMetricValue, getColorByMetric, BLUE_PALETTE } from "../utils";

export default function MapView() {
    const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
    const [pendidikan, setPendidikan] = useState<any>({});
    const [pendudukData, setPendudukData] = useState<any>({});
    const [selected, setSelected] = useState<any>(null);
    const [activeMetric, setActiveMetric] = useState<string>("beban");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetch("/data/surabaya_kecamatan.geojson")
            .then(res => res.json())
            .then((data: FeatureCollection) => setGeoData(data))
            .catch(err => console.error("Error loading GeoJSON:", err));

        fetch("/data/data_persebaran_pendidikan.json")
            .then(res => res.json())
            .then(data => setPendidikan(data))
            .catch(err => console.error("Error loading Pendidikan data:", err));

        fetch("/data/data_umur.json")
            .then(res => res.json())
            .then(data => setPendudukData(data))
            .catch(err => console.error("Error loading Penduduk data:", err));
    }, []);

    const onEachFeature = (feature: any, layer: any) => {
        layer.on({
            mouseover: (e: any) => {
                e.target.setStyle({ weight: 3, color: "#F59E0B", fillOpacity: 0.9 });
            },
            mouseout: (e: any) => {
                const nama = feature.properties.name;
                if (!(selected && selected.nama === nama)) {
                    e.target.setStyle({ weight: 1.5, color: "#ffffff", fillOpacity: 0.75 });
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

    const style = (feature: any) => {
        const nama = feature.properties.name;
        const value = calculateMetricValue(nama, pendidikan, pendudukData, activeMetric);

        if (selected && selected.nama === nama) {
            return { fillColor: "#F59E0B", weight: 3, color: "#B45309", fillOpacity: 0.95 };
        }

        return {
            fillColor: getColorByMetric(value, activeMetric),
            weight: 1.5,
            color: "#ffffff",
            fillOpacity: 0.75,
        };
    };

    const floatingPanelStyle: React.CSSProperties = {
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(12px)",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        zIndex: 1000,
        overflow: "hidden"
    };

    const filteredKecamatan = useMemo(() => {
        if (!searchQuery) return [];
        return Object.keys(pendidikan).filter(nama => 
            nama.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, pendidikan]);

    return (
        <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", background: "#E2E8F0", fontFamily: "'Inter', sans-serif" }}>
            
            {/* Peta Full Screen */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
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
                    <ZoomControl position="topright" />
                </MapContainer>
            </div>

            {/* Search Bar */}
            <div style={{
                position: "absolute",
                top: 20,
                left: 280,
                width: "300px",
                zIndex: 1001,
                display: "flex",
                flexDirection: "column",
                gap: "4px"
            }}>
                <div style={{
                    ...floatingPanelStyle,
                    padding: "10px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                }}>
                    <span style={{ fontSize: "16px" }}>🔍</span>
                    <input 
                        type="text" 
                        placeholder="Cari Kecamatan..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            border: "none",
                            background: "transparent",
                            outline: "none",
                            width: "100%",
                            fontSize: "14px",
                            color: BLUE_PALETTE.text
                        }}
                    />
                </div>
                {searchQuery && filteredKecamatan.length > 0 && (
                    <div style={{
                        ...floatingPanelStyle,
                        maxHeight: "200px",
                        overflowY: "auto",
                        padding: "8px 0"
                    }}>
                        {filteredKecamatan.map(nama => (
                            <div 
                                key={nama}
                                onClick={() => {
                                    setSelected({ nama, data: pendidikan[nama] });
                                    setSearchQuery("");
                                }}
                                style={{
                                    padding: "8px 16px",
                                    fontSize: "13px",
                                    cursor: "pointer",
                                    transition: "background 0.2s"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = BLUE_PALETTE.bg}
                                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                            >
                                {nama}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Sidebar Kiri Mengambang */}
            <div style={{
                position: "absolute",
                top: 20,
                left: 20,
                bottom: 20,
                width: "240px",
                ...floatingPanelStyle
            }}>
                <SidebarPanel activeMetric={activeMetric} setActiveMetric={setActiveMetric} />
            </div>

            {/* Panel Kanan Mengambang (Info & Ranking) */}
            <div style={{
                position: "absolute",
                top: 20,
                right: 20,
                bottom: 20,
                width: "280px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                zIndex: 1000
            }}>
                <div style={{ ...floatingPanelStyle, flexShrink: 0 }}>
                    <InfoPanel selected={selected} />
                </div>
                <div style={{ ...floatingPanelStyle, flex: 1, display: "flex", flexDirection: "column" }}>
                    <RankPanel
                        pendidikan={pendidikan}
                        pendudukData={pendudukData}
                        activeMetric={activeMetric}
                        onSelectKecamatan={(nama, data) => setSelected({ nama, data })}
                        selectedKecamatan={selected?.nama}
                    />
                </div>
            </div>

            {/* Legend Peta */}
            <div style={{
                position: "absolute",
                bottom: 260,
                left: 280,
                padding: "12px 16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                ...floatingPanelStyle
            }}>
                {[
                    { color: "#1E3A8A", label: "Sangat tinggi" },
                    { color: "#2563EB", label: "Tinggi" },
                    { color: "#93C5FD", label: "Sedang" },
                    { color: "#EFF6FF", label: "Rendah", border: "1px solid #DBEAFE" },
                ].map(item => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ width: 14, height: 14, background: item.color, borderRadius: 4, display: "inline-block", border: (item as any).border || "none" }} />
                        <span style={{ fontSize: 12, color: "#1E293B", fontWeight: 500 }}>{item.label}</span>
                    </div>
                ))}
            </div>

            {/* Diagram Bawah Mengambang */}
            <div style={{
                position: "absolute",
                bottom: 20,
                left: 280,
                right: 320,
                height: "220px",
                ...floatingPanelStyle
            }}>
                <EducationDiagram 
                    activeMetric={activeMetric} 
                    pendidikan={pendidikan}
                    pendudukData={pendudukData}
                    selectedKecamatan={selected?.nama}
                    onSelectKecamatan={(nama) => setSelected({ nama, data: pendidikan[nama] })}
                />
            </div>

        </div>
    );
}