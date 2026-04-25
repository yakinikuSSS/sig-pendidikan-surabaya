interface Props {
    selected: any;
}

export default function InfoPanel({ selected }: Props) {
    if (!selected) return null;

    return (
        <div style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: 250,
            minHeight: 120,
            background: "white",
            padding: 12,
            zIndex: 1000,
            borderRadius: 8,
            textAlign: "center",
        }}>
            <h4>{selected.nama}</h4>

            <div style={{ fontSize: 14, lineHeight: "20px" }}>
                <div>Total Sekolah: {selected.data?.["Total Sekolah"]}</div>
                <div>Total Siswa: {selected.data?.["Total Siswa"]}</div>
                <div>Total Guru: {selected.data?.["Total Guru"]}</div>
                <div>Beban Kerja: {selected.data?.["Beban Kerja"]?.toFixed(5)}
                </div>
            </div>
        </div>
    );
}