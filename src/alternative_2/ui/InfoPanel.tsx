import React from "react";
import { BLUE_PALETTE } from "../utils";

interface Props {
    selected: any;
}

export default function InfoPanel({ selected }: Props) {
    const stats = [
        { label: "Total Sekolah", value: selected?.data?.["Total Sekolah"] ?? "—", icon: "🏫" },
        { label: "Total Siswa",   value: selected?.data?.["Total Siswa"]?.toLocaleString("id-ID") ?? "—", icon: "🧑‍🎓" },
        { label: "Total Guru",    value: selected?.data?.["Total Guru"]?.toLocaleString("id-ID") ?? "—", icon: "👨‍🏫" },
        { label: "Beban Kerja",   value: selected?.data?.["Beban Kerja"]?.toFixed(2) ?? "—", icon: "⚖️" },
    ];

    return (
        <div style={{
            padding: "20px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
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
                📍 Info Wilayah
            </p>

            {selected ? (
                <>
                    <h3 style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: BLUE_PALETTE.text,
                        margin: "4px 0 8px 0",
                    }}>
                        {selected.nama}
                    </h3>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        {stats.map(s => (
                            <div key={s.label} style={{
                                background: BLUE_PALETTE.bg,
                                border: `1px solid ${BLUE_PALETTE.pale}`,
                                borderRadius: "12px",
                                padding: "12px 10px",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                                    <span style={{ fontSize: 14 }}>{s.icon}</span>
                                    <span style={{ fontSize: 10, color: BLUE_PALETTE.muted, fontWeight: 600, textTransform: "uppercase" }}>{s.label}</span>
                                </div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: BLUE_PALETTE.dark }}>{s.value}</div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div style={{ padding: "24px 0", textAlign: "center", background: "#F8FAFC", borderRadius: "12px", border: "1px dashed #CBD5E1" }}>
                    <p style={{ fontSize: 24, margin: "0 0 8px" }}>🗺️</p>
                    <p style={{ fontSize: 13, color: "#94A3B8", margin: 0, fontWeight: 500 }}>
                        Pilih area di peta <br/> untuk melihat detail
                    </p>
                </div>
            )}
        </div>
    );
}