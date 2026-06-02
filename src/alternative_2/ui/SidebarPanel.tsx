import { BLUE_PALETTE } from "../utils";

interface Props {
    activeMetric: string;
    setActiveMetric: (value: string) => void;
}

// Data dikelompokkan agar lebih rapi dan mudah dibaca
const menuGroups = [
    {
        title: "Indikator Utama",
        items: [
            { key: "beban",      label: "Beban Kerja Guru", icon: "⚖️" },
            { key: "pemerataan", label: "Pemerataan Pendidikan", icon: "🎯" },
        ]
    },
    {
        title: "Demografi Siswa",
        items: [
            { key: "usiaSd",    label: "Usia SD (7–12 th)", icon: "🧒" },
            { key: "usiaSmp",   label: "Usia SMP (13–15 th)", icon: "🧑" },
            { key: "usiaSma",   label: "Usia SMA (16–18 th)", icon: "👨‍🎓" },
        ]
    },
    {
        title: "Fasilitas Sekolah",
        items: [
            { key: "sd",        label: "Jumlah SD / MI", icon: "🏫" },
            { key: "smp",       label: "Jumlah SMP / MTs", icon: "🏢" },
            { key: "sma",       label: "Jumlah SMA / SMK / MA", icon: "🏛️" },
        ]
    },
    {
        title: "Tenaga Pengajar",
        items: [
            { key: "guruSd",    label: "Guru SD / MI", icon: "👩‍🏫" },
            { key: "guruSmp",   label: "Guru SMP / MTs", icon: "👨‍🏫" },
            { key: "guruSma",   label: "Guru SMA / SMK / MA", icon: "🎓" },
        ]
    }
];

export default function SidebarPanel({ activeMetric, setActiveMetric }: Props) {
    return (
        <div style={{
            height: "100%",
            padding: "20px 16px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            scrollbarWidth: "none", 
            msOverflowStyle: "none",
        }}>
            <h2 style={{
                fontSize: 18,
                fontWeight: 700,
                color: BLUE_PALETTE.text,
                margin: "0 0 20px 0",
                display: "flex",
                alignItems: "center",
                gap: 8,
                letterSpacing: "-0.5px"
            }}>
                <span style={{ fontSize: 20 }}>🗺️</span> Peta Edukasi
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {menuGroups.map((group, idx) => (
                    <div key={idx}>
                        <p style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: BLUE_PALETTE.muted,
                            margin: "0 0 8px 4px",
                            letterSpacing: "0.8px",
                            textTransform: "uppercase",
                        }}>
                            {group.title}
                        </p>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            {group.items.map(m => {
                                const isActive = activeMetric === m.key;
                                return (
                                    <button
                                        key={m.key}
                                        onClick={() => setActiveMetric(m.key)}
                                        style={{
                                            width: "100%",
                                            textAlign: "left",
                                            padding: "10px 12px",
                                            borderRadius: "10px",
                                            border: "none",
                                            background: isActive ? BLUE_PALETTE.mid : "transparent",
                                            color: isActive ? "#FFFFFF" : BLUE_PALETTE.text,
                                            fontSize: 13,
                                            fontWeight: isActive ? 600 : 500,
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            boxShadow: isActive ? `0 4px 10px rgba(37, 99, 235, 0.3)` : "none"
                                        }}
                                        onMouseEnter={e => {
                                            if (!isActive) {
                                                e.currentTarget.style.background = BLUE_PALETTE.bg;
                                                e.currentTarget.style.color = BLUE_PALETTE.dark;
                                                e.currentTarget.style.transform = "translateX(4px)";
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (!isActive) {
                                                e.currentTarget.style.background = "transparent";
                                                e.currentTarget.style.color = BLUE_PALETTE.text;
                                                e.currentTarget.style.transform = "translateX(0)";
                                            }
                                        }}
                                    >
                                        <span style={{ 
                                            fontSize: 16, 
                                            opacity: isActive ? 1 : 0.7,
                                            filter: isActive ? "none" : "grayscale(50%)" 
                                        }}>
                                            {m.icon}
                                        </span>
                                        {m.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}