interface Props {
    pendidikan: any;
    pendudukData: any;
    activeMetric: string;
    onSelectKecamatan: (nama: string, data: any) => void;
}

export default function RankPanel({ pendidikan, pendudukData, activeMetric, onSelectKecamatan }: Props) {
    const calculateValue = (nama: string) => {
        const data = pendidikan[nama];
        const penduduk = pendudukData[nama];
        if (!data) return 0;

        switch (activeMetric) {
            case "beban":       return data["Beban Kerja"] || 0;
            case "pemerataan":  return data["Total Siswa"] / (penduduk?.Total || 1);
            case "sd":          return data["Jumlah Sekolah SD"] || 0;
            case "smp":         return data["Jumlah Sekolah SMP"] || 0;
            case "sma":         return data["Jumlah Sekolah SMA"] || 0;
            case "guruSd":      return data["Jumlah Guru SD"] || 0;
            case "guruSmp":     return data["Jumlah Guru SMP"] || 0;
            case "guruSma":     return data["Jumlah Guru SMA"] || 0;
            case "usiaSd":      return penduduk?.SD || 0;
            case "usiaSmp":     return penduduk?.SMP || 0;
            case "usiaSma":     return penduduk?.SMA || 0;
            default:            return 0;
        }
    };

    const rankingList = Object.keys(pendidikan)
        .map(nama => ({ nama, value: calculateValue(nama) }))
        .sort((a, b) => b.value - a.value);

    return (
        <div style={{
            flex: 1,
            background: "white",
            border: "0.5px solid #C0DD97",
            borderRadius: 10,
            padding: "14px 12px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
        }}>
            <p style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#3B6D11",
                margin: "0 0 8px",
                letterSpacing: ".6px",
                textTransform: "uppercase",
                flexShrink: 0,
            }}>
                Ranking Kecamatan
            </p>

            <div style={{ overflowY: "auto", flex: 1 }}>
                {rankingList.map((item, index) => (
                    <div
                        key={item.nama}
                        onClick={() => onSelectKecamatan(item.nama, pendidikan[item.nama])}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "5px 6px",
                            borderRadius: 6,
                            cursor: "pointer",
                            marginBottom: 2,
                            background: index === 0 ? "#EAF3DE" : "transparent",
                            transition: "background 0.12s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#EAF3DE")}
                        onMouseLeave={e => (e.currentTarget.style.background = index === 0 ? "#EAF3DE" : "transparent")}
                    >
                        <span style={{ fontSize: 11, color: index < 3 ? "#173404" : "#5F5E5A", fontWeight: index < 3 ? 500 : 400 }}>
                            {index + 1}. {item.nama}
                        </span>
                        <span style={{ fontSize: 11, color: index < 3 ? "#3B6D11" : "#888780", fontWeight: index < 3 ? 500 : 400 }}>
                            {item.value.toLocaleString("id-ID", { maximumFractionDigits: 2 })}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}