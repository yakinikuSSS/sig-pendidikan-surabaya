interface Props {
    selected: any;
}

export default function InfoPanel({ selected }: Props) {
    const stats = [
        { label: "Total Sekolah", value: selected?.data?.["Total Sekolah"] ?? "—" },
        { label: "Total Siswa",   value: selected?.data?.["Total Siswa"]?.toLocaleString("id-ID") ?? "—" },
        { label: "Total Guru",    value: selected?.data?.["Total Guru"]?.toLocaleString("id-ID") ?? "—" },
        { label: "Beban Kerja",   value: selected?.data?.["Beban Kerja"]?.toFixed(2) ?? "—" },
    ];

    return (
        <div style={{
            background: "white",
            border: "0.5px solid #C0DD97",
            borderRadius: 10,
            padding: "14px 12px",
            boxSizing: "border-box",
        }}>
            <p style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#3B6D11",
                margin: "0 0 8px",
                letterSpacing: ".6px",
                textTransform: "uppercase",
            }}>
                Info Wilayah
            </p>

            {selected ? (
                <>
                    <p style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#173404",
                        margin: "0 0 10px",
                        textAlign: "center",
                    }}>
                        {selected.nama}
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                        {stats.map(s => (
                            <div key={s.label} style={{
                                background: "#EAF3DE",
                                borderRadius: 7,
                                padding: "8px 6px",
                                textAlign: "center",
                            }}>
                                <div style={{ fontSize: 10, color: "#3B6D11", marginBottom: 3 }}>{s.label}</div>
                                <div style={{ fontSize: 16, fontWeight: 600, color: "#173404" }}>{s.value}</div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <p style={{ fontSize: 12, color: "#97C459", textAlign: "center", margin: "10px 0" }}>
                    — Pilih kecamatan pada peta —
                </p>
            )}
        </div>
    );
}