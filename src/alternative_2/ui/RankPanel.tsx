import { calculateMetricValue, BLUE_PALETTE } from "../utils";

interface Props {
    pendidikan: any;
    pendudukData: any;
    activeMetric: string;
    onSelectKecamatan: (nama: string, data: any) => void;
    selectedKecamatan?: string;
}

export default function RankPanel({ pendidikan, pendudukData, activeMetric, onSelectKecamatan, selectedKecamatan }: Props) {
    const rankingList = Object.keys(pendidikan)
        .map(nama => ({ nama, value: calculateMetricValue(nama, pendidikan, pendudukData, activeMetric) }))
        .sort((a, b) => b.value - a.value);

    return (
        <div style={{
            flex: 1,
            padding: "20px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
        }}>
            <p style={{
                fontSize: 12,
                fontWeight: 700,
                color: BLUE_PALETTE.muted,
                margin: "0 0 16px 0",
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexShrink: 0,
            }}>
                🏆 Ranking Kecamatan
            </p>

            <div style={{ 
                overflowY: "auto", 
                flex: 1, 
                paddingRight: "4px",
                scrollbarWidth: "thin",
                scrollbarColor: `${BLUE_PALETTE.light} transparent`
            }}>
                {rankingList.map((item, index) => {
                    const isTop3 = index < 3;
                    const isSelected = item.nama === selectedKecamatan;
                    return (
                        <div
                            key={item.nama}
                            onClick={() => onSelectKecamatan(item.nama, pendidikan[item.nama])}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "10px 12px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                marginBottom: "4px",
                                background: isSelected ? "#F59E0B" : (index === 0 ? BLUE_PALETTE.bg : "transparent"),
                                border: isSelected ? "1px solid #B45309" : (index === 0 ? `1px solid ${BLUE_PALETTE.pale}` : "1px solid transparent"),
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={e => {
                                if (!isSelected) {
                                    e.currentTarget.style.background = BLUE_PALETTE.bg;
                                    e.currentTarget.style.transform = "translateX(-2px)";
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isSelected) {
                                    e.currentTarget.style.background = index === 0 ? BLUE_PALETTE.bg : "transparent";
                                    e.currentTarget.style.transform = "translateX(0)";
                                }
                            }}
                        >
                            <span style={{ 
                                fontSize: 13, 
                                color: isSelected ? "#FFFFFF" : (isTop3 ? BLUE_PALETTE.dark : BLUE_PALETTE.text), 
                                fontWeight: (isTop3 || isSelected) ? 600 : 500 
                            }}>
                                <span style={{ width: "20px", display: "inline-block", opacity: isSelected ? 1 : 0.5 }}>{index + 1}.</span> 
                                {item.nama}
                            </span>
                            <span style={{ 
                                fontSize: 13, 
                                color: isSelected ? "#FFFFFF" : (isTop3 ? BLUE_PALETTE.mid : BLUE_PALETTE.muted), 
                                fontWeight: (isTop3 || isSelected) ? 700 : 600,
                                background: isSelected ? "rgba(0,0,0,0.1)" : (isTop3 ? BLUE_PALETTE.pale : "transparent"),
                                padding: (isTop3 || isSelected) ? "2px 8px" : "0",
                                borderRadius: "12px"
                            }}>
                                {item.value.toLocaleString("id-ID", { maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}