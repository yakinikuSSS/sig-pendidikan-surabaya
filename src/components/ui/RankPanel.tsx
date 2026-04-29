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
            case "beban": return data["Beban Kerja"] || 0;
            case "pemerataan": return (data["Total Siswa"] / (penduduk?.Total || 1));
            case "sd": return data["Jumlah Sekolah SD"] || 0;
            case "smp": return data["Jumlah Sekolah SMP"] || 0;
            case "sma": return data["Jumlah Sekolah SMA"] || 0;
            case "guruSd": return data["Jumlah Guru SD"] || 0;
            case "guruSmp": return data["Jumlah Guru SMP"] || 0;
            case "guruSma": return data["Jumlah Guru SMA"] || 0;
            case "usiaSd": return penduduk?.SD || 0
            case "usiaSmp": return penduduk?.SMP || 0
            case "usiaSma": return penduduk?.SMA || 0
            case "pemerataanSd": return (data["Jumlah Siswa SD"] / (penduduk?.SD || 1));
            case "pemerataanSmp": return (data["Jumlah Siswa SMP"] / (penduduk?.SMP || 1));
            case "pemerataanSma": return (data["Jumlah Siswa SMA"] / (penduduk?.SMA || 1));
            default: return 0;
        }
    }

    const rankingList = Object.keys(pendidikan)
        .map(nama => ({
            nama,
            value: calculateValue(nama)
        }))
        .sort((a, b) => b.value - a.value);

    return (
        <>
            <div style={{ position: "absolute", bottom: 20, right: 20, width: 250, maxHeight: "40vh", background: "white", padding: 12, zIndex: 1000, borderRadius: 8, boxShadow: "0 2px 10px rgba(0,0,0,0.2)", overflowY: "auto" }}>
                <h4>Ranking Teratas ({activeMetric})</h4>
                <table>
                    <tbody>
                        {rankingList.map((item, index) => (
                            <tr key={item.nama} onClick={() => onSelectKecamatan(item.nama, pendidikan[item.nama])}
                                style={{ cursor: "pointer", borderBottom: "1px solid #eee" }}
                            >
                                <td style={{ padding: "4px 0" }}>{index + 1}</td>
                                <td style={{ padding: "4px 0" }}>{item.nama}</td>
                                <td style={{ padding: "4px 0" }}>{item.value.toLocaleString("id-ID", { maximumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}